import React from 'react'
import clsx from 'clsx'

const filters = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: '3m', label: '3 Months' },
    { id: '6m', label: '6 Months' },
    { id: '1y', label: '1 Year' },
    { id: '3y', label: '3 Years' },
    { id: '5y', label: '5 Years' },
    { id: 'all', label: 'All Time' },
]

const TimeFilter = ({ currentFilter, onFilterChange }) => {
    return (
        <div className="flex flex-wrap gap-2 mb-6">
            {filters.map((filter) => (
                <button
                    key={filter.id}
                    onClick={() => onFilterChange(filter.id)}
                    className={clsx(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all",
                        currentFilter === filter.id
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                    )}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    )
}

export default TimeFilter
