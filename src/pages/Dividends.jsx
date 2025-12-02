import React, { useState, useMemo, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { storageService } from '../services/storage'
import TimeFilter from '../components/dividends/TimeFilter'
import DividendList from '../components/dividends/DividendList'
import { isWithinInterval, addWeeks, addMonths, addYears, parseISO, format } from 'date-fns'

const Dividends = () => {
    const { user } = useAuth()
    const [filter, setFilter] = useState('month')
    const [portfolio, setPortfolio] = useState([])

    useEffect(() => {
        if (user) {
            const data = storageService.getPortfolio(user.id)
            setPortfolio(data)
        }
    }, [user])

    const dividendData = useMemo(() => {
        const dividends = [];
        const now = new Date();
        const oneYearFromNow = addYears(now, 1);

        portfolio.forEach(asset => {
            if (asset.dividendAmount && asset.dividendAmount > 0) {
                // Generate quarterly payments for the next year
                // Assuming payments start from buy date or next logical quarter
                let nextDate = new Date(asset.buyDate);
                while (nextDate < now) {
                    nextDate = addMonths(nextDate, 3);
                }

                // Generate 4 payments
                for (let i = 0; i < 4; i++) {
                    const payDate = addMonths(nextDate, i * 3);
                    if (payDate <= oneYearFromNow) {
                        dividends.push({
                            id: `${asset.id}-${i}`,
                            symbol: asset.symbol,
                            name: asset.name,
                            amount: asset.quantity * (asset.dividendAmount / 4), // Quarterly assumption
                            payDate: format(payDate, 'yyyy-MM-dd'),
                            exDate: format(addWeeks(payDate, -2), 'yyyy-MM-dd') // Estimate ex-date
                        });
                    }
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
                <h1 className="text-2xl font-bold text-gray-900">Dividend Calendar</h1>
                <p className="text-gray-500">Track your upcoming dividend payments (Estimated Quarterly)</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <p className="text-sm text-gray-500 mb-1">Estimated Income ({filter === 'all' ? 'Next 12 Months' : 'Next ' + filter})</p>
                <h2 className="text-3xl font-bold text-gray-900">${totalDividends.toFixed(2)}</h2>
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
    )
}

export default Dividends
