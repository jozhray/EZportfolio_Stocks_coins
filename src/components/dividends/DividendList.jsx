import React from 'react'
import { Calendar, DollarSign } from 'lucide-react'
import { format } from 'date-fns'
import Card from '../ui/Card'

const DividendList = ({ dividends }) => {
    if (dividends.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-gray-900 font-medium">No dividends found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your time filter</p>
            </div>
        )
    }

    return (
        <div className="grid gap-4">
            {dividends.map((dividend) => (
                <Card key={dividend.id} className="flex items-center justify-between p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 font-bold text-sm">
                            {dividend.symbol.substring(0, 3)}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">{dividend.symbol}</h3>
                            <p className="text-sm text-gray-500">{dividend.name}</p>
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <p className="text-sm text-gray-500">Frequency</p>
                        <p className="font-medium">{dividend.frequency}</p>
                    </div>

                    <div className="text-right">
                        <div className="flex items-center justify-end gap-1 font-bold text-gray-900">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            {dividend.amount.toFixed(2)}
                        </div>
                        <div className="flex items-center justify-end gap-1 text-sm text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(dividend.payDate), 'MMM d, yyyy')}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}

export default DividendList
