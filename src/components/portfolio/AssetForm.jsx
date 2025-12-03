import React, { useState, useEffect } from 'react'
import { PLATFORMS } from '../../utils/platforms'
import clsx from 'clsx'

// Mock current prices for common stocks to help the user (Updated Dec 2025)
const KNOWN_PRICES = {
    'AAPL': 271.49,
    'MSFT': 472.12,
    'GOOGL': 299.66,
    'AMZN': 220.69,
    'TSLA': 391.09,
    'NVDA': 178.88,
    'META': 594.25,
    'NFLX': 104.31,
    'AMD': 218.93,
    'INTC': 40.22,
    'VOO': 625.99,
    'QQQ': 617.10,
    'SPY': 681.09,
    'BTC': 96000.00,
    'ETH': 3600.00,
    'SOL': 230.00,
};

const AssetForm = ({ asset, onSave, onCancel, initialMode = 'buy' }) => {
    const [mode, setMode] = useState(initialMode); // 'buy' or 'sell'
    const [formData, setFormData] = useState({
        type: 'Stock',
        symbol: '',
        name: '',
        quantity: '',
        buyPrice: '',
        platform: 'Robinhood',
        buyDate: new Date().toISOString().split('T')[0],
        dividendAmount: '',
        dividendFrequency: 'Quarterly',
    });

    useEffect(() => {
        if (asset) {
            setFormData({
                ...asset,
                // If selling, we start with empty quantity to specify how much to sell
                quantity: mode === 'sell' ? '' : asset.quantity,
                buyPrice: asset.buyPrice, // Keep original buy price for reference
                buyDate: new Date().toISOString().split('T')[0] // Transaction date
            });
        }
    }, [asset, mode]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Auto-fill price if symbol matches known stock
        if (name === 'symbol' && mode === 'buy') {
            const upperSymbol = value.toUpperCase();
            if (KNOWN_PRICES[upperSymbol] && !formData.buyPrice) {
                setFormData(prev => ({
                    ...prev,
                    [name]: upperSymbol, // Force uppercase
                    // Also guess buy price as slightly lower
                    buyPrice: prev.buyPrice || (KNOWN_PRICES[upperSymbol] * 0.9)
                }));
                return;
            }
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            symbol: formData.symbol.toUpperCase(),
            quantity: Number(formData.quantity),
            buyPrice: Number(formData.buyPrice),
            // Default current price to buy price if new, otherwise it will be updated by live fetch
            currentPrice: asset ? asset.currentPrice : Number(formData.buyPrice),
            dividendAmount: formData.dividendAmount ? Number(formData.dividendAmount) : 0,
            dividendFrequency: formData.dividendFrequency,
        }, mode);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Transaction Type Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
                <button
                    type="button"
                    onClick={() => setMode('buy')}
                    className={clsx(
                        "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                        mode === 'buy' ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    Buy
                </button>
                <button
                    type="button"
                    onClick={() => setMode('sell')}
                    className={clsx(
                        "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                        mode === 'sell' ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    Sell
                </button>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
                <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    disabled={!!asset} // Disable type change if editing/adding to existing
                    className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100"
                >
                    <option value="Stock">Stock</option>
                    <option value="ETF">ETF</option>
                    <option value="Crypto">Crypto</option>
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
                    <input
                        type="text"
                        name="symbol"
                        value={formData.symbol}
                        onChange={handleChange}
                        required
                        disabled={!!asset}
                        className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                        placeholder="AAPL"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={!!asset}
                        className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                        placeholder="Apple Inc."
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {mode === 'buy' ? 'Quantity to Buy' : 'Quantity to Sell'}
                    </label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                        step="any"
                        className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    {asset && mode === 'sell' && (
                        <p className={`text-xs mt-1 ${
                            // Calculate available for THIS platform
                            (asset.lots?.filter(l => l.platform === formData.platform).reduce((sum, l) => sum + l.quantity, 0) || 0) < Number(formData.quantity)
                                ? 'text-red-600 font-bold'
                                : 'text-gray-500'
                            }`}>
                            Available in {formData.platform}: {
                                asset.lots
                                    ? asset.lots.filter(l => l.platform === formData.platform).reduce((sum, l) => sum + l.quantity, 0)
                                    : (asset.platform === formData.platform ? asset.quantity : 0)
                            }
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                    <select
                        name="platform"
                        value={formData.platform}
                        onChange={handleChange}
                        className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        {PLATFORMS.map(p => (
                            <option key={p.name} value={p.name}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {mode === 'buy' ? 'Buy Price' : 'Sell Price'}
                    </label>
                    <input
                        type="number"
                        name="buyPrice" // Reusing field name for simplicity, but logically it's transaction price
                        value={formData.buyPrice}
                        onChange={handleChange}
                        required
                        step="any"
                        className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Date</label>
                    <input
                        type="date"
                        name="buyDate"
                        value={formData.buyDate}
                        onChange={handleChange}
                        className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            {/* Dividend Information */}
            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Annual Dividend ($)
                    </label>
                    <input
                        type="number"
                        name="dividendAmount"
                        value={formData.dividendAmount}
                        onChange={handleChange}
                        step="0.01"
                        placeholder="0.00"
                        className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                    <select
                        name="dividendFrequency"
                        value={formData.dividendFrequency}
                        onChange={handleChange}
                        className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Semi-Annually">Semi-Annually</option>
                        <option value="Annually">Annually</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className={clsx(
                        "px-4 py-2 text-white rounded-lg transition-colors",
                        mode === 'buy' ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                    )}
                >
                    {mode === 'buy' ? 'Confirm Buy' : 'Confirm Sell'}
                </button>
            </div>
        </form >
    )
}

export default AssetForm
