import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Plus, Wallet, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { storageService } from '../services/storage'
import { priceService } from '../services/priceService'
import { useAuth } from '../context/AuthContext'
import AssetList from '../components/portfolio/AssetList'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import AssetForm from '../components/portfolio/AssetForm'
import PortfolioStockDetailsModal from '../components/portfolio/PortfolioStockDetailsModal'

const Portfolio = () => {
    const { user } = useAuth()
    const [portfolio, setPortfolio] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingAsset, setEditingAsset] = useState(null)
    const [lastUpdated, setLastUpdated] = useState(new Date())

    // Details Modal State
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    // API Key State
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('finnhub_api_key') || 'd4mv839r01qsn6g8kjugd4mv839r01qsn6g8kjv0');
    const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

    // Use ref to track portfolio for interval without triggering re-renders/resets
    const portfolioRef = useRef(portfolio);
    const apiKeyRef = useRef(apiKey);

    useEffect(() => {
        portfolioRef.current = portfolio;
        apiKeyRef.current = apiKey;
    }, [portfolio, apiKey]);

    useEffect(() => {
        if (user) {
            const data = storageService.getPortfolio(user.id)
            setPortfolio(data)
        }
    }, [user])

    // Sync selectedAsset with portfolio updates (so modal shows live data)
    useEffect(() => {
        if (selectedAsset) {
            const updatedAsset = portfolio.find(p => p.id === selectedAsset.id);
            if (updatedAsset) {
                setSelectedAsset(updatedAsset);
            }
        }
    }, [portfolio]);

    const handleSaveApiKey = (e) => {
        e.preventDefault();
        const key = e.target.apiKey.value;
        setApiKey(key);
        localStorage.setItem('finnhub_api_key', key);
        setIsKeyModalOpen(false);
        // Trigger immediate refresh
        fetchPrices();
    };

    const fetchPrices = async () => {
        const currentPortfolio = portfolioRef.current;
        const currentKey = apiKeyRef.current;
        if (currentPortfolio.length === 0) return;

        const updates = await priceService.getLivePrices(currentPortfolio, currentKey);

        if (Object.keys(updates).length > 0) {
            setPortfolio(prev => prev.map(asset => {
                if (updates[asset.id]) {
                    return { ...asset, currentPrice: updates[asset.id] };
                }
                return asset;
            }));
            setLastUpdated(new Date());
        }
    };

    // Live Price Updates
    useEffect(() => {
        if (!user) return;

        // Initial fetch
        fetchPrices();

        // Poll every 30 seconds
        const interval = setInterval(fetchPrices, 30000);
        return () => clearInterval(interval);
    }, [user]);

    const savePortfolio = (newPortfolio) => {
        setPortfolio(newPortfolio)
        if (user) {
            storageService.savePortfolio(user.id, newPortfolio)
        }
    }

    const calculateTotals = (assets) => {
        return assets.reduce((acc, asset) => {
            const value = asset.quantity * asset.currentPrice;
            const cost = asset.quantity * asset.buyPrice;
            acc.totalValue += value;
            acc.totalGainLoss += (value - cost);
            return acc;
        }, { totalValue: 0, totalGainLoss: 0 });
    };

    const { totalValue, totalGainLoss } = useMemo(() => calculateTotals(portfolio), [portfolio]);

    const stocks = portfolio.filter(a => a.type === 'Stock');
    const etfs = portfolio.filter(a => a.type === 'ETF');
    const crypto = portfolio.filter(a => a.type === 'Crypto');

    const stockTotals = useMemo(() => calculateTotals(stocks), [stocks]);
    const etfTotals = useMemo(() => calculateTotals(etfs), [etfs]);
    const cryptoTotals = useMemo(() => calculateTotals(crypto), [crypto]);

    const handleAddAsset = () => {
        setEditingAsset(null);
        setIsModalOpen(true);
    };

    const handleEditAsset = (asset, mode = 'buy') => {
        setEditingAsset(asset);
        setTransactionMode(mode);
        setIsModalOpen(true);
    };

    const handleAssetClick = (asset) => {
        setSelectedAsset(asset);
        setIsDetailsModalOpen(true);
    };

    const [transactionMode, setTransactionMode] = useState('buy');

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAsset(null);
        setTransactionMode('buy');
    };

    const handleSaveAsset = (assetData, mode) => {
        let newPortfolio = [...portfolio];
        const existingAssetIndex = newPortfolio.findIndex(p => p.symbol === assetData.symbol);

        // Create transaction record
        const newTransaction = {
            id: uuidv4(),
            date: assetData.buyDate,
            type: mode, // 'buy' or 'sell'
            quantity: assetData.quantity,
            price: assetData.buyPrice,
            platform: assetData.platform
        };

        if (existingAssetIndex >= 0) {
            const existingAsset = newPortfolio[existingAssetIndex];
            // Ensure lots exist (migration for old data) and is an array
            let lots = Array.isArray(existingAsset.lots) ? [...existingAsset.lots] : [];
            // Ensure transactions exist
            let transactions = Array.isArray(existingAsset.transactions) ? [...existingAsset.transactions] : [];

            // If no lots exist but we have legacy data, create a virtual lot for it
            if (lots.length === 0 && existingAsset.quantity > 0) {
                const legacyLot = {
                    id: uuidv4(),
                    date: existingAsset.buyDate || new Date().toISOString().split('T')[0],
                    quantity: existingAsset.quantity,
                    price: existingAsset.buyPrice,
                    platform: existingAsset.platform || 'Unknown'
                };
                lots.push(legacyLot);

                // Also add legacy transaction if empty
                if (transactions.length === 0) {
                    transactions.push({ ...legacyLot, type: 'buy' });
                }
            }

            // Add new transaction to history
            transactions.push(newTransaction);

            if (mode === 'buy') {
                // Add new lot with platform info
                lots.push({
                    id: uuidv4(),
                    date: assetData.buyDate,
                    quantity: assetData.quantity,
                    price: assetData.buyPrice,
                    platform: assetData.platform // Save platform!
                });

                // Recalculate Weighted Average Price
                const totalValue = lots.reduce((acc, lot) => acc + (lot.quantity * lot.price), 0);
                const totalQty = lots.reduce((acc, lot) => acc + lot.quantity, 0);

                newPortfolio[existingAssetIndex] = {
                    ...existingAsset,
                    quantity: totalQty,
                    buyPrice: totalValue / totalQty,
                    currentPrice: assetData.currentPrice,
                    lots: lots,
                    transactions: transactions,
                    // Update top-level platform if it's the only one, or keep as is (lots have truth)
                    platform: lots.length === 1 ? lots[0].platform : existingAsset.platform
                };
            } else if (mode === 'sell') {
                // FIFO Sell Logic
                let qtyToSell = assetData.quantity;

                if (qtyToSell > existingAsset.quantity) {
                    alert("You cannot sell more than you own!");
                    return;
                }

                // Sort lots by date (oldest first)
                lots.sort((a, b) => new Date(a.date) - new Date(b.date));

                const newLots = [];
                for (let lot of lots) {
                    if (qtyToSell <= 0) {
                        newLots.push(lot);
                        continue;
                    }

                    // STRICT PLATFORM CHECK: Only sell from lots matching the selected platform
                    // If platform is not specified (legacy), assume it matches or allow selling (optional strictness)
                    // For now, we will enforce platform matching if the user selected one in the form.
                    // However, the current AssetForm doesn't strictly filter lots yet, so we'll implement the logic here:
                    // We should probably only consume lots that match the platform if we want strict platform selling.
                    // But standard FIFO usually ignores platform.
                    // USER REQUEST: "when i select the platform that should only give the available stock in the platform to sell"
                    // This implies we should only deduct from lots of that platform.

                    if (lot.platform === assetData.platform) {
                        if (lot.quantity <= qtyToSell) {
                            // Consumed entire lot
                            qtyToSell -= lot.quantity;
                        } else {
                            // Partial lot consumption
                            newLots.push({
                                ...lot,
                                quantity: lot.quantity - qtyToSell
                            });
                            qtyToSell = 0;
                        }
                    } else {
                        // Skip lots from other platforms
                        newLots.push(lot);
                    }
                }

                if (qtyToSell > 0) {
                    alert(`Not enough shares available in ${assetData.platform} to sell!`);
                    return;
                }

                if (newLots.length === 0) {
                    // Sold everything
                    newPortfolio.splice(existingAssetIndex, 1);
                } else {
                    // Recalculate average from remaining lots
                    const totalValue = newLots.reduce((acc, lot) => acc + (lot.quantity * lot.price), 0);
                    const totalQty = newLots.reduce((acc, lot) => acc + lot.quantity, 0);

                    newPortfolio[existingAssetIndex] = {
                        ...existingAsset,
                        quantity: totalQty,
                        buyPrice: totalQty > 0 ? totalValue / totalQty : 0,
                        currentPrice: assetData.currentPrice,
                        lots: newLots,
                        transactions: transactions
                    };
                }
            }
        } else {
            // New Asset (only if buying)
            if (mode === 'buy') {
                newPortfolio.push({
                    ...assetData,
                    id: uuidv4(),
                    lots: [{
                        id: uuidv4(),
                        date: assetData.buyDate,
                        quantity: assetData.quantity,
                        price: assetData.buyPrice,
                        platform: assetData.platform // Save platform!
                    }],
                    transactions: [newTransaction]
                });
            }
        }

        savePortfolio(newPortfolio);
        handleCloseModal();
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Portfolio</h1>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <span>Manage your assets and track performance</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="flex items-center gap-1 text-green-600">
                            <RefreshCw className="w-3 h-3 animate-spin" /> Live Updates
                        </span>
                        <button
                            onClick={() => setIsKeyModalOpen(true)}
                            className="ml-2 text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                            {apiKey ? 'API Key Configured' : 'Configure Live Stocks'}
                        </button>
                    </div>
                </div>
                <button
                    onClick={handleAddAsset}
                    data-tour="add-asset"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-lg shadow-indigo-600/20"
                >
                    <Plus className="w-5 h-5" />
                    Add Asset
                </button>
            </div>

            <div data-tour="portfolio-summary" className="mb-8 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 text-white rounded-xl">
                        <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-white/80 font-medium uppercase tracking-wider">Total Balance</p>
                        <p className="text-2xl font-bold text-white">
                            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

                <div className="h-10 w-px bg-white/20 hidden sm:block"></div>

                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-white/20 ${totalGainLoss >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                        {totalGainLoss >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                    </div>
                    <div>
                        <p className="text-xs text-white/80 font-medium uppercase tracking-wider">Total Return</p>
                        <p className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                            {totalGainLoss >= 0 ? '+' : ''}{totalGainLoss.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </p>
                    </div>
                </div>
            </div>

            <AssetList title="Stocks" assets={stocks} onEdit={handleEditAsset} onAssetClick={handleAssetClick} totals={stockTotals} />
            <AssetList title="ETFs" assets={etfs} onEdit={handleEditAsset} onAssetClick={handleAssetClick} totals={etfTotals} />
            <AssetList title="Crypto" assets={crypto} onEdit={handleEditAsset} onAssetClick={handleAssetClick} totals={cryptoTotals} />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingAsset ? 'Edit Asset' : 'Add New Asset'}
            >
                <AssetForm
                    asset={editingAsset}
                    onSave={handleSaveAsset}
                    onCancel={handleCloseModal}
                    initialMode={transactionMode}
                />
            </Modal>

            <PortfolioStockDetailsModal
                key={selectedAsset ? `${selectedAsset.id}-${selectedAsset.quantity}-${selectedAsset.lots?.length || 0}-${lastUpdated.getTime()}` : 'modal'}
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                asset={selectedAsset}
            />

            <Modal
                isOpen={isKeyModalOpen}
                onClose={() => setIsKeyModalOpen(false)}
                title="Configure Live Stock Prices"
            >
                <form onSubmit={handleSaveApiKey} className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-600 mb-2">
                            To get real-time stock prices, you need a free API key from Finnhub.
                        </p>
                        <ol className="list-decimal list-inside text-sm text-gray-600 mb-4 space-y-1">
                            <li>Go to <a href="https://finnhub.io/" target="_blank" rel="noreferrer" className="text-blue-600 underline">finnhub.io</a> and sign up.</li>
                            <li>Copy your API key from the dashboard.</li>
                            <li>Paste it below.</li>
                        </ol>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Finnhub API Key</label>
                        <input
                            type="text"
                            name="apiKey"
                            defaultValue={apiKey}
                            placeholder="Enter your API key"
                            className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsKeyModalOpen(false)}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Save Key
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default Portfolio
