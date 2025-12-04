import React from 'react';
import { ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';

const MarketNews = ({ news, isLoading }) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!news || news.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <p>No market news available at the moment.</p>
            </div>
        );
    }

    const getSentimentColor = (sentiment) => {
        if (!sentiment) return 'text-gray-600';
        const score = parseFloat(sentiment);
        if (score > 0.15) return 'text-green-600';
        if (score < -0.15) return 'text-red-600';
        return 'text-gray-600';
    };

    const getSentimentLabel = (sentiment) => {
        if (!sentiment) return 'Neutral';
        const score = parseFloat(sentiment);
        if (score > 0.35) return 'Very Bullish';
        if (score > 0.15) return 'Bullish';
        if (score < -0.35) return 'Very Bearish';
        if (score < -0.15) return 'Bearish';
        return 'Neutral';
    };

    const getSentimentIcon = (sentiment) => {
        if (!sentiment) return null;
        const score = parseFloat(sentiment);
        if (score > 0.15) return <TrendingUp className="w-4 h-4" />;
        if (score < -0.15) return <TrendingDown className="w-4 h-4" />;
        return null;
    };

    const parseAlphaVantageTime = (timeString) => {
        if (!timeString) return null;
        try {
            // Alpha Vantage format: YYYYMMDDTHHMM
            const year = timeString.substring(0, 4);
            const month = timeString.substring(4, 6);
            const day = timeString.substring(6, 8);
            const hour = timeString.substring(9, 11);
            const minute = timeString.substring(11, 13);

            const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
            return isNaN(date.getTime()) ? null : date;
        } catch (error) {
            return null;
        }
    };

    return (
        <div className="space-y-4">
            {news.map((article, index) => (
                <div
                    key={index}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                            {/* Title */}
                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                {article.title}
                            </h3>

                            {/* Summary */}
                            {article.summary && (
                                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                                    {article.summary}
                                </p>
                            )}

                            {/* Metadata */}
                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                {/* Source */}
                                <span className="font-medium">{article.source}</span>

                                {/* Time */}
                                {article.time_published && parseAlphaVantageTime(article.time_published) && (
                                    <span>
                                        {format(parseAlphaVantageTime(article.time_published), 'MMM dd, yyyy h:mm a')}
                                    </span>
                                )}

                                {/* Sentiment */}
                                {article.overall_sentiment_score && (
                                    <div className={`flex items-center gap-1 ${getSentimentColor(article.overall_sentiment_score)}`}>
                                        {getSentimentIcon(article.overall_sentiment_score)}
                                        <span className="font-medium">
                                            {getSentimentLabel(article.overall_sentiment_score)}
                                        </span>
                                    </div>
                                )}

                                {/* Topics */}
                                {article.topics && article.topics.length > 0 && (
                                    <div className="flex gap-2">
                                        {article.topics.slice(0, 2).map((topic, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs"
                                            >
                                                {topic.topic}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thumbnail */}
                        {article.banner_image && (
                            <img
                                src={article.banner_image}
                                alt={article.title}
                                className="w-24 h-24 object-cover rounded flex-shrink-0"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        )}
                    </div>

                    {/* Read More Link */}
                    <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-3 font-medium"
                    >
                        Read full article
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            ))}
        </div>
    );
};

export default MarketNews;
