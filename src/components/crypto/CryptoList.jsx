import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';

const CryptoList = ({ coins }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCoins = coins.filter(coin =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-gray-900">Top 100 Cryptocurrencies</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search coins..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-4 py-3 w-16 text-center">#</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3 text-right">Price</th>
                            <th className="px-4 py-3 text-right">24h Change</th>
                            <th className="px-4 py-3 text-right hidden md:table-cell">Market Cap</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredCoins.map((coin) => (
                            <tr key={coin.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 text-center text-gray-500">{coin.market_cap_rank}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                                        <div>
                                            <span className="font-medium text-gray-900 block">{coin.name}</span>
                                            <span className="text-gray-500 text-xs uppercase">{coin.symbol}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right font-medium text-gray-900">
                                    ${coin.current_price.toLocaleString()}
                                </td>
                                <td className={`px-4 py-3 text-right font-medium ${coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    <div className="flex items-center justify-end gap-1">
                                        {coin.price_change_percentage_24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        {coin.price_change_percentage_24h.toFixed(2)}%
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right text-gray-500 hidden md:table-cell">
                                    ${coin.market_cap.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredCoins.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                    No coins found matching "{searchTerm}"
                </div>
            )}
        </div>
    );
};

export default CryptoList;
