import React from 'react'
import { Edit2, TrendingUp, TrendingDown, ExternalLink, Layers } from 'lucide-react'
import Card from '../ui/Card'
import { PLATFORMS } from '../../utils/platforms'

const AssetList = ({ title, assets, onEdit, onAssetClick, totals }) => {
    const [openDropdownId, setOpenDropdownId] = React.useState(null);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = () => setOpenDropdownId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    if (assets.length === 0) return null;

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                {totals && (
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                            <span className="text-gray-500">Value:</span>
                            <span className="text-gray-800 font-bold">
                                ${totals.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-gray-500">Return:</span>
                            <span className={`font-bold flex items-center gap-1 ${totals.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {totals.totalGainLoss >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {totals.totalGainLoss >= 0 ? '+' : ''}{totals.totalGainLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                )}
            </div>
            <div className="grid gap-4">
                {assets.map((asset) => {
                    const totalValue = asset.quantity * asset.currentPrice;
                    const gainLoss = (asset.currentPrice - asset.buyPrice) * asset.quantity;
                    const isPositive = gainLoss >= 0;

                    // Determine platform display
                    let platformDisplay = null;
                    const uniquePlatforms = new Set();

                    if (asset.lots && asset.lots.length > 0) {
                        asset.lots.forEach(lot => {
                            if (lot.platform) uniquePlatforms.add(lot.platform);
                        });
                    } else if (asset.platform) {
                        uniquePlatforms.add(asset.platform);
                    }

                    if (uniquePlatforms.size > 1) {
                        const platformList = Array.from(uniquePlatforms).map(name => {
                            const p = PLATFORMS.find(pl => pl.name === name);
                            return { name, url: p ? p.url : '' };
                        });

                        platformDisplay = (
                            <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenDropdownId(openDropdownId === asset.id ? null : asset.id);
                                    }}
                                    className="text-xs font-normal px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full flex items-center gap-1 hover:bg-purple-200 transition-colors"
                                >
                                    <Layers className="w-3 h-3" />
                                    Multiple
                                </button>

                                {openDropdownId === asset.id && (
                                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-2 space-y-1">
                                            {platformList.map((p) => (
                                                <a
                                                    key={p.name}
                                                    href={p.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group/item"
                                                    onClick={() => setOpenDropdownId(null)}
                                                >
                                                    <span>{p.name}</span>
                                                    <ExternalLink className="w-3 h-3 text-gray-400 group-hover/item:text-blue-500" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    } else if (uniquePlatforms.size === 1) {
                        const platformName = Array.from(uniquePlatforms)[0];
                        const platform = PLATFORMS.find(p => p.name === platformName);
                        const url = platform ? platform.url : '';

                        platformDisplay = url ? (
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-normal px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {platformName}
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        ) : (
                            <span className="text-xs font-normal px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                                {platformName}
                            </span>
                        );
                    }

                    return (
                        <Card
                            key={asset.id}
                            className="flex items-center justify-between p-4 hover:shadow-md transition-shadow cursor-pointer group"
                            onClick={() => onAssetClick && onAssetClick(asset)}
                        >
                            <div className="flex items-center gap-4">
                                {asset.logo ? (
                                    <img src={asset.logo} alt={asset.symbol} className="w-10 h-10 rounded-full object-cover bg-white" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                                        {asset.symbol.substring(0, 3)}
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                                        {asset.symbol}
                                        {platformDisplay}
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

                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAssetClick && onAssetClick(asset);
                                    }}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-1"
                                >
                                    <Layers className="w-3 h-3" />
                                    History
                                </button>
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
