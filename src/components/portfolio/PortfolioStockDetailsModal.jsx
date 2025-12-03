import React from 'react'
import { X, ExternalLink, TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { PLATFORMS } from '../../utils/platforms'

const PortfolioStockDetailsModal = ({ isOpen, onClose, asset }) => {
    if (!isOpen || !asset) return null;

    const totalValue = asset.quantity * asset.currentPrice;
    const totalCost = asset.lots ? asset.lots.reduce((acc, lot) => acc + (lot.quantity * lot.price), 0) : (asset.quantity * asset.buyPrice);
    const totalGainLoss = totalValue - totalCost;
    const isPositive = totalGainLoss >= 0;

    // Ensure lots exist for display (handle legacy data)
    const displayLots = (asset.lots && asset.lots.length > 0) ? asset.lots : [{
        id: 'legacy',
        date: asset.buyDate || new Date().toISOString().split('T')[0],
        quantity: asset.quantity,
        price: asset.buyPrice,
        platform: asset.platform || 'Unknown'
    }];

    // Group lots by platform for summary
    const platformSummary = displayLots.reduce((acc, lot) => {
        const platform = lot.platform || asset.platform || 'Unknown';
        if (!acc[platform]) {
            acc[platform] = { quantity: 0, value: 0 };
        }
        acc[platform].quantity += lot.quantity;
        acc[platform].value += lot.quantity * asset.currentPrice;
        return acc;
    }, {});

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        {asset.logo ? (
                            <img src={asset.logo} alt={asset.symbol} className="w-16 h-16 rounded-full object-cover bg-white shadow-sm" />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl shadow-sm">
                                {asset.symbol.substring(0, 3)}
                            </div>
                        )}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{asset.name}</h2>
                            <div className="flex items-center gap-2 text-gray-500">
                                <span className="font-semibold text-gray-700">{asset.symbol}</span>
                                <span>•</span>
                                <span>{asset.type}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {/* Key Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <p className="text-sm text-blue-600 mb-1">Total Value</p>
                            <p className="text-2xl font-bold text-gray-900">
                                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className={`p-4 rounded-xl border ${isPositive ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                            <p className={`text-sm mb-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>Total Return</p>
                            <div className="flex items-center gap-2">
                                <p className={`text-2xl font-bold ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
                                    {isPositive ? '+' : ''}{totalGainLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                                {isPositive ? <TrendingUp className="w-5 h-5 text-green-600" /> : <TrendingDown className="w-5 h-5 text-red-600" />}
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-sm text-gray-600 mb-1">Total Quantity</p>
                            <p className="text-2xl font-bold text-gray-900">{asset.quantity}</p>
                        </div>
                    </div>

                    {/* Platform Breakdown */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-gray-500" />
                            Holdings by Platform
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Object.entries(platformSummary).map(([platformName, data]) => {
                                const platformInfo = PLATFORMS.find(p => p.name === platformName);
                                return (
                                    <div key={platformName} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                                        <div className="flex items-center gap-3">
                                            {platformInfo?.logo ? (
                                                <img src={platformInfo.logo} alt={platformName} className="w-8 h-8 rounded-full" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                                    {platformName[0]}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900">{platformName}</p>
                                                <p className="text-sm text-gray-500">{data.quantity} shares</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">${data.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Transaction History / Lots */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Transaction History ({displayLots.length})</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                                        <th className="py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                                        <th className="py-3 px-4 text-sm font-medium text-gray-500">Platform</th>
                                        <th className="py-3 px-4 text-sm font-medium text-gray-500 text-right">Quantity</th>
                                        <th className="py-3 px-4 text-sm font-medium text-gray-500 text-right">Price</th>
                                        <th className="py-3 px-4 text-sm font-medium text-gray-500 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {(asset.transactions || displayLots).sort((a, b) => {
                                        const dateA = new Date(a.date);
                                        const dateB = new Date(b.date);
                                        if (isNaN(dateA.getTime())) return 1;
                                        if (isNaN(dateB.getTime())) return -1;
                                        return dateB - dateA;
                                    }).map((tx, index) => {
                                        const isSell = tx.type === 'sell';
                                        return (
                                            <tr key={tx.id || index} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-3 px-4 text-sm text-gray-900">{tx.date}</td>
                                                <td className="py-3 px-4 text-sm">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isSell ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                                        }`}>
                                                        {isSell ? 'SELL' : 'BUY'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-600">
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
                                                        {tx.platform || asset.platform || 'Unknown'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">{Number(tx.quantity)}</td>
                                                <td className="py-3 px-4 text-sm text-gray-600 text-right">${Number(tx.price).toFixed(2)}</td>
                                                <td className="py-3 px-4 text-sm text-gray-900 text-right">${(Number(tx.quantity) * Number(tx.price)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                            </tr>
                                        );
                                    })}
                                    {(!asset.transactions && displayLots.length === 0) && (
                                        <tr>
                                            <td colSpan="6" className="py-8 text-center text-gray-500">
                                                No detailed transaction history available.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PortfolioStockDetailsModal
