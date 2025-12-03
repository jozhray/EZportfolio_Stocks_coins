import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { cryptoService } from '../services/cryptoService';
import CryptoList from '../components/crypto/CryptoList';

const CryptoMarket = () => {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchCoins = async () => {
        setLoading(true);
        const data = await cryptoService.getTop100Coins();
        setCoins(data);
        setLastUpdated(new Date());
        setLoading(false);
    };

    useEffect(() => {
        fetchCoins();
        // Refresh every 60 seconds
        const interval = setInterval(fetchCoins, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Crypto Market</h1>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                        <span>Top 100 Cryptocurrencies by Market Cap</span>
                        {lastUpdated && (
                            <>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className="flex items-center gap-1 text-green-600">
                                    <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                                    Updated {lastUpdated.toLocaleTimeString()}
                                </span>
                            </>
                        )}
                    </div>
                </div>
                <button
                    onClick={fetchCoins}
                    disabled={loading}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Refresh Data"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {loading && coins.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <CryptoList coins={coins} />
            )}

            <div className="mt-8 text-center text-xs text-gray-400">
                Data provided by <a href="https://www.coingecko.com/" target="_blank" rel="noreferrer" className="underline hover:text-gray-500">CoinGecko</a>
            </div>
        </div>
    );
};

export default CryptoMarket;
