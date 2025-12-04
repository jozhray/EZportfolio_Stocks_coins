import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const EventCalendar = ({ events = [] }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Helper to find events for a specific day
    const getEventsForDay = (day) => {
        return events.filter(event => isSameDay(new Date(event.date), day));
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                    {format(currentDate, 'MMMM yyyy')}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={prevMonth}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 mb-2">
                    {weekDays.map(day => (
                        <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, dayIdx) => {
                        const dayEvents = getEventsForDay(day);
                        const hasEvents = dayEvents.length > 0;
                        const isCurrentMonth = isSameMonth(day, monthStart);

                        return (
                            <div
                                key={day.toString()}
                                className={clsx(
                                    "min-h-[80px] p-2 rounded-lg border transition-all relative group",
                                    isCurrentMonth ? "bg-white border-gray-100" : "bg-gray-50 border-transparent text-gray-400",
                                    isToday(day) && "ring-2 ring-blue-500 ring-offset-1",
                                    hasEvents && "hover:border-blue-200 hover:shadow-md cursor-pointer"
                                )}
                            >
                                <div className="flex justify-between items-start">
                                    <span className={clsx(
                                        "text-sm font-medium",
                                        !isCurrentMonth && "text-gray-300"
                                    )}>
                                        {format(day, 'd')}
                                    </span>
                                    {hasEvents && (
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold">
                                            {dayEvents.length}
                                        </span>
                                    )}
                                </div>

                                {/* Event Indicators */}
                                <div className="mt-1 space-y-1">
                                    {dayEvents.slice(0, 2).map((event, idx) => (
                                        <div
                                            key={idx}
                                            className={clsx(
                                                "flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md truncate",
                                                event.type === 'dividend' ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"
                                            )}
                                        >
                                            <span className="font-bold">{event.symbol}</span>
                                            <span>{event.type === 'dividend' ? 'Div' : 'Earn'}</span>
                                        </div>
                                    ))}
                                    {dayEvents.length > 2 && (
                                        <div className="text-[10px] text-gray-400 pl-1">
                                            +{dayEvents.length - 2} more
                                        </div>
                                    )}
                                </div>

                                {/* Tooltip for details */}
                                {hasEvents && (
                                    <div className="absolute z-10 hidden group-hover:block left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl">
                                        <div className="font-semibold mb-2 border-b border-gray-700 pb-1">
                                            {format(day, 'EEEE, MMMM d, yyyy')}
                                        </div>
                                        {dayEvents.map((event, idx) => (
                                            <div key={idx} className="flex justify-between py-2 border-b border-gray-800 last:border-0">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-white text-sm">{event.symbol}</span>
                                                    <span className="text-gray-400 text-[10px] truncate max-w-[120px]">{event.name}</span>
                                                    <span className={clsx(
                                                        "text-[10px] font-medium mt-0.5",
                                                        event.type === 'dividend' ? "text-green-400" : "text-blue-400"
                                                    )}>
                                                        {event.type === 'dividend' ? 'Dividend Payment' : 'Earnings Release'}
                                                    </span>
                                                </div>
                                                <div className="text-right flex flex-col justify-center">
                                                    {event.type === 'dividend' ? (
                                                        <>
                                                            <span className="text-green-300 font-bold text-sm">${event.amount?.toFixed(2)}</span>
                                                            <span className="text-gray-500 text-[10px]">per share</span>
                                                        </>
                                                    ) : (
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-blue-300 font-medium">Est: {event.estimate || 'N/A'}</span>
                                                            {event.actual && <span className="text-gray-400 text-[10px]">Act: {event.actual}</span>}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <div className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-gray-900"></div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default EventCalendar;
