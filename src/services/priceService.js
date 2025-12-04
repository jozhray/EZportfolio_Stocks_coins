// CoinGecko API for Crypto
const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price';
const FINNHUB_API = 'https://finnhub.io/api/v1/quote';

// Mapping symbols to CoinGecko IDs
const CRYPTO_MAP = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'USDT': 'tether',
    'BNB': 'binancecoin',
    'SOL': 'solana',
    'XRP': 'ripple',
    'USDC': 'usd-coin',
    'ADA': 'cardano',
    'DOGE': 'dogecoin',
    'AVAX': 'avalanche-2',
    'TRX': 'tron',
    'DOT': 'polkadot',
    'LINK': 'chainlink',
    'MATIC': 'matic-network',
    'WBTC': 'wrapped-bitcoin',
    'LTC': 'litecoin',
    'DAI': 'dai',
    'BCH': 'bitcoin-cash',
    'UNI': 'uniswap',
    'ATOM': 'cosmos',
    'XLM': 'stellar',
    'ETC': 'ethereum-classic',
    'XMR': 'monero',
    'FIL': 'filecoin',
    'HBAR': 'hedera-hashgraph',
    'APT': 'aptos',
    'CRO': 'crypto-com-chain',
    'LDO': 'lido-dao',
    'NEAR': 'near',
    'VET': 'vechain',
    'QNT': 'quant-network',
    'AAVE': 'aave',
    'GRT': 'the-graph',
    'ALGO': 'algorand',
    'STX': 'blockstack',
    'EOS': 'eos',
    'SAND': 'the-sandbox',
    'EGLD': 'elrond-erd-2',
    'THETA': 'theta-token',
    'MANA': 'decentraland',
    'FTM': 'fantom',
    'AXS': 'axie-infinity',
    'FLOW': 'flow',
    'XTZ': 'tezos',
    'CHZ': 'chiliz',
    'NEO': 'neo',
    'KCS': 'kucoin-shares',
    'CRV': 'curve-dao-token',
    'BAT': 'basic-attention-token',
    'MKR': 'maker',
    'PEPE': 'pepe',
    'SHIB': 'shiba-inu'
};

