import React from 'react'
import { Search } from 'lucide-react'
import clsx from 'clsx'

const sectors = ['All', 'Technology', 'Banking', 'Healthcare', 'Logistics', 'Finance', 'Energy', 'Consumer Goods']

const SearchSection = ({ searchQuery, onSearchChange, selectedSector, onSectorChange, onSortChange, onOrderChange }) => {
    return (
        <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search stocks by symbol or name..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        onChange={(e) => onSortChange(e.target.value)}
                        className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                        <option value="default">Sort By</option>
                        <option value="price">Price</option>
                        <option value="change">Daily Change</option>
                        <option value="marketCap">Market Cap</option>
                    </select>
                    <select
                        onChange={(e) => onOrderChange(e.target.value)}
                        className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {sectors.map((sector) => (
                    <button
                        key={sector}
                        onClick={() => onSectorChange(sector)}
                        className={clsx(
                            "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                            selectedSector === sector
                                ? "bg-gray-900 text-white"
                                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                        )}
                    >
                        {sector}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default SearchSection
