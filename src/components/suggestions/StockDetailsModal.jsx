import React from 'react'
import { X, TrendingUp, TrendingDown, BarChart2, DollarSign, Activity, Users } from 'lucide-react'
import clsx from 'clsx'
import Modal from '../ui/Modal'

const StockDetailsModal = ({ stock, isOpen, onClose }) => {
    if (!stock) return null;

    const isPositive = stock.change >= 0;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={stock.name}>
            <div className="space-y-6">
                {/* Header Stats */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Current Price</p>
                        <h2 className="text-3xl font-bold text-gray-900">${stock.price.toFixed(2)}</h2>
                    </div>
                    <div className={clsx("text-right", isPositive ? "text-green-600" : "text-red-600")}>
                        <div className="flex items-center justify-end gap-1 font-bold text-lg">
                            {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                            {isPositive ? '+' : ''}{stock.change}%
                        </div>
                        <p className="text-sm text-gray-500">Today</p>
                    </div>
                </div>

                {/* Summary */}
                {stock.summary && (
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase mb-2">Analysis Summary</h3>
                        <p className="text-gray-600 leading-relaxed">{stock.summary}</p>
                    </div>
                )}

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-100 rounded-xl">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <Activity className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase">Potential</span>
                        </div>
                        <p className="text-xl font-bold text-blue-600">{stock.potential || 'N/A'}</p>
                        <p className="text-xs text-gray-400 mt-1">Analyst Target: ${stock.targetPrice?.toFixed(2)}</p>
                    </div>
                    <div className="p-4 border border-gray-100 rounded-xl">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <BarChart2 className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase">Performance (1Y)</span>
                        </div>
                        <p className={clsx("text-xl font-bold", (stock.performance?.oneYear || '').includes('-') ? "text-red-600" : "text-green-600")}>
                            {stock.performance?.oneYear || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">YTD: {stock.performance?.ytd}</p>
                    </div>
                </div>

                {/* Analyst Rating */}
                <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase mb-3">Analyst Consensus</h3>
                    <div className="flex items-center justify-between bg-white border border-gray-200 p-4 rounded-xl">
                        <div>
                            <p className="font-bold text-gray-900">{stock.analyst}</p>
                            <p className="text-xs text-gray-500">Top Analyst Firm</p>
                        </div>
                        <span className={clsx("px-3 py-1 rounded-full text-sm font-bold",
                            stock.rating === 'Strong Buy' ? "bg-green-100 text-green-700" :
                                stock.rating === 'Buy' ? "bg-blue-100 text-blue-700" :
                                    stock.rating === 'Sell' ? "bg-red-100 text-red-700" :
                                        "bg-yellow-100 text-yellow-700"
                        )}>
                            {stock.rating}
                        </span>
                    </div>
                </div>

                {/* Insider Activity */}
                {stock.insiderActivity && stock.insiderActivity.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase mb-3 flex items-center gap-2">
                            <Users className="w-4 h-4" /> Insider Activity
                        </h3>
                        <div className="space-y-2">
                            {stock.insiderActivity.map((activity, index) => (
                                <div key={index} className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">{activity.name}</p>
                                        <p className="text-xs text-gray-500">{activity.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={clsx("font-bold", activity.type === 'Buy' ? "text-green-600" : "text-red-600")}>
                                            {activity.type}
                                        </p>
                                        <p className="text-xs text-gray-500">{activity.amount}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="pt-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        Close Analysis
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default StockDetailsModal
