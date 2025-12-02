export const STOCK_DATA = [
    // Technology
    {
        id: 'tech-1', symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', price: 271.49, change: 1.2, rating: 'Buy', analyst: 'Goldman Sachs',
        potential: '+15%', performance: { ytd: '+22%', oneYear: '+35%' },
        insiderActivity: [{ type: 'Sell', name: 'Tim Cook', amount: '$12M', date: '2025-01-15' }],
        targetPrice: 310.00, summary: 'Strong iPhone sales and services growth.', marketCap: 3500000000000
    },
    {
        id: 'tech-2', symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology', price: 472.12, change: 0.8, rating: 'Strong Buy', analyst: 'Morgan Stanley',
        potential: '+12%', performance: { ytd: '+18%', oneYear: '+40%' },
        insiderActivity: [{ type: 'Sell', name: 'Satya Nadella', amount: '$5M', date: '2025-02-01' }],
        targetPrice: 530.00, summary: 'Azure cloud dominance and AI integration.', marketCap: 3200000000000
    },
    {
        id: 'tech-3', symbol: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology', price: 178.88, change: 2.5, rating: 'Hold', analyst: 'JP Morgan',
        potential: '+8%', performance: { ytd: '+45%', oneYear: '+120%' },
        insiderActivity: [],
        targetPrice: 195.00, summary: 'AI chip demand remains high.', marketCap: 2800000000000
    },
    {
        id: 'tech-4', symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', price: 299.66, change: -0.5, rating: 'Buy', analyst: 'Citi',
        potential: '+18%', performance: { ytd: '+15%', oneYear: '+25%' },
        insiderActivity: [{ type: 'Buy', name: 'Sundar Pichai', amount: '$1M', date: '2025-01-20' }],
        targetPrice: 350.00, summary: 'Ad revenue rebounding and Cloud business profitable.'
    },
    {
        id: 'tech-5', symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Technology', price: 220.69, change: 1.1, rating: 'Buy', analyst: 'Barclays',
        potential: '+20%', performance: { ytd: '+10%', oneYear: '+18%' },
        insiderActivity: [],
        targetPrice: 265.00, summary: 'AWS and retail margins improving.'
    },
    {
        id: 'tech-6', symbol: 'META', name: 'Meta Platforms', sector: 'Technology', price: 594.25, change: 1.8, rating: 'Strong Buy', analyst: 'Jefferies',
        potential: '+10%', performance: { ytd: '+30%', oneYear: '+80%' },
        insiderActivity: [{ type: 'Sell', name: 'Mark Zuckerberg', amount: '$50M', date: '2025-02-10' }],
        targetPrice: 650.00, summary: 'Reels monetization and ad targeting improvements.'
    },
    {
        id: 'tech-7', symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Technology', price: 391.09, change: -1.2, rating: 'Hold', analyst: 'Deutsche Bank',
        potential: '+5%', performance: { ytd: '-5%', oneYear: '+10%' },
        insiderActivity: [],
        targetPrice: 410.00, summary: 'EV competition intensifying.'
    },
    {
        id: 'tech-8', symbol: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology', price: 218.93, change: 3.1, rating: 'Buy', analyst: 'BofA',
        potential: '+25%', performance: { ytd: '+28%', oneYear: '+60%' },
        insiderActivity: [{ type: 'Buy', name: 'Lisa Su', amount: '$3M', date: '2025-01-05' }],
        targetPrice: 275.00, summary: 'Data center share gains against Intel.'
    },
    {
        id: 'tech-9', symbol: 'INTC', name: 'Intel Corp.', sector: 'Technology', price: 40.22, change: -0.8, rating: 'Sell', analyst: 'Wells Fargo',
        potential: '-10%', performance: { ytd: '-15%', oneYear: '-25%' },
        insiderActivity: [],
        targetPrice: 35.00, summary: 'Turnaround plan facing execution risks.'
    },
    {
        id: 'tech-10', symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology', price: 265.40, change: 0.5, rating: 'Buy', analyst: 'Piper Sandler',
        potential: '+14%', performance: { ytd: '+12%', oneYear: '+20%' },
        insiderActivity: [],
        targetPrice: 300.00, summary: 'Focus on profitability and margins.'
    },
    { id: 'tech-11', symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Technology', price: 580.20, change: 1.0, rating: 'Buy', analyst: 'Evercore' },
    { id: 'tech-12', symbol: 'ORCL', name: 'Oracle Corp.', sector: 'Technology', price: 115.30, change: 0.2, rating: 'Hold', analyst: 'Stifel' },
    { id: 'tech-13', symbol: 'CSCO', name: 'Cisco Systems', sector: 'Technology', price: 52.10, change: -0.3, rating: 'Hold', analyst: 'Raymond James' },
    { id: 'tech-14', symbol: 'IBM', name: 'IBM', sector: 'Technology', price: 185.40, change: 0.6, rating: 'Buy', analyst: 'RBC' },
    { id: 'tech-15', symbol: 'QCOM', name: 'Qualcomm Inc.', sector: 'Technology', price: 165.20, change: 1.5, rating: 'Buy', analyst: 'KeyBanc' },
    { id: 'tech-16', symbol: 'TXN', name: 'Texas Instruments', sector: 'Technology', price: 170.50, change: 0.4, rating: 'Hold', analyst: 'Bernstein' },
    { id: 'tech-17', symbol: 'AVGO', name: 'Broadcom Inc.', sector: 'Technology', price: 1250.00, change: 2.2, rating: 'Strong Buy', analyst: 'Mizuho' },
    { id: 'tech-18', symbol: 'UBER', name: 'Uber Technologies', sector: 'Technology', price: 75.60, change: 1.9, rating: 'Buy', analyst: 'Needham' },
    { id: 'tech-19', symbol: 'ABNB', name: 'Airbnb Inc.', sector: 'Technology', price: 145.30, change: -1.0, rating: 'Hold', analyst: 'Loop Capital' },
    { id: 'tech-20', symbol: 'PLTR', name: 'Palantir Technologies', sector: 'Technology', price: 25.40, change: 4.5, rating: 'Buy', analyst: 'Wedbush' },
    { id: 'tech-21', symbol: 'PANW', name: 'Palo Alto Networks', sector: 'Technology', price: 290.50, change: 1.1, rating: 'Buy', analyst: 'Wedbush' },
    { id: 'tech-22', symbol: 'SNOW', name: 'Snowflake Inc.', sector: 'Technology', price: 160.20, change: 2.3, rating: 'Hold', analyst: 'Morgan Stanley' },
    { id: 'tech-23', symbol: 'WDAY', name: 'Workday Inc.', sector: 'Technology', price: 270.40, change: 0.5, rating: 'Buy', analyst: 'BMO' },
    { id: 'tech-24', symbol: 'TEAM', name: 'Atlassian', sector: 'Technology', price: 210.30, change: -0.8, rating: 'Hold', analyst: 'Canaccord' },
    { id: 'tech-25', symbol: 'SHOP', name: 'Shopify Inc.', sector: 'Technology', price: 75.20, change: 3.1, rating: 'Buy', analyst: 'Citi' },

    // Finance
    {
        id: 'fin-1', symbol: 'JPM', name: 'JPMorgan Chase', sector: 'Finance', price: 195.00, change: 0.5, rating: 'Buy', analyst: 'Citi',
        potential: '+8%', performance: { ytd: '+10%', oneYear: '+15%' },
        insiderActivity: [{ type: 'Sell', name: 'Jamie Dimon', amount: '$15M', date: '2024-11-15' }],
        targetPrice: 210.00, summary: 'Strong balance sheet and net interest income.'
    },
    {
        id: 'fin-2', symbol: 'BAC', name: 'Bank of America', sector: 'Finance', price: 38.50, change: 0.2, rating: 'Hold', analyst: 'Goldman Sachs',
        potential: '+5%', performance: { ytd: '+2%', oneYear: '+5%' },
        insiderActivity: [],
        targetPrice: 40.00, summary: 'Stable but facing headwinds.'
    },
    {
        id: 'fin-3', symbol: 'WFC', name: 'Wells Fargo', sector: 'Finance', price: 58.20, change: 0.8, rating: 'Buy', analyst: 'Morgan Stanley',
        potential: '+12%', performance: { ytd: '+8%', oneYear: '+12%' },
        insiderActivity: [],
        targetPrice: 65.00, summary: 'Asset cap removal potential.'
    },
    {
        id: 'fin-4', symbol: 'C', name: 'Citigroup', sector: 'Finance', price: 62.40, change: -0.4, rating: 'Hold', analyst: 'BofA',
        potential: '+15%', performance: { ytd: '+5%', oneYear: '+10%' },
        insiderActivity: [],
        targetPrice: 72.00, summary: 'Restructuring ongoing.'
    },
    {
        id: 'fin-5', symbol: 'GS', name: 'Goldman Sachs', sector: 'Finance', price: 450.10, change: 1.2, rating: 'Strong Buy', analyst: 'JPM',
        potential: '+10%', performance: { ytd: '+15%', oneYear: '+22%' },
        insiderActivity: [],
        targetPrice: 495.00, summary: 'Investment banking activity rebounding.'
    },
    { id: 'fin-6', symbol: 'MS', name: 'Morgan Stanley', sector: 'Finance', price: 98.50, change: 0.6, rating: 'Buy', analyst: 'Barclays' },
    { id: 'fin-7', symbol: 'BLK', name: 'BlackRock', sector: 'Finance', price: 820.00, change: 1.5, rating: 'Buy', analyst: 'Deutsche Bank' },
    { id: 'fin-8', symbol: 'V', name: 'Visa Inc.', sector: 'Finance', price: 285.40, change: 0.3, rating: 'Buy', analyst: 'RBC' },
    { id: 'fin-9', symbol: 'MA', name: 'Mastercard', sector: 'Finance', price: 460.20, change: 0.4, rating: 'Buy', analyst: 'Evercore' },
    { id: 'fin-10', symbol: 'AXP', name: 'American Express', sector: 'Finance', price: 230.50, change: 1.1, rating: 'Buy', analyst: 'Jefferies' },
    { id: 'fin-11', symbol: 'PYPL', name: 'PayPal Holdings', sector: 'Finance', price: 65.30, change: -1.5, rating: 'Hold', analyst: 'MoffettNathanson' },
    { id: 'fin-12', symbol: 'SQ', name: 'Block Inc.', sector: 'Finance', price: 78.40, change: 2.0, rating: 'Buy', analyst: 'BTIG' },
    { id: 'fin-13', symbol: 'COIN', name: 'Coinbase Global', sector: 'Finance', price: 245.00, change: 5.5, rating: 'Buy', analyst: 'Compass Point' },
    { id: 'fin-14', symbol: 'HOOD', name: 'Robinhood Markets', sector: 'Finance', price: 22.50, change: 3.2, rating: 'Hold', analyst: 'JMP' },
    { id: 'fin-15', symbol: 'SCHW', name: 'Charles Schwab', sector: 'Finance', price: 72.10, change: 0.1, rating: 'Hold', analyst: 'UBS' },
    { id: 'fin-16', symbol: 'USB', name: 'US Bancorp', sector: 'Finance', price: 45.20, change: 0.3, rating: 'Hold', analyst: 'RBC' },
    { id: 'fin-17', symbol: 'PNC', name: 'PNC Financial', sector: 'Finance', price: 155.40, change: 0.5, rating: 'Buy', analyst: 'Wells Fargo' },
    { id: 'fin-18', symbol: 'TFC', name: 'Truist Financial', sector: 'Finance', price: 38.60, change: 0.2, rating: 'Hold', analyst: 'BofA' },
    { id: 'fin-19', symbol: 'BK', name: 'BNY Mellon', sector: 'Finance', price: 58.90, change: 0.4, rating: 'Buy', analyst: 'Evercore' },
    { id: 'fin-20', symbol: 'STT', name: 'State Street', sector: 'Finance', price: 75.20, change: 0.1, rating: 'Hold', analyst: 'KBW' },

    // Healthcare
    {
        id: 'hlth-1', symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', price: 155.00, change: 0.2, rating: 'Buy', analyst: 'Bank of America',
        potential: '+10%', performance: { ytd: '+3%', oneYear: '+5%' },
        insiderActivity: [],
        targetPrice: 170.00, summary: 'MedTech growth offsetting slower pharma sales.'
    },
    {
        id: 'hlth-2', symbol: 'LLY', name: 'Eli Lilly', sector: 'Healthcare', price: 780.40, change: 2.8, rating: 'Strong Buy', analyst: 'Cantor',
        potential: '+20%', performance: { ytd: '+40%', oneYear: '+90%' },
        insiderActivity: [],
        targetPrice: 950.00, summary: 'Weight loss drugs driving massive growth.'
    },
    { id: 'hlth-3', symbol: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare', price: 490.20, change: -0.5, rating: 'Buy', analyst: 'Oppenheimer' },
    { id: 'hlth-4', symbol: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare', price: 28.50, change: -0.2, rating: 'Hold', analyst: 'Leerink' },
    { id: 'hlth-5', symbol: 'MRK', name: 'Merck & Co.', sector: 'Healthcare', price: 125.40, change: 0.9, rating: 'Buy', analyst: 'Guggenheim' },
    { id: 'hlth-6', symbol: 'ABBV', name: 'AbbVie Inc.', sector: 'Healthcare', price: 175.20, change: 1.1, rating: 'Buy', analyst: 'Piper Sandler' },
    { id: 'hlth-7', symbol: 'TMO', name: 'Thermo Fisher', sector: 'Healthcare', price: 580.50, change: 0.4, rating: 'Buy', analyst: 'Cowen' },
    { id: 'hlth-8', symbol: 'DHR', name: 'Danaher Corp.', sector: 'Healthcare', price: 250.30, change: 0.7, rating: 'Buy', analyst: 'Wolfe' },
    { id: 'hlth-9', symbol: 'BMY', name: 'Bristol-Myers Squibb', sector: 'Healthcare', price: 52.10, change: -1.1, rating: 'Hold', analyst: 'BMO' },
    { id: 'hlth-10', symbol: 'AMGN', name: 'Amgen Inc.', sector: 'Healthcare', price: 310.40, change: 0.3, rating: 'Hold', analyst: 'Argus' },
    { id: 'hlth-11', symbol: 'GILD', name: 'Gilead Sciences', sector: 'Healthcare', price: 68.50, change: 0.2, rating: 'Hold', analyst: 'RBC' },
    { id: 'hlth-12', symbol: 'CVS', name: 'CVS Health', sector: 'Healthcare', price: 75.20, change: -0.5, rating: 'Buy', analyst: 'Evercore' },
    { id: 'hlth-13', symbol: 'ISRG', name: 'Intuitive Surgical', sector: 'Healthcare', price: 390.50, change: 1.5, rating: 'Buy', analyst: 'Stifel' },
    { id: 'hlth-14', symbol: 'SYK', name: 'Stryker Corp.', sector: 'Healthcare', price: 340.20, change: 0.8, rating: 'Buy', analyst: 'BTIG' },
    { id: 'hlth-15', symbol: 'ZTS', name: 'Zoetis Inc.', sector: 'Healthcare', price: 180.40, change: 0.6, rating: 'Buy', analyst: 'William Blair' },

    // Consumer
    {
        id: 'cons-1', symbol: 'PG', name: 'Procter & Gamble', sector: 'Consumer', price: 168.50, change: 0.1, rating: 'Buy', analyst: 'Stifel',
        potential: '+6%', performance: { ytd: '+5%', oneYear: '+8%' },
        insiderActivity: [],
        targetPrice: 180.00, summary: 'Pricing power protecting margins.'
    },
    {
        id: 'cons-2', symbol: 'KO', name: 'Coca-Cola', sector: 'Consumer', price: 62.40, change: 0.2, rating: 'Hold', analyst: 'HSBC',
        potential: '+4%', performance: { ytd: '+2%', oneYear: '+4%' },
        insiderActivity: [],
        targetPrice: 65.00, summary: 'Defensive play with reliable dividend.'
    },
    { id: 'cons-3', symbol: 'PEP', name: 'PepsiCo', sector: 'Consumer', price: 172.50, change: -0.3, rating: 'Hold', analyst: 'DB' },
    {
        id: 'cons-4', symbol: 'COST', name: 'Costco Wholesale', sector: 'Consumer', price: 780.20, change: 1.5, rating: 'Strong Buy', analyst: 'Telsey',
        potential: '+8%', performance: { ytd: '+25%', oneYear: '+45%' },
        insiderActivity: [],
        targetPrice: 850.00, summary: 'Membership renewal rates at all-time highs.'
    },
    { id: 'cons-5', symbol: 'WMT', name: 'Walmart Inc.', sector: 'Consumer', price: 60.50, change: 0.8, rating: 'Buy', analyst: 'Jefferies' },
    { id: 'cons-6', symbol: 'TGT', name: 'Target Corp.', sector: 'Consumer', price: 155.20, change: -2.1, rating: 'Hold', analyst: 'Gordon Haskett' },
    { id: 'cons-7', symbol: 'NKE', name: 'Nike Inc.', sector: 'Consumer', price: 95.40, change: 0.5, rating: 'Buy', analyst: 'Williams Trading' },
    { id: 'cons-8', symbol: 'SBUX', name: 'Starbucks', sector: 'Consumer', price: 88.20, change: -0.4, rating: 'Hold', analyst: 'Wedbush' },
    { id: 'cons-9', symbol: 'MCD', name: 'McDonald\'s', sector: 'Consumer', price: 285.60, change: 0.3, rating: 'Buy', analyst: 'Baird' },
    { id: 'cons-10', symbol: 'DIS', name: 'Walt Disney', sector: 'Consumer', price: 115.40, change: 1.2, rating: 'Buy', analyst: 'Needham' },
    { id: 'cons-11', symbol: 'HD', name: 'Home Depot', sector: 'Consumer', price: 350.20, change: 0.5, rating: 'Buy', analyst: 'Truist' },
    { id: 'cons-12', symbol: 'LOW', name: 'Lowe\'s', sector: 'Consumer', price: 230.50, change: 0.4, rating: 'Hold', analyst: 'Wedbush' },
    { id: 'cons-13', symbol: 'TJX', name: 'TJX Companies', sector: 'Consumer', price: 98.40, change: 0.9, rating: 'Buy', analyst: 'Cowen' },
    { id: 'cons-14', symbol: 'LULU', name: 'Lululemon', sector: 'Consumer', price: 450.20, change: -1.5, rating: 'Hold', analyst: 'Citi' },
    { id: 'cons-15', symbol: 'CMG', name: 'Chipotle', sector: 'Consumer', price: 2800.50, change: 1.8, rating: 'Buy', analyst: 'Bernstein' },

    // Energy
    {
        id: 'ener-1', symbol: 'XOM', name: 'Exxon Mobil', sector: 'Energy', price: 118.50, change: 0.9, rating: 'Buy', analyst: 'TD Cowen',
        potential: '+12%', performance: { ytd: '+10%', oneYear: '+15%' },
        insiderActivity: [],
        targetPrice: 135.00, summary: 'Strong cash flow supporting buybacks.'
    },
    { id: 'ener-2', symbol: 'CVX', name: 'Chevron', sector: 'Energy', price: 155.20, change: 0.6, rating: 'Hold', analyst: 'Scotiabank' },
    { id: 'ener-3', symbol: 'COP', name: 'ConocoPhillips', sector: 'Energy', price: 125.40, change: 1.1, rating: 'Buy', analyst: 'Mizuho' },
    { id: 'ener-4', symbol: 'SLB', name: 'Schlumberger', sector: 'Energy', price: 52.10, change: 0.4, rating: 'Buy', analyst: 'Benchmark' },
    { id: 'ener-5', symbol: 'EOG', name: 'EOG Resources', sector: 'Energy', price: 130.50, change: 0.8, rating: 'Buy', analyst: 'Raymond James' },
    { id: 'ener-6', symbol: 'MPC', name: 'Marathon Petroleum', sector: 'Energy', price: 170.20, change: 0.5, rating: 'Buy', analyst: 'JPM' },
    { id: 'ener-7', symbol: 'PSX', name: 'Phillips 66', sector: 'Energy', price: 145.40, change: 0.3, rating: 'Hold', analyst: 'Piper Sandler' },
    { id: 'ener-8', symbol: 'VLO', name: 'Valero Energy', sector: 'Energy', price: 155.60, change: 0.7, rating: 'Buy', analyst: 'Tudor Pickering' },
    { id: 'ener-9', symbol: 'OXY', name: 'Occidental Petroleum', sector: 'Energy', price: 62.40, change: 0.2, rating: 'Hold', analyst: 'Stephens' },
    { id: 'ener-10', symbol: 'KMI', name: 'Kinder Morgan', sector: 'Energy', price: 18.50, change: 0.1, rating: 'Hold', analyst: 'Wolfe' },

    // Real Estate
    {
        id: 're-1', symbol: 'O', name: 'Realty Income', sector: 'Real Estate', price: 55.40, change: 0.2, rating: 'Buy', analyst: 'Stifel',
        potential: '+15%', performance: { ytd: '-5%', oneYear: '-10%' },
        insiderActivity: [],
        targetPrice: 64.00, summary: 'Monthly dividend payer, undervalued.'
    },
    { id: 're-2', symbol: 'PLD', name: 'Prologis', sector: 'Real Estate', price: 125.60, change: 0.5, rating: 'Buy', analyst: 'Evercore' },
    { id: 're-3', symbol: 'AMT', name: 'American Tower', sector: 'Real Estate', price: 195.20, change: -0.1, rating: 'Hold', analyst: 'BMO' },
    { id: 're-4', symbol: 'CCI', name: 'Crown Castle', sector: 'Real Estate', price: 105.40, change: 0.3, rating: 'Hold', analyst: 'RBC' },
    { id: 're-5', symbol: 'SPG', name: 'Simon Property', sector: 'Real Estate', price: 150.20, change: 1.2, rating: 'Buy', analyst: 'Piper Sandler' },
    { id: 're-6', symbol: 'VICI', name: 'VICI Properties', sector: 'Real Estate', price: 30.50, change: 0.4, rating: 'Buy', analyst: 'JPM' },
    { id: 're-7', symbol: 'DLR', name: 'Digital Realty', sector: 'Real Estate', price: 140.20, change: 0.6, rating: 'Hold', analyst: 'Citi' },
    { id: 're-8', symbol: 'EQIX', name: 'Equinix', sector: 'Real Estate', price: 850.40, change: 1.1, rating: 'Buy', analyst: 'Truist' },
    { id: 're-9', symbol: 'PSA', name: 'Public Storage', sector: 'Real Estate', price: 280.50, change: 0.2, rating: 'Hold', analyst: 'Jefferies' },
    { id: 're-10', symbol: 'WELL', name: 'Welltower', sector: 'Real Estate', price: 95.40, change: 0.8, rating: 'Buy', analyst: 'BofA' },
];
