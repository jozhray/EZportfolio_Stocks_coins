// CoinGecko API for Crypto
const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price';
const FINNHUB_API = 'https://finnhub.io/api/v1/quote';

// Mapping symbols to CoinGecko IDs
const CRYPTO_MAP = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'SOL': 'solana',
    'DOGE': 'dogecoin',
    'ADA': 'cardano',
    'DOT': 'polkadot',
    'MATIC': 'matic-network',
};

export const priceService = {
    // Simple in-memory cache
    priceCache: {},
    lastFetchTime: 0,

    // Fetch real crypto prices
    fetchCryptoPrices: async (symbols) => {
        try {
            const ids = symbols
                .map(s => CRYPTO_MAP[s.toUpperCase()])
                .filter(Boolean)
                .join(',');

            if (!ids) return null;

            const response = await fetch(`${COINGECKO_API}?ids=${ids}&vs_currencies=usd`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 429) {
                    console.warn('CoinGecko API rate limit reached. Switching to simulation.');
                }
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();

            const prices = {};
            Object.entries(CRYPTO_MAP).forEach(([symbol, id]) => {
                if (data[id]) {
                    prices[symbol] = data[id].usd;
                }
            });
            return prices;
        } catch (error) {
            console.warn('Failed to fetch crypto prices (using simulation):', error.message);
            return null;
        }
    },

    // Fetch stock price from Finnhub
    fetchStockPrice: async (symbol, apiKey) => {
        try {
            const response = await fetch(`${FINNHUB_API}?symbol=${symbol}&token=${apiKey}`);
            if (!response.ok) throw new Error('Finnhub API error');
            const data = await response.json();
            return data.c; // 'c' is the current price property
        } catch (error) {
            console.error(`Error fetching stock price for ${symbol}:`, error);
            return null;
        }
    },

    // Simulate stock price movement (Random Walk)
    simulatePriceChange: (currentPrice) => {
        const volatility = 0.002; // 0.2% volatility
        const change = currentPrice * volatility * (Math.random() - 0.5);
        return currentPrice + change;
    },

    // Fetch BATCH stock prices from Yahoo Finance (via corsproxy.io)
    fetchYahooBatchPrices: async (symbols) => {
        // Prevent spamming: only allow one fetch every 10 seconds
        const now = Date.now();
        if (now - priceService.lastFetchTime < 10000) {
            return null;
        }

        try {
            const symbolsString = symbols.join(',');
            const targetUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbolsString}`;

            // Try corsproxy.io first
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

            const response = await fetch(proxyUrl);

            if (!response.ok) {
                console.warn(`Proxy error: ${response.status} ${response.statusText}`);
                throw new Error('Proxy error');
            }

            const data = await response.json();

            // Debug logging to see what we actually get
            if (!data.quoteResponse || !data.quoteResponse.result) {
                console.warn('Invalid Yahoo Data received:', data);
                throw new Error('Invalid Yahoo data');
            }

            const prices = {};
            data.quoteResponse.result.forEach(quote => {
                prices[quote.symbol] = quote.regularMarketPrice;
            });

            priceService.lastFetchTime = now;
            return prices;
        } catch (error) {
            console.warn(`Error fetching Yahoo batch prices (using simulation):`, error.message);
            return null;
        }
    },

    // Get updated prices for a list of assets
    getLivePrices: async (assets, apiKey = null) => {
        const updates = {};
        const cryptoSymbols = [];
        const stockSymbols = [];

        // Separate assets
        assets.forEach(asset => {
            if (asset.type === 'Crypto') {
                cryptoSymbols.push(asset.symbol);
            } else {
                stockSymbols.push(asset.symbol);
                // Default to simulation first (fallback)
                updates[asset.id] = priceService.simulatePriceChange(asset.currentPrice);
            }
        });

        // Fetch real crypto prices
        if (cryptoSymbols.length > 0) {
            const realPrices = await priceService.fetchCryptoPrices(cryptoSymbols);
            if (realPrices) {
                assets.forEach(asset => {
                    if (asset.type === 'Crypto' && realPrices[asset.symbol]) {
                        updates[asset.id] = realPrices[asset.symbol];
                    }
                });
            }
        }

        // Fetch real stock prices from Yahoo Finance (BATCH)
        if (stockSymbols.length > 0) {
            // Remove duplicates for the API call
            const uniqueSymbols = [...new Set(stockSymbols)];

            const realPrices = await priceService.fetchYahooBatchPrices(uniqueSymbols);

            if (realPrices) {
                uniqueSymbols.forEach(symbol => {
                    if (realPrices[symbol]) {
                        // Find all assets with this symbol (could be multiple lots)
                        assets.filter(a => a.symbol === symbol).forEach(asset => {
                            updates[asset.id] = realPrices[symbol];
                        });
                    }
                });
            }
        }

        return updates;
    },

    // Fetch detailed stock info from Finnhub
    fetchStockDetails: async (symbol, apiKey) => {
        try {
            // Fetch Quote
            const quoteRes = await fetch(`${FINNHUB_API}?symbol=${symbol}&token=${apiKey}`);
            const quoteData = await quoteRes.json();

            // Fetch Profile
            const profileRes = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`);
            const profileData = await profileRes.json();

            if (!quoteData.c || !profileData.name) return null;

            return {
                id: symbol,
                symbol: symbol,
                name: profileData.name,
                logo: profileData.logo, // Add logo
                sector: profileData.finnhubIndustry || 'Unknown',
                price: quoteData.c,
                change: quoteData.dp, // percent change
                rating: 'Hold', // Default as API doesn't provide free rating
                analyst: 'Market Consensus',
                potential: 'N/A', // Requires premium API
                performance: {
                    ytd: 'N/A',
                    oneYear: 'N/A'
                },
                insiderActivity: [], // Requires premium API
                targetPrice: null,
                summary: `Real-time data for ${profileData.name}. Detailed analysis requires premium access.`
            };
        } catch (error) {
            console.error(`Error fetching details for ${symbol}:`, error);
            return null;
        }
    }
};
