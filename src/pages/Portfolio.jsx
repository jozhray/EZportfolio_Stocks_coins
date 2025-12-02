import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Plus, Wallet, RefreshCw } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { storageService } from '../services/storage'
import { priceService } from '../services/priceService'
import { useAuth } from '../context/AuthContext'
import AssetList from '../components/portfolio/AssetList'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import AssetForm from '../components/portfolio/AssetForm'

const Portfolio = () => {
    const { user } = useAuth()
    const [portfolio, setPortfolio] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingAsset, setEditingAsset] = useState(null)
    const [lastUpdated, setLastUpdated] = useState(new Date())

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

    const { totalValue, totalGainLoss } = useMemo(() => {
        return portfolio.reduce((acc, asset) => {
            const value = asset.quantity * asset.currentPrice;
            const cost = asset.quantity * asset.buyPrice;
            acc.totalValue += value;
            acc.totalGainLoss += (value - cost);
            return acc;
        }, { totalValue: 0, totalGainLoss: 0 });
    }, [portfolio]);

    const stocks = portfolio.filter(a => a.type === 'Stock');
    const etfs = portfolio.filter(a => a.type === 'ETF');
    const crypto = portfolio.filter(a => a.type === 'Crypto');

    const handleAddAsset = () => {
        setEditingAsset(null);
        setIsModalOpen(true);
    };

    const handleEditAsset = (asset, mode = 'buy') => {
        setEditingAsset(asset);
        // We pass the mode to the form (handled via props in AssetForm)
        // But here we just open the modal. The AssetList will call this with the asset.
        // We need to pass the mode down to the modal/form.
        // Let's store the mode in state.
        setTransactionMode(mode);
        setIsModalOpen(true);
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

        if (existingAssetIndex >= 0) {
            const existingAsset = newPortfolio[existingAssetIndex];
            // Ensure lots exist (migration for old data)
            let lots = existingAsset.lots || [{
                id: uuidv4(),
                date: existingAsset.buyDate || new Date().toISOString().split('T')[0],
                quantity: existingAsset.quantity,
                price: existingAsset.buyPrice
            }];

            if (mode === 'buy') {
                // Add new lot
                lots.push({
                    id: uuidv4(),
                    date: assetData.buyDate,
                    quantity: assetData.quantity,
                    price: assetData.buyPrice
                });

                // Recalculate Weighted Average Price
                const totalValue = lots.reduce((acc, lot) => acc + (lot.quantity * lot.price), 0);
                const totalQty = lots.reduce((acc, lot) => acc + lot.quantity, 0);

                newPortfolio[existingAssetIndex] = {
                    ...existingAsset,
                    quantity: totalQty,
                    buyPrice: totalValue / totalQty,
                    currentPrice: assetData.currentPrice,
                    lots: lots
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
                        buyPrice: totalValue / totalQty,
                        currentPrice: assetData.currentPrice,
                        lots: newLots
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
                        price: assetData.buyPrice
                    }]
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
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-lg shadow-blue-600/20"
                >
                    <Plus className="w-5 h-5" />
                    Add Asset
                </button>
            </div>

            <Card className="mb-8 bg-gradient-to-br from-blue-600 to-blue-800 text-white border-none">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-2 bg-white/10 rounded-lg">
                        <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-blue-100 font-medium">Total Balance</span>
                </div>
                <div className="text-4xl font-bold mb-2">
                    ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium ${totalGainLoss >= 0 ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'}`}>
                    {totalGainLoss >= 0 ? '+' : ''}{totalGainLoss.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    <span className="opacity-75">All time</span>
                </div>
            </Card>

            <AssetList title="Stocks" assets={stocks} onEdit={handleEditAsset} />
            <AssetList title="ETFs" assets={etfs} onEdit={handleEditAsset} />
            <AssetList title="Crypto" assets={crypto} onEdit={handleEditAsset} />

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
