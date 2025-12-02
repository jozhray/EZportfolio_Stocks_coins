import React from 'react'
import { TrendingUp, TrendingDown, BarChart2, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import Card from '../ui/Card'
import clsx from 'clsx'

const StockCard = ({ stock, onClick, livePrice }) => {
    const displayPrice = livePrice || stock.price;
    const isPositive = stock.change >= 0;

    return (
        <Card
            onClick={() => onClick && onClick(stock)}
            className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 cursor-pointer group"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                        {stock.logo ? (
                            <img src={stock.logo} alt={stock.symbol} className="w-8 h-8 object-contain" />
                        ) : (
                            <TrendingUp className="w-6 h-6 text-blue-600" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{stock.symbol}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">{stock.name}</p>
                    </div>
                </div>
                <div className={clsx("flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-md",
                    isPositive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                )}>
                    {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {Math.abs(stock.change)}%
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Price</p>
                    <div className="flex items-baseline gap-2">
                        <p className="font-bold text-gray-900 text-xl">
                            ${displayPrice?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        {livePrice && (
                            <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded animate-pulse">LIVE</span>
                        )}
                    </div>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Sector</p>
                    <p className="font-medium text-gray-700">{stock.sector}</p>
                </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-2">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                        <BarChart2 className="w-4 h-4" /> Analyst Rating
                    </span>
                    <span className={clsx("text-sm font-bold px-2 py-1 rounded-full",
                        stock.analystRating === 'Strong Buy' ? "bg-green-100 text-green-700" :
                            stock.analystRating === 'Buy' ? "bg-blue-100 text-blue-700" :
                                "bg-yellow-100 text-yellow-700"
                    )}>
                        {stock.analystRating}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Prediction</span>
                    <span className="text-sm font-medium text-gray-900">{stock.prediction}</span>
                </div>
            </div>
        </Card>
    )
}

export default StockCard