export const priceService = {
    // Simple in-memory cache
    priceCache: {},
    lastFetchTime: 0,
    isFetching: false,

    // Helper to fetch with timeout and error handling
    fetchWithTimeout: async (url, options = {}) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 8000); // 8s timeout
        try {
            const response = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            throw error;
        }
    },

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

    // Fetch BATCH stock prices from Yahoo Finance (with Failover)
    fetchYahooBatchPrices: async (symbols) => {
        // Prevent parallel fetches to avoid rate limits
        if (priceService.isFetching) {
            console.warn('Fetch already in progress, skipping...');
            return null;
        }

        // Enforce 2-second cooldown between requests
        const now = Date.now();
        if (now - priceService.lastFetchTime < 2000) {
            return null;
        }

        priceService.isFetching = true;

        try {
            const symbolsString = symbols.join(',');
            const strategies = [
                {
                    name: 'Local Proxy (Spark)',
                    url: `/api/yahoo/v7/finance/spark?symbols=${symbolsString}&range=1d&interval=1d`
                },
                {
                    name: 'Local Proxy (Quote)',
                    url: `/api/yahoo/v7/finance/quote?symbols=${symbolsString}`
                }
            ];

            let data = null;
            let lastError = null;

            // Try strategies sequentially
            for (const strategy of strategies) {
                try {
                    const response = await priceService.fetchWithTimeout(strategy.url);

                    if (response.ok) {
                        const text = await response.text();
                        try {
                            data = JSON.parse(text);

                            // Handle Spark response
                            if (data.spark && data.spark.result) {
                                const prices = {};
                                data.spark.result.forEach(item => {
                                    if (item.response && item.response[0] && item.response[0].meta) {
                                        prices[item.symbol] = item.response[0].meta.regularMarketPrice;
                                    }
                                });
                                priceService.lastFetchTime = Date.now();
                                return prices;
                            }

                            // Handle Quote response
                            if (data.quoteResponse && data.quoteResponse.result) {
                                const prices = {};
                                data.quoteResponse.result.forEach(quote => {
                                    prices[quote.symbol] = quote.regularMarketPrice;
                                });
                                priceService.lastFetchTime = Date.now();
                                return prices;
                            }
                        } catch (e) {
                            // JSON parse error
                        }
                    }
                } catch (err) {
                    lastError = err;
                    console.warn(`${strategy.name} failed:`, err.message);
                }
            }

            throw new Error('All fetch strategies failed.');

        } catch (error) {
            console.warn(`Error fetching Yahoo batch prices:`, error.message);
            return null;
        } finally {
            priceService.isFetching = false;
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
                // Removed simulation fallback - strictly live data
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
    },

    // Fetch asset events (dividends and earnings) from Yahoo Finance
    fetchAssetEvents: async (symbol) => {
        try {
            // Range 2y to get past and future (projected) events
            // Yahoo Chart API returns dividends and earnings in the 'events' field
            const response = await priceService.fetchWithTimeout(`/api/yahoo/v8/finance/chart/${symbol}?range=2y&interval=1d&events=div|earn`);

            if (!response.ok) throw new Error('Yahoo Chart API error');

            const data = await response.json();
            const result = data.chart?.result?.[0];

            if (!result || !result.events) {
                return [];
            }

            const events = [];

            // Process Dividends
            if (result.events.dividends) {
                Object.values(result.events.dividends).forEach(div => {
                    events.push({
                        type: 'dividend',
                        date: new Date(div.date * 1000),
                        amount: div.amount,
                        symbol: symbol
                    });
                });
            }

            // Process Earnings
            if (result.events.earnings) {
                Object.values(result.events.earnings).forEach(earn => {
                    events.push({
                        type: 'earning',
                        date: new Date(earn.date * 1000),
                        estimate: earn.estimate,
                        actual: earn.actual,
                        symbol: symbol
                    });
                });
            }

            return events;
        } catch (error) {
            console.warn(`Error fetching events for ${symbol}:`, error.message);
            return [];
        }
    },

    // Fetch detailed earnings data (History and Trend)
    fetchEarningsDetails: async (symbol) => {
        try {
            // Try v10 first
            let url = `/api/yahoo/v10/finance/quoteSummary/${symbol}?modules=earningsHistory,earningsTrend`;
            console.log(`[PriceService] Fetching earnings for ${symbol} from: ${url}`);

            let response = await priceService.fetchWithTimeout(url);

            // Fallback to v11 if v10 fails
            if (!response.ok) {
                console.warn(`[PriceService] v10 API failed for ${symbol} (${response.status}), trying v11...`);
                url = `/api/yahoo/v11/finance/quoteSummary/${symbol}?modules=earningsHistory,earningsTrend`;
                response = await priceService.fetchWithTimeout(url);
            }

            if (!response.ok) {
                console.error(`[PriceService] Yahoo QuoteSummary API error for ${symbol}: ${response.status}`);
                throw new Error(`Yahoo QuoteSummary API error: ${response.status}`);
            }

            const data = await response.json();
            console.log(`[PriceService] Earnings data received for ${symbol}:`, data);

            const result = data.quoteSummary?.result?.[0];

            if (!result) {
                console.warn(`[PriceService] No result in quoteSummary for ${symbol}`);
                return { history: [], trend: [] };
            }

            const history = result.earningsHistory?.history || [];
            const trend = result.earningsTrend?.trend || [];

            console.log(`[PriceService] Parsed ${history.length} history items and ${trend.length} trend items for ${symbol}`);

            return {
                history: history.map(item => ({
                    date: item.quarter.fmt, // e.g., "2024-09-30"
                    epsEstimate: item.epsEstimate?.raw,
                    epsActual: item.epsActual?.raw,
                    revenueEstimate: item.revenueEstimate?.raw,
                    revenueActual: item.revenueActual?.raw,
                    period: item.period // "-3q", etc.
                })),
                trend: trend.filter(t => t.period === '+1q' || t.period === '+0q').map(item => ({
                    period: item.period, // "+1q" (Next Quarter)
                    endDate: item.endDate || null,
                    epsEstimate: item.earningsEstimate?.avg?.raw,
                    revenueEstimate: item.revenueEstimate?.avg?.raw,
                    growth: item.growth?.raw
                }))
            };
        } catch (error) {
            console.warn(`Error fetching earnings details for ${symbol}:`, error.message);
            return { history: [], trend: [] };
        }
    }
};
