import React, { useState, useEffect } from 'react';
import { priceService } from '../services/priceService';
import MarketNews from '../components/dividends/MarketNews';
import IPOCalendar from '../components/dividends/IPOCalendar';
import clsx from 'clsx';
import { TrendingUp, Newspaper, Search, Calendar } from 'lucide-react';

const MarketUpdates = () => {
    const [newsType, setNewsType] = useState('market'); // 'market', 'crypto', 'stock', or 'ipo'
    const [marketNews, setMarketNews] = useState([]);
    const [cryptoNews, setCryptoNews] = useState([]);
    const [stockNews, setStockNews] = useState([]);
    const [ipoData, setIpoData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchSymbol, setSearchSymbol] = useState('');
    const [currentStockSymbol, setCurrentStockSymbol] = useState('');

    // Fetch news when newsType changes
    useEffect(() => {
        const fetchNews = async () => {
            setIsLoading(true);

            if (newsType === 'market') {
                if (marketNews.length > 0) {
                    setIsLoading(false);
                    return;
                }
                const news = await priceService.fetchMarketNews(null, 20);
                setMarketNews(news);
            } else if (newsType === 'crypto') {
                if (cryptoNews.length > 0) {
                    setIsLoading(false);
                    return;
                }
                const news = await priceService.fetchCryptoNews(20);
                setCryptoNews(news);
            } else if (newsType === 'ipo') {
                if (ipoData.length > 0) {
                    setIsLoading(false);
                    return;
                }
                const ipos = await priceService.fetchIPOCalendar();
                setIpoData(ipos);
            }

            setIsLoading(false);
        };

        if (newsType !== 'stock') {
            fetchNews();
        }
    }, [newsType, marketNews.length, cryptoNews.length, ipoData.length]);

    const handleStockSearch = async (e) => {
        e.preventDefault();
        if (!searchSymbol.trim()) return;

        setIsLoading(true);
        setNewsType('stock');
        setCurrentStockSymbol(searchSymbol.toUpperCase());

        const news = await priceService.fetchStockNews(searchSymbol.toUpperCase(), 15);
        setStockNews(news);
        setIsLoading(false);
    };

    const getCurrentNews = () => {
        if (newsType === 'market') return marketNews;
        if (newsType === 'crypto') return cryptoNews;
        if (newsType === 'stock') return stockNews;
        return [];
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Market Updates</h1>
                <p className="text-gray-500">Stay informed with the latest market, crypto news, and upcoming IPOs</p>
            </div>

            {/* Stock Search Bar */}
            <form onSubmit={handleStockSearch} className="mb-6">
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            value={searchSymbol}
                            onChange={(e) => setSearchSymbol(e.target.value.toUpperCase())}
                            placeholder="Search for a stock (e.g., AAPL, TSLA, MSFT)"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Search
                    </button>
                </div>
            </form>

            {/* News Type Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-lg w-fit mb-6">
                <button
                    onClick={() => setNewsType('market')}
                    className={clsx(
                        "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all",
                        newsType === 'market' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    <TrendingUp className="w-4 h-4" />
                    Market News
                </button>
                <button
                    onClick={() => setNewsType('crypto')}
                    className={clsx(
                        "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all",
                        newsType === 'crypto' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    <Newspaper className="w-4 h-4" />
                    Crypto News
                </button>
                <button
                    onClick={() => setNewsType('ipo')}
                    className={clsx(
                        "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all",
                        newsType === 'ipo' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    <Calendar className="w-4 h-4" />
                    Upcoming IPOs
                </button>
            </div>

            {/* Stock Symbol Display */}
            {newsType === 'stock' && currentStockSymbol && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h2 className="text-lg font-semibold text-blue-900">
                        News for {currentStockSymbol}
                    </h2>
                    <p className="text-sm text-blue-700">
                        Showing latest news and updates for {currentStockSymbol}
                    </p>
                </div>
            )}

            {/* Content */}
            {newsType === 'ipo' ? (
                <IPOCalendar ipos={ipoData} isLoading={isLoading} />
            ) : (
                <MarketNews
                    news={getCurrentNews()}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
};

export default MarketUpdates;
