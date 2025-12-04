import React, { useState, useMemo, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { storageService } from '../services/storage'
import TimeFilter from '../components/dividends/TimeFilter'
import DividendList from '../components/dividends/DividendList'
import EarningsList from '../components/dividends/EarningsList'
import EventCalendar from '../components/dividends/EventCalendar'
import { priceService } from '../services/priceService'
import { POPULAR_MARKET_STOCKS } from '../utils/marketData'
import { isWithinInterval, addWeeks, addMonths, addYears, parseISO, format } from 'date-fns'
import clsx from 'clsx'
import { Calendar as CalendarIcon, TrendingUp } from 'lucide-react'

const Dividends = () => {
    const { user } = useAuth()
    const [filter, setFilter] = useState('month')
    const [portfolio, setPortfolio] = useState([])
    const [calendarMode, setCalendarMode] = useState('my') // 'my' or 'market'
    const [bottomViewMode, setBottomViewMode] = useState('calendar') // 'calendar' or 'earnings'
    const [myCalendarEvents, setMyCalendarEvents] = useState([])
    const [marketCalendarEvents, setMarketCalendarEvents] = useState([])
    const [isLoadingCalendar, setIsLoadingCalendar] = useState(false)

    // Earnings Data State
    const [earningsData, setEarningsData] = useState({ history: [], trend: [] })
    const [isLoadingEarnings, setIsLoadingEarnings] = useState(false)

    useEffect(() => {
        if (user) {
            const data = storageService.getPortfolio(user.id)
            setPortfolio(data)
        }
    }, [user])

    // Fetch real asset events (dividends and earnings) for calendar
    useEffect(() => {
        const fetchCalendarData = async () => {
            setIsLoadingCalendar(true);

            // Fetch My Portfolio Data
            if (calendarMode === 'my') {
                if (portfolio.length === 0) {
                    setMyCalendarEvents([]);
                    setIsLoadingCalendar(false);
                    return;
                }

                // Check if we already have data to avoid refetching
                if (myCalendarEvents.length > 0 && myCalendarEvents[0].symbol === portfolio[0].symbol) { // Simple check
                    setIsLoadingCalendar(false);
                    return;
                }

                const symbols = [...new Set(portfolio.filter(a => a.type === 'Stock' || a.type === 'ETF').map(a => a.symbol))];
                const allEvents = [];

                for (const symbol of symbols) {
                    const events = await priceService.fetchAssetEvents(symbol);
                    if (events && events.length > 0) {
                        // Attach company name from portfolio
                        const asset = portfolio.find(a => a.symbol === symbol);
                        const name = asset ? asset.name : symbol;
                        const eventsWithName = events.map(e => ({ ...e, name }));
                        allEvents.push(...eventsWithName);
                    }
                }
                setMyCalendarEvents(allEvents);
            }
            // Fetch Market Data
            else {
                if (marketCalendarEvents.length > 0) {
                    setIsLoadingCalendar(false);
                    return;
                }

                const allEvents = [];
                for (const stock of POPULAR_MARKET_STOCKS) {
                    const events = await priceService.fetchAssetEvents(stock.symbol);
                    if (events && events.length > 0) {
                        // Attach company name from market data
                        const eventsWithName = events.map(e => ({ ...e, name: stock.name }));
                        allEvents.push(...eventsWithName);
                    }
                }
                setMarketCalendarEvents(allEvents);
            }

            setIsLoadingCalendar(false);
        };

        fetchCalendarData();
    }, [portfolio, calendarMode]); // Re-run when mode changes

    // Fetch Earnings Details when in Earnings View
    useEffect(() => {
        const fetchEarningsData = async () => {
            if (bottomViewMode !== 'earnings') return;

            setIsLoadingEarnings(true);
            const allHistory = [];
            const allTrend = [];

            const symbolsToFetch = calendarMode === 'my'
                ? [...new Set(portfolio.filter(a => a.type === 'Stock' || a.type === 'ETF').map(a => a.symbol))]
                : POPULAR_MARKET_STOCKS.map(s => s.symbol);

            // Limit to first 5 for performance if list is long, or fetch all if reasonable
            // For now, let's fetch for the first 5 symbols to avoid rate limits
            const limitedSymbols = symbolsToFetch.slice(0, 5);

            for (const symbol of limitedSymbols) {
                const details = await priceService.fetchEarningsDetails(symbol);
                if (details) {
                    // Add symbol to each item for context
                    if (details.history) allHistory.push(...details.history.map(h => ({ ...h, symbol })));
                    if (details.trend) allTrend.push(...details.trend.map(t => ({ ...t, symbol })));
                }
            }

            setEarningsData({
                history: allHistory.sort((a, b) => new Date(b.date) - new Date(a.date)),
                trend: allTrend
            });
            setIsLoadingEarnings(false);
        };

        fetchEarningsData();
    }, [bottomViewMode, calendarMode, portfolio]);

    const dividendData = useMemo(() => {
        const dividends = [];
        const now = new Date();
        const oneYearFromNow = addYears(now, 1);

        portfolio.forEach(asset => {
            if (asset.dividendAmount && asset.dividendAmount > 0) {
                const frequency = asset.dividendFrequency || 'Quarterly';
                let monthsToAdd = 3;
                let paymentsPerYear = 4;

                switch (frequency) {
                    case 'Monthly': monthsToAdd = 1; paymentsPerYear = 12; break;
                    case 'Quarterly': monthsToAdd = 3; paymentsPerYear = 4; break;
                    case 'Semi-Annually': monthsToAdd = 6; paymentsPerYear = 2; break;
                    case 'Annually': monthsToAdd = 12; paymentsPerYear = 1; break;
                    default: monthsToAdd = 3; paymentsPerYear = 4;
                }

                // Calculate payment amount per period
                const paymentAmount = asset.quantity * (asset.dividendAmount / paymentsPerYear);

                // Generate payments for the next year
                // Assuming payments start from buy date or next logical period
                let nextDate = new Date(asset.buyDate);
                while (nextDate < now) {
                    nextDate = addMonths(nextDate, monthsToAdd);
                }

                // Generate payments until one year from now
                while (nextDate <= oneYearFromNow) {
                    dividends.push({
                        id: `${asset.id}-${format(nextDate, 'yyyy-MM-dd')}`,
                        symbol: asset.symbol,
                        name: asset.name,
                        amount: paymentAmount,
                        frequency: frequency,
                        payDate: format(nextDate, 'yyyy-MM-dd'),
                        exDate: format(addWeeks(nextDate, -2), 'yyyy-MM-dd') // Estimate ex-date
                    });
                    nextDate = addMonths(nextDate, monthsToAdd);
                }
            }
        });
        return dividends;
    }, [portfolio]);

    const filteredDividends = useMemo(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        return dividendData.filter(div => {
            const date = parseISO(div.payDate);
            if (filter === 'all') return true;

            let endDate;
            switch (filter) {
                case 'week': endDate = addWeeks(now, 1); break;
                case 'month': endDate = addMonths(now, 1); break;
                case '3m': endDate = addMonths(now, 3); break;
                case '6m': endDate = addMonths(now, 6); break;
                case '1y': endDate = addYears(now, 1); break;
                case '3y': endDate = addYears(now, 3); break;
                case '5y': endDate = addYears(now, 5); break;
                default: return true;
            }

            return isWithinInterval(date, { start: now, end: endDate });
        }).sort((a, b) => new Date(a.payDate) - new Date(b.payDate));
    }, [filter, dividendData]);

    const totalDividends = filteredDividends.reduce((sum, div) => sum + div.amount, 0);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dividend & Earning</h1>
                <p className="text-gray-500">Track your upcoming payouts and company earnings reports</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <p className="text-sm text-gray-500 mb-1">Estimated Income ({filter === 'all' ? 'Next 12 Months' : 'Next ' + filter})</p>
                <h2 className="text-3xl font-bold text-gray-900">${totalDividends.toFixed(2)}</h2>
            </div>

            {/* Section 1: My Dividend Earning Value (Always Visible) */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">My Dividend Earning Value</h3>
                </div>

                <TimeFilter currentFilter={filter} onFilterChange={setFilter} />

                {filteredDividends.length > 0 ? (
                    <DividendList dividends={filteredDividends} />
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">No dividends found for this period.</p>
                        <p className="text-sm text-gray-400 mt-1">Add stocks with dividend info to your portfolio.</p>
                    </div>
                )}
            </div>

            {/* Section 2: Calendar & Earnings (Tabbed) */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    {/* Tabs */}
                    <div className="flex bg-gray-100 p-1 rounded-lg self-start">
                        <button
                            onClick={() => setBottomViewMode('calendar')}
                            className={clsx(
                                "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                                bottomViewMode === 'calendar' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            <CalendarIcon className="w-4 h-4" />
                            Dividend Calendar
                        </button>
                        <button
                            onClick={() => setBottomViewMode('earnings')}
                            className={clsx(
                                "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                                bottomViewMode === 'earnings' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            <TrendingUp className="w-4 h-4" />
                            Earnings Details
                        </button>
                    </div>

                    {/* Data Source Toggle (My vs Market) */}
                    <div className="flex bg-gray-100 p-1 rounded-lg self-start">
                        <button
                            onClick={() => setCalendarMode('my')}
                            className={clsx(
                                "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                                calendarMode === 'my' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            My Portfolio
                        </button>
                        <button
                            onClick={() => setCalendarMode('market')}
                            className={clsx(
                                "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                                calendarMode === 'market' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            Market
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="min-h-[400px]">
                    {bottomViewMode === 'calendar' ? (
                        isLoadingCalendar ? (
                            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                <p className="text-gray-500">Loading {calendarMode === 'my' ? 'your' : 'market'} calendar data...</p>
                            </div>
                        ) : (
                            <EventCalendar events={calendarMode === 'my' ? myCalendarEvents : marketCalendarEvents} />
                        )
                    ) : (
                        // Earnings View
                        <EarningsList earningsData={earningsData} isLoading={isLoadingEarnings} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dividends
