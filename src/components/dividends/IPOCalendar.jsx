import React from 'react';
import { Calendar, TrendingUp, DollarSign } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const IPOCalendar = ({ ipos, isLoading }) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!ipos || ipos.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <p>No upcoming IPOs available at the moment.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {ipos.map((ipo, index) => (
                <div
                    key={index}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                            {/* Company Name and Symbol */}
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900 text-lg">
                                    {ipo.name || 'N/A'}
                                </h3>
                                {ipo.symbol && (
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                                        {ipo.symbol}
                                    </span>
                                )}
                            </div>

                            {/* IPO Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                {/* Date */}
                                {ipo.ipoDate && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar className="w-4 h-4 text-blue-600" />
                                        <span className="font-medium">IPO Date:</span>
                                        <span>
                                            {format(parseISO(ipo.ipoDate), 'MMM dd, yyyy')}
                                        </span>
                                    </div>
                                )}

                                {/* Price Range */}
                                {ipo.priceRangeLow && ipo.priceRangeHigh && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <DollarSign className="w-4 h-4 text-green-600" />
                                        <span className="font-medium">Price Range:</span>
                                        <span>
                                            ${ipo.priceRangeLow} - ${ipo.priceRangeHigh}
                                        </span>
                                    </div>
                                )}

                                {/* Shares */}
                                {ipo.numberOfShares && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <TrendingUp className="w-4 h-4 text-purple-600" />
                                        <span className="font-medium">Shares:</span>
                                        <span>
                                            {parseInt(ipo.numberOfShares).toLocaleString()}
                                        </span>
                                    </div>
                                )}

                                {/* Exchange */}
                                {ipo.exchange && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <span className="font-medium">Exchange:</span>
                                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                                            {ipo.exchange}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default IPOCalendar;
