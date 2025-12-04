import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { storageService } from '../services/storage';

const UserTour = ({ userId, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    const tourSteps = [
        {
            title: "Welcome to Ez Portfolio! 🎉",
            description: "Let's take a quick tour to help you get started with managing your investments.",
            target: null,
            position: "center"
        },
        {
            title: "Add Your First Asset",
            description: "Click the 'Add Asset' button to add stocks, ETFs, or cryptocurrencies to your portfolio.",
            target: "[data-tour='add-asset']",
            position: "bottom"
        },
        {
            title: "Portfolio Overview",
            description: "View your total portfolio value, individual holdings, and performance metrics here.",
            target: "[data-tour='portfolio-summary']",
            position: "bottom"
        },
        {
            title: "Dividend Calendar",
            description: "Track your upcoming dividend payments and company earnings in the Dividends section.",
            target: "[data-tour='dividends-nav']",
            position: "bottom"
        },
        {
            title: "Market Updates",
            description: "Stay informed with the latest market news, crypto updates, and upcoming IPOs.",
            target: "[data-tour='market-updates-nav']",
            position: "bottom"
        },
        {
            title: "Search for Stocks",
            description: "Use the search feature to find detailed news and analysis for any stock symbol.",
            target: "[data-tour='stock-search']",
            position: "bottom"
        },
        {
            title: "You're All Set! ✨",
            description: "You now know the basics! Start building your portfolio and tracking your investments.",
            target: null,
            position: "center"
        }
    ];

    useEffect(() => {
        // Show tour after a short delay
        const timer = setTimeout(() => setIsVisible(true), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleNext = () => {
        if (currentStep < tourSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        handleComplete();
    };

    const handleComplete = () => {
        storageService.markTourComplete(userId);
        setIsVisible(false);
        if (onComplete) onComplete();
    };

    const getTargetElement = () => {
        const step = tourSteps[currentStep];
        if (!step.target) return null;
        return document.querySelector(step.target);
    };

    const getTooltipPosition = () => {
        const targetElement = getTargetElement();
        if (!targetElement) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

        const rect = targetElement.getBoundingClientRect();
        const step = tourSteps[currentStep];

        switch (step.position) {
            case 'bottom':
                return {
                    top: `${rect.bottom + 20}px`,
                    left: `${rect.left + rect.width / 2}px`,
                    transform: 'translateX(-50%)'
                };
            case 'top':
                return {
                    top: `${rect.top - 20}px`,
                    left: `${rect.left + rect.width / 2}px`,
                    transform: 'translate(-50%, -100%)'
                };
            case 'left':
                return {
                    top: `${rect.top + rect.height / 2}px`,
                    left: `${rect.left - 20}px`,
                    transform: 'translate(-100%, -50%)'
                };
            case 'right':
                return {
                    top: `${rect.top + rect.height / 2}px`,
                    left: `${rect.right + 20}px`,
                    transform: 'translateY(-50%)'
                };
            default:
                return {
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                };
        }
    };

    const getSpotlightStyle = () => {
        const targetElement = getTargetElement();
        if (!targetElement) return null;

        const rect = targetElement.getBoundingClientRect();
        return {
            top: `${rect.top - 8}px`,
            left: `${rect.left - 8}px`,
            width: `${rect.width + 16}px`,
            height: `${rect.height + 16}px`
        };
    };

    if (!isVisible) return null;

    const step = tourSteps[currentStep];
    const tooltipPosition = getTooltipPosition();
    const spotlightStyle = getSpotlightStyle();
    const isCentered = !step.target;

    return (
        <div className="fixed inset-0 z-[9999]">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

            {/* Spotlight */}
            {spotlightStyle && (
                <div
                    className="absolute rounded-lg ring-4 ring-white/50 transition-all duration-300 pointer-events-none"
                    style={spotlightStyle}
                />
            )}

            {/* Tooltip */}
            <div
                className={`absolute ${isCentered ? 'max-w-md' : 'max-w-sm'} w-full px-4 transition-all duration-300`}
                style={tooltipPosition}
            >
                <div className="bg-white rounded-2xl shadow-2xl p-6 relative">
                    {/* Close button */}
                    <button
                        onClick={handleSkip}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Content */}
                    <div className="pr-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {step.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {step.description}
                        </p>
                    </div>

                    {/* Progress dots */}
                    <div className="flex items-center gap-1.5 mt-6 mb-4">
                        {tourSteps.map((_, index) => (
                            <div
                                key={index}
                                className={`h-1.5 rounded-full transition-all ${index === currentStep
                                        ? 'w-8 bg-blue-600'
                                        : index < currentStep
                                            ? 'w-1.5 bg-blue-400'
                                            : 'w-1.5 bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between gap-3">
                        <div className="text-sm text-gray-500">
                            {currentStep + 1} of {tourSteps.length}
                        </div>

                        <div className="flex items-center gap-2">
                            {currentStep > 0 && (
                                <button
                                    onClick={handlePrevious}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-1"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </button>
                            )}

                            {currentStep < tourSteps.length - 1 ? (
                                <button
                                    onClick={handleNext}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-1"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleComplete}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-1"
                                >
                                    <Check className="w-4 h-4" />
                                    Get Started
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Skip button */}
                    {currentStep < tourSteps.length - 1 && (
                        <button
                            onClick={handleSkip}
                            className="mt-3 w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Skip tour
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserTour;
