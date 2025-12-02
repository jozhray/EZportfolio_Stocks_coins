import React, { useState, useMemo, useEffect } from 'react'
import { RefreshCw, TrendingUp, Search, Globe } from 'lucide-react'
import { STOCK_DATA } from '../data/stocks'
import StockCard from '../components/suggestions/StockCard'
import SearchSection from '../components/suggestions/SearchSection'
import StockDetailsModal from '../components/suggestions/StockDetailsModal'
import { useAuth } from '../context/AuthContext'
import { priceService } from '../services/priceService'

const Suggestions = () => {
    const { user } = useAuth()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedSector, setSelectedSector] = useState('All')
    const [displayedSuggestions, setDisplayedSuggestions] = useState(STOCK_DATA)
    const [selectedStock, setSelectedStock] = useState(null)
    const [isSearchingOnline, setIsSearchingOnline] = useState(false)
    const [onlineError, setOnlineError] = useState(null)
    const [livePrices, setLivePrices] = useState({});

    // API Key (reuse from local storage)
    const apiKey = localStorage.getItem('finnhub_api_key') || 'd4mv839r01qsn6g8kjugd4mv839r01qsn6g8kjv0';

    useEffect(() => {
        const fetchLivePrices = async () => {
            if (!displayedSuggestions.length) return;

            // Fetch live prices for all displayed suggestions using Yahoo Finance
            const updates = await priceService.getLivePrices(displayedSuggestions, apiKey);
            if (Object.keys(updates).length > 0) {
                setLivePrices(prev => ({ ...prev, ...updates }));
            }
        };

        fetchLivePrices();
        const interval = setInterval(fetchLivePrices, 30000); // 30s poll
        return () => clearInterval(interval);
    }, [displayedSuggestions, apiKey]);

    const [sortBy, setSortBy] = useState('default');
    const [sortOrder, setSortOrder] = useState('desc');

    const filteredSuggestions = useMemo(() => {
        let filtered = displayedSuggestions.filter(stock => {
            const matchesSearch = stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                stock.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesSector = selectedSector === 'All' || stock.sector === selectedSector;
            return matchesSearch && matchesSector;
        });

        if (sortBy !== 'default') {
            filtered.sort((a, b) => {
                let valA = a[sortBy];
                let valB = b[sortBy];

                // Handle Market Cap (mock data might be missing it for some)
                if (sortBy === 'marketCap') {
                    valA = valA || 0;
                    valB = valB || 0;
                }

                if (sortOrder === 'asc') {
                    return valA > valB ? 1 : -1;
                } else {
                    return valA < valB ? 1 : -1;
                }
            });
        }

        return filtered;
    }, [displayedSuggestions, searchQuery, selectedSector, sortBy, sortOrder]);

    const handleRefresh = () => {
        const shuffled = [...displayedSuggestions].sort(() => Math.random() - 0.5);
        setDisplayedSuggestions(shuffled);
    };

    const handleOnlineSearch = async () => {
        if (!searchQuery) return;

        setIsSearchingOnline(true);
        setOnlineError(null);

        // Use user's key or fall back to a demo key if you had one (but we rely on user key for real data)
        // For now assuming user has set a key in Portfolio page, or we warn them.
        const apiKey = localStorage.getItem('finnhub_api_key');

        if (!apiKey) {
            setOnlineError("Please add your Finnhub API Key in the Portfolio page first.");
            setIsSearchingOnline(false);
            return;
        }

        const data = await priceService.fetchStockDetails(searchQuery.toUpperCase(), apiKey);

        if (data) {
            setSelectedStock(data);
        } else {
            setOnlineError(`Could not find stock "${searchQuery.toUpperCase()}" or API limit reached.`);
        }
        setIsSearchingOnline(false);
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Stock Suggestions</h1>
                    <p className="text-gray-500">Top picks and analyst ratings</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                    <TrendingUp className="w-4 h-4" />
                    Bull Market
                </div>
            </div>

            <SearchSection
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedSector={selectedSector}
                onSectorChange={setSelectedSector}
                onSortChange={setSortBy}
                onOrderChange={setSortOrder}
            />

            {/* Online Search Fallback */}
            {filteredSuggestions.length === 0 && searchQuery && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300 mb-8">
                    <Globe className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Not found in our curated list</h3>
                    <p className="text-gray-500 mb-4">Search the global market for "{searchQuery}"</p>

                    {onlineError && (
                        <p className="text-red-500 text-sm mb-4 bg-red-50 py-2 px-4 rounded-lg inline-block">
                            {onlineError}
                        </p>
                    )}

                    <button
                        onClick={handleOnlineSearch}
                        disabled={isSearchingOnline}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50"
                    >
                        {isSearchingOnline ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                            <Search className="w-5 h-5" />
                        )}
                        {isSearchingOnline ? 'Searching...' : 'Search Online'}
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredSuggestions.map((stock) => (
                    <div key={stock.id} onClick={() => setSelectedStock(stock)} className="cursor-pointer">
                        <StockCard
                            stock={stock}
                            livePrice={livePrices[stock.id]}
                        />
                    </div>
                ))}
            </div>

            <div className="text-center">
                <button
                    onClick={handleRefresh}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                >
                    <RefreshCw className="w-5 h-5" />
                    Refresh Suggestions
                </button>
            </div>

            <StockDetailsModal
                stock={selectedStock}
                isOpen={!!selectedStock}
                onClose={() => setSelectedStock(null)}
            />
        </div>
    )
}

export default Suggestions
