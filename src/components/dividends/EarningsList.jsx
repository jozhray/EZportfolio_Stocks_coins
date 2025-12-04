import React from 'react'
import clsx from 'clsx'
import { format } from 'date-fns'

const EarningsList = ({ earningsData, isLoading }) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-500">Loading earnings details...</p>
            </div>
        )
    }

    if (!earningsData || (earningsData.history.length === 0 && earningsData.trend.length === 0)) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <p className="text-gray-500">No earnings data available.</p>
            </div>
        )
    }

    const { history, trend } = earningsData;

    const formatCurrency = (val) => {
        if (val === undefined || val === null) return 'N/A';
        if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
        if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
        return `$${val.toLocaleString()}`;
    };

    return (
        <div className="space-y-6">
            {/* Future Estimates */}
            {trend.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-blue-50/50">
                        <h3 className="font-semibold text-gray-900">Upcoming Earnings Estimates</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">EPS Est.</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {trend.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.symbol || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.period || 'Upcoming'}
                                            {item.endDate && <span className="text-gray-400 font-normal ml-2">({item.endDate})</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                            {item.epsEstimate ? `$${item.epsEstimate.toFixed(2)}` : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Past Performance */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Past Earnings Performance</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">EPS (Act / Est)</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Surprise</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {history.map((item, idx) => {
                                const epsSurprise = item.epsActual && item.epsEstimate
                                    ? ((item.epsActual - item.epsEstimate) / Math.abs(item.epsEstimate)) * 100
                                    : null;

                                return (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.symbol || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="font-medium text-gray-900">{item.epsActual ? `$${item.epsActual.toFixed(2)}` : '-'}</span>
                                                <span className="text-xs text-gray-500">Est: {item.epsEstimate ? `$${item.epsEstimate.toFixed(2)}` : '-'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                            {epsSurprise !== null ? (
                                                <span className={clsx(
                                                    "px-2 py-1 rounded-full text-xs font-medium",
                                                    epsSurprise >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                )}>
                                                    {epsSurprise > 0 ? '+' : ''}{epsSurprise.toFixed(2)}%
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default EarningsList
