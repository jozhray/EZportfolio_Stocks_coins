import React from 'react'
import { Edit2, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react'
import Card from '../ui/Card'
import { PLATFORMS } from '../../utils/platforms'

const AssetList = ({ title, assets, onEdit }) => {
    if (assets.length === 0) return null;

    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
            <div className="grid gap-4">
                {assets.map((asset) => {
                    const totalValue = asset.quantity * asset.currentPrice;
                    const gainLoss = (asset.currentPrice - asset.buyPrice) * asset.quantity;
                    const isPositive = gainLoss >= 0;

                    return (
                        <Card key={asset.id} className="flex items-center justify-between p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                {asset.logo ? (
                                    <img src={asset.logo} alt={asset.symbol} className="w-10 h-10 rounded-full object-cover bg-white" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                                        {asset.symbol.substring(0, 3)}
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        {asset.symbol}
                                        {asset.platform && (() => {
                                            const platform = PLATFORMS.find(p => p.name === asset.platform);
                                            const url = platform ? platform.url : '';
                                            return url ? (
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs font-normal px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors flex items-center gap-1"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {asset.platform}
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            ) : (
                                                <span className="text-xs font-normal px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                                                    {asset.platform}
                                                </span>
                                            );
                                        })()}
                                    </h3>
                                    <p className="text-sm text-gray-500">{asset.name}</p>
                                </div>
                            </div>

                            <div className="text-right hidden md:block">
                                <p className="text-sm text-gray-500">Quantity</p>
                                <p className="font-medium">{asset.quantity}</p>
                            </div>

                            <div className="text-right hidden md:block">
                                <p className="text-sm text-gray-500">Avg. Buy Price</p>
                                <p className="font-medium">${asset.buyPrice.toFixed(2)}</p>
                            </div>

                            <div className="text-right hidden md:block">
                                <p className="text-sm text-gray-500">Current Price</p>
                                <p className="font-medium">${asset.currentPrice.toFixed(2)}</p>
                            </div>

                            <div className="text-right">
                                <p className="font-bold text-gray-900">${totalValue.toFixed(2)}</p>
                                <p className={`text-sm flex items-center justify-end gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                    {isPositive ? '+' : ''}{gainLoss.toFixed(2)}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onEdit(asset, 'buy')}
                                    className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                                >
                                    Buy
                                </button>
                                <button
                                    onClick={() => onEdit(asset, 'sell')}
                                    className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                                >
                                    Sell
                                </button>
                            </div>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}

export default AssetList
