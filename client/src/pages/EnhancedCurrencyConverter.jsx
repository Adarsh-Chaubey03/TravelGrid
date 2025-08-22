import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-hot-toast';
import { currencyService } from '../services/currencyService';
import { useTheme } from '../context/ThemeContext';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Calculator,
    History,
    PieChart,
    Download,
    AlertTriangle,
    CreditCard,
    MapPin,
    Clock,
    RefreshCw
} from 'lucide-react';

const EnhancedCurrencyConverter = () => {
    const { isDarkMode } = useTheme();
    
    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [convertedAmount, setConvertedAmount] = useState(null);
    const [conversionRate, setConversionRate] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOffline, setIsOffline] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [historicalData, setHistoricalData] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [newExpense, setNewExpense] = useState({ amount: '', currency: 'USD', description: '', category: 'food' });
    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [favoritePairs, setFavoritePairs] = useState([]);
    const [showHistorical, setShowHistorical] = useState(false);
    const [nextUpdateCountdown, setNextUpdateCountdown] = useState(600); // 10 minutes in seconds

    // Fallback exchange rates (offline mode)
    const FALLBACK_RATES = {
        USD: 1.00, EUR: 0.85, GBP: 0.73, JPY: 110.50, CAD: 1.25, AUD: 1.35,
        CHF: 0.92, CNY: 6.45, INR: 74.50, BRL: 5.20, MXN: 20.50, SGD: 1.35,
        HKD: 7.78, KRW: 1180.00, SEK: 8.65, NOK: 8.85, DKK: 6.30, PLN: 3.85,
        CZK: 21.50, HUF: 300.00, RUB: 75.00, TRY: 8.50, ZAR: 14.50, THB: 33.50,
        MYR: 4.15, IDR: 14200.00, PHP: 50.50, VND: 23000.00, NZD: 1.45, ILS: 3.25
    };

    // Currency information
    const CURRENCY_INFO = {
        USD: { name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
        EUR: { name: 'Euro', symbol: '€', flag: '🇪🇺' },
        GBP: { name: 'British Pound', symbol: '£', flag: '🇬🇧' },
        JPY: { name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
        CAD: { name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
        AUD: { name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
        CHF: { name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
        CNY: { name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
        INR: { name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
        BRL: { name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
        MXN: { name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
        SGD: { name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
        HKD: { name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
        KRW: { name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
        SEK: { name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
        NOK: { name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
        DKK: { name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
        PLN: { name: 'Polish Złoty', symbol: 'zł', flag: '🇵🇱' },
        CZK: { name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿' },
        HUF: { name: 'Hungarian Forint', symbol: 'Ft', flag: '🇭🇺' },
        RUB: { name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
        TRY: { name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
        ZAR: { name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
        THB: { name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
        MYR: { name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
        IDR: { name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
        PHP: { name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭' },
        VND: { name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳' },
        NZD: { name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
        ILS: { name: 'Israeli Shekel', symbol: '₪', flag: '🇮🇱' }
    };

    // Expense categories
    const EXPENSE_CATEGORIES = [
        { value: 'food', label: 'Food & Dining', icon: '🍽️' },
        { value: 'transport', label: 'Transportation', icon: '🚗' },
        { value: 'accommodation', label: 'Accommodation', icon: '🏨' },
        { value: 'entertainment', label: 'Entertainment', icon: '🎭' },
        { value: 'shopping', label: 'Shopping', icon: '🛍️' },
        { value: 'health', label: 'Healthcare', icon: '🏥' },
        { value: 'other', label: 'Other', icon: '💼' }
    ];

    // Fetch real-time exchange rates
    const fetchExchangeRates = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await currencyService.getExchangeRates(fromCurrency);
            if (data.success) {
                const rate = data.rates[toCurrency];
                setConversionRate(rate);
                setConvertedAmount(amount * rate);
                setLastUpdated(data.lastUpdated);
                setNextUpdateCountdown(600); // Reset countdown to 10 minutes
                setIsOffline(false);
                toast.success('Real-time rates updated!');
            }
        } catch (error) {
            console.error('API Error:', error);
            setIsOffline(true);
            // Fallback to offline rates
            const rate = FALLBACK_RATES[toCurrency] / FALLBACK_RATES[fromCurrency];
            setConversionRate(rate);
            setConvertedAmount(amount * rate);
            toast.error('Using offline rates - API unavailable');
        } finally {
            setIsLoading(false);
        }
    }, [fromCurrency, toCurrency, amount]);

    // Fetch historical data
    const fetchHistoricalData = useCallback(async () => {
        try {
            const historicalRates = await currencyService.getHistoricalDataForChart(fromCurrency, toCurrency, 7);
            setHistoricalData(historicalRates);
        } catch (error) {
            console.error('Historical data error:', error);
        }
    }, [fromCurrency, toCurrency]);

    // Load expenses from localStorage
    useEffect(() => {
        const savedExpenses = localStorage.getItem('travelExpenses');
        if (savedExpenses) {
            setExpenses(JSON.parse(savedExpenses));
        }

        const savedFavorites = localStorage.getItem('favoriteCurrencyPairs');
        if (savedFavorites) {
            setFavoritePairs(JSON.parse(savedFavorites));
        }
    }, []);

    // Save expenses to localStorage
    useEffect(() => {
        localStorage.setItem('travelExpenses', JSON.stringify(expenses));
    }, [expenses]);

    // Save favorite pairs to localStorage
    useEffect(() => {
        localStorage.setItem('favoriteCurrencyPairs', JSON.stringify(favoritePairs));
    }, [favoritePairs]);

    // Auto-update rates every 10 minutes
    useEffect(() => {
        fetchExchangeRates();
        const interval = setInterval(fetchExchangeRates, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchExchangeRates]);

    // Countdown timer for next update
    useEffect(() => {
        if (lastUpdated) {
            const countdownInterval = setInterval(() => {
                setNextUpdateCountdown(prev => {
                    if (prev <= 1) {
                        setNextUpdateCountdown(600); // Reset to 10 minutes
                        return 600;
                    }
                    // Show notification when 1 minute remaining
                    if (prev === 60) {
                        toast.info('Exchange rates will update in 1 minute!', { duration: 3000 });
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(countdownInterval);
        }
    }, [lastUpdated]);

    // Fetch historical data when currencies change
    useEffect(() => {
        if (showHistorical) {
            fetchHistoricalData();
        }
    }, [showHistorical, fetchHistoricalData]);

    // Add expense
    const addExpense = () => {
        if (!newExpense.amount || !newExpense.description) {
            toast.error('Please fill in all fields');
            return;
        }

        const expense = {
            id: Date.now(),
            ...newExpense,
            amount: parseFloat(newExpense.amount),
            date: new Date().toISOString(),
            convertedAmount: parseFloat(newExpense.amount) * (conversionRate || 1)
        };

        setExpenses([...expenses, expense]);
        setNewExpense({ amount: '', currency: 'USD', description: '', category: 'food' });
        setShowExpenseForm(false);
        toast.success('Expense added successfully!');
    };

    // Remove expense
    const removeExpense = (id) => {
        setExpenses(expenses.filter(exp => exp.id !== id));
        toast.success('Expense removed!');
    };

    // Toggle favorite pair
    const toggleFavorite = () => {
        const pair = `${fromCurrency}-${toCurrency}`;
        if (favoritePairs.includes(pair)) {
            setFavoritePairs(favoritePairs.filter(p => p !== pair));
            toast.success('Removed from favorites');
        } else {
            setFavoritePairs([...favoritePairs, pair]);
            toast.success('Added to favorites');
        }
    };

    // Export expenses
    const exportExpenses = () => {
        const csvContent = [
            ['Date', 'Amount', 'Currency', 'Description', 'Category', 'Converted Amount (USD)'],
            ...expenses.map(exp => [
                new Date(exp.date).toLocaleDateString(),
                exp.amount,
                exp.currency,
                exp.description,
                exp.category,
                exp.convertedAmount.toFixed(2)
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'travel-expenses.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Expenses exported!');
    };

    // Format currency
    const formatCurrency = (amount, currency) => {
        const noDecimalCurrencies = ['JPY', 'KRW', 'IDR', 'VND', 'HUF'];
        if (noDecimalCurrencies.includes(currency)) {
            return Math.round(amount).toLocaleString();
        }
        return amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Get total expenses in USD
    const totalExpensesUSD = expenses.reduce((sum, exp) => sum + exp.convertedAmount, 0);

    // Get category breakdown
    const categoryBreakdown = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.convertedAmount;
        return acc;
    }, {});

    return (
        <div className={`min-h-screen p-4 pt-24 font-inter transition-all duration-300`}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className={`text-4xl font-extrabold mb-2 flex items-center justify-center gap-3 transition-all duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                        <DollarSign className="text-green-500" />
                        Enhanced Travel Wallet
                    </h1>
                    <p className={`text-lg transition-all duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>Real-time currency conversion, expense tracking, and smart travel insights</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Converter */}
                    <div className="lg:col-span-2">
                        <div className={`rounded-2xl shadow-xl p-6 mb-6 transition-all duration-300 ${
                            isDarkMode
                                ? 'bg-white/10 border border-white/20'
                                : 'bg-white'
                        }`}>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className={`text-2xl font-bold transition-all duration-300 ${
                                    isDarkMode ? 'text-white' : 'text-gray-800'
                                }`}>Currency Converter</h2>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={fetchExchangeRates}
                                        disabled={isLoading}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                                    >
                                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                                        {isLoading ? 'Updating...' : 'Update Rates'}
                                    </button>
                                    <button
                                        onClick={toggleFavorite}
                                        className={`p-2 rounded-lg transition-colors ${favoritePairs.includes(`${fromCurrency}-${toCurrency}`)
                                            ? 'bg-red-100 text-red-600'
                                            : isDarkMode 
                                                ? 'bg-white/20 text-white hover:bg-white/30' 
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        ❤️
                                    </button>
                                </div>
                            </div>

                            {/* Status Indicator */}
                            <div className={`flex items-center justify-between mb-6 p-3 rounded-lg transition-all duration-300 ${
                                isDarkMode
                                    ? 'bg-white/10 border border-white/20'
                                    : 'bg-gray-50'
                            }`}>
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${isOffline ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                                    <span className={`text-sm font-medium transition-all duration-300 ${
                                        isDarkMode ? 'text-white' : 'text-gray-800'
                                    }`}>
                                        {isOffline ? 'Offline Mode' : 'Real-time Rates (Updates every 10 min)'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {lastUpdated && (
                                        <div className={`text-xs space-y-1 transition-all duration-300 ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                        }`}>
                                            <div>Last updated: {new Date(lastUpdated).toLocaleTimeString()}</div>
                                            <div className={`flex items-center gap-1 ${nextUpdateCountdown <= 60 ? 'text-orange-600 font-semibold' : ''}`}>
                                                <Clock className="w-3 h-3" />
                                                Next update in: {Math.floor(nextUpdateCountdown / 60)}:{(nextUpdateCountdown % 60).toString().padStart(2, '0')}
                                            </div>
                                        </div>
                                    )}
                                    <button
                                        onClick={fetchExchangeRates}
                                        disabled={isLoading}
                                        className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        title="Refresh rates manually"
                                    >
                                        <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                                        Refresh
                                    </button>
                                </div>
                            </div>

                            {/* Converter Form */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div>
                                    <label className={`block text-sm font-semibold mb-2 transition-all duration-300 ${
                                        isDarkMode ? 'text-white' : 'text-gray-700'
                                    }`}>Amount</label>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(Number(e.target.value))}
                                        min="0"
                                        step="0.01"
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200 text-lg ${
                                            isDarkMode
                                                ? 'bg-white/20 border-white/20 text-white placeholder-gray-300 focus:border-white/40'
                                                : 'border-gray-300 bg-white'
                                        }`}
                                        placeholder="Enter amount"
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-semibold mb-2 transition-all duration-300 ${
                                        isDarkMode ? 'text-white' : 'text-gray-700'
                                    }`}>From</label>
                                    <select
                                        value={fromCurrency}
                                        onChange={(e) => setFromCurrency(e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none appearance-none pr-8 text-lg transition-all duration-300 ${
                                            isDarkMode
                                                ? 'bg-white/20 border-white/20 text-white focus:border-white/40'
                                                : 'border-gray-300 bg-white'
                                        }`}
                                    >
                                        {Object.keys(CURRENCY_INFO).sort().map((code) => (
                                            <option key={code} value={code} className={isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}>
                                                {CURRENCY_INFO[code].flag} {code} - {CURRENCY_INFO[code].name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className={`block text-sm font-semibold mb-2 transition-all duration-300 ${
                                        isDarkMode ? 'text-white' : 'text-gray-700'
                                    }`}>To</label>
                                    <select
                                        value={toCurrency}
                                        onChange={(e) => setToCurrency(e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none appearance-none pr-8 text-lg transition-all duration-300 ${
                                            isDarkMode
                                                ? 'bg-white/20 border-white/20 text-white focus:border-white/40'
                                                : 'border-gray-300 bg-white'
                                        }`}
                                    >
                                        {Object.keys(CURRENCY_INFO).sort().map((code) => (
                                            <option key={code} value={code} className={isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}>
                                                {CURRENCY_INFO[code].flag} {code} - {CURRENCY_INFO[code].name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Conversion Result */}
                            {convertedAmount !== null && (
                                <div className={`text-center p-6 rounded-xl border transition-all duration-300 ${
                                    isDarkMode
                                        ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-blue-700/50'
                                        : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100'
                                }`}>
                                    <div className="text-4xl font-bold text-blue-700 mb-3">
                                        {formatCurrency(amount, fromCurrency)} {fromCurrency} = {formatCurrency(convertedAmount, toCurrency)} {toCurrency}
                                    </div>
                                    {conversionRate && (
                                        <div className="text-xl text-indigo-600 mb-2">
                                            1 {fromCurrency} = {conversionRate.toFixed(4)} {toCurrency}
                                        </div>
                                    )}
                                    <div className={`text-sm transition-all duration-300 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                    }`}>
                                        {isOffline ? 'Using offline rates' : 'Real-time exchange rate'}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Historical Chart */}
                        <div className={`rounded-2xl shadow-xl p-6 mb-6 transition-all duration-300 ${
                            isDarkMode
                                ? 'bg-white/10 border border-white/20'
                                : 'bg-white'
                        }`}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className={`text-xl font-bold flex items-center gap-2 transition-all duration-300 ${
                                    isDarkMode ? 'text-white' : 'text-gray-800'
                                }`}>
                                    <History className="text-purple-500" />
                                    Historical Trends
                                </h3>
                                <button
                                    onClick={() => setShowHistorical(!showHistorical)}
                                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                                >
                                    {showHistorical ? 'Hide Chart' : 'Show Chart'}
                                </button>
                            </div>

                            {showHistorical && historicalData.length > 0 && (
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={historicalData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#475569' : '#e2e8f0'} />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fill: isDarkMode ? '#cbd5e1' : '#475569' }}
                                        />
                                        <YAxis
                                            tick={{ fill: isDarkMode ? '#cbd5e1' : '#475569' }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                                                border: isDarkMode ? '1px solid #475569' : '1px solid #e2e8f0',
                                                color: isDarkMode ? '#f8fafc' : '#1e293b'
                                            }}
                                        />
                                        <Line type="monotone" dataKey="rate" stroke="#6366f1" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}

                            {showHistorical && historicalData.length === 0 && (
                                <div className={`text-center py-8 transition-all duration-300 ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                }`}>
                                    <History className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                    <p>Historical data not available</p>
                                </div>
                            )}
                        </div>

                        {/* Smart Recommendations */}
                        <div className={`rounded-2xl shadow-xl p-6 transition-all duration-300 ${
                            isDarkMode
                                ? 'bg-white/10 border border-white/20'
                                : 'bg-white'
                        }`}>
                            <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 transition-all duration-300 ${
                                isDarkMode ? 'text-white' : 'text-gray-800'
                            }`}>
                                <AlertTriangle className="text-orange-500" />
                                Travel Tips & Recommendations
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-lg border transition-all duration-300 ${
                                    isDarkMode
                                        ? 'bg-orange-900/20 border-orange-700/50'
                                        : 'bg-orange-50 border-orange-200'
                                }`}>
                                    <h4 className={`font-semibold mb-2 flex items-center gap-2 transition-all duration-300 ${
                                        isDarkMode ? 'text-orange-200' : 'text-orange-800'
                                    }`}>
                                        <CreditCard className="w-4 h-4" />
                                        Payment Methods
                                    </h4>
                                    <p className={`text-sm transition-all duration-300 ${
                                        isDarkMode ? 'text-orange-100' : 'text-orange-700'
                                    }`}>
                                        Use credit cards with no foreign transaction fees. Consider local ATMs for better rates than exchange offices.
                                    </p>
                                </div>

                                <div className={`p-4 rounded-lg border transition-all duration-300 ${
                                    isDarkMode
                                        ? 'bg-blue-900/20 border-blue-700/50'
                                        : 'bg-blue-50 border-blue-200'
                                }`}>
                                    <h4 className={`font-semibold mb-2 flex items-center gap-2 transition-all duration-300 ${
                                        isDarkMode ? 'text-blue-200' : 'text-blue-800'
                                    }`}>
                                        <MapPin className="w-4 h-4" />
                                        Exchange Tips
                                    </h4>
                                    <p className={`text-sm transition-all duration-300 ${
                                        isDarkMode ? 'text-blue-100' : 'text-blue-700'
                                    }`}>
                                        Avoid airport exchanges - they typically have the worst rates. Use local banks or ATMs for better deals.
                                    </p>
                                </div>

                                <div className={`p-4 rounded-lg border transition-all duration-300 ${
                                    isDarkMode
                                        ? 'bg-green-900/20 border-green-700/50'
                                        : 'bg-green-50 border-green-200'
                                }`}>
                                    <h4 className={`font-semibold mb-2 flex items-center gap-2 transition-all duration-300 ${
                                        isDarkMode ? 'text-green-200' : 'text-green-800'
                                    }`}>
                                        <Clock className="w-4 h-4" />
                                        Best Time to Exchange
                                    </h4>
                                    <p className={`text-sm transition-all duration-300 ${
                                        isDarkMode ? 'text-green-100' : 'text-green-700'
                                    }`}>
                                        Exchange rates fluctuate throughout the day. Monitor trends and exchange when rates are favorable.
                                    </p>
                                </div>

                                <div className={`p-4 rounded-lg border transition-all duration-300 ${
                                    isDarkMode
                                        ? 'bg-purple-900/20 border-purple-700/50'
                                        : 'bg-purple-50 border-purple-200'
                                }`}>
                                    <h4 className={`font-semibold mb-2 flex items-center gap-2 transition-all duration-300 ${
                                        isDarkMode ? 'text-purple-200' : 'text-purple-800'
                                    }`}>
                                        <Calculator className="w-4 h-4" />
                                        Fee Calculator
                                    </h4>
                                    <p className={`text-sm transition-all duration-300 ${
                                        isDarkMode ? 'text-purple-100' : 'text-purple-700'
                                    }`}>
                                        Credit cards typically charge 1-3% foreign transaction fees. Factor this into your budget planning.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Expense Tracker */}
                        <div className={`rounded-2xl shadow-xl p-6 transition-all duration-300 ${
                            isDarkMode 
                                ? 'bg-white/10 border border-white/20' 
                                : 'bg-white'
                        }`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={`text-xl font-bold flex items-center gap-2 transition-all duration-300 ${
                                    isDarkMode ? 'text-white' : 'text-gray-800'
                                }`}>
                                    <PieChart className="text-green-500" />
                                    Expense Tracker
                                </h3>
                                <button
                                    onClick={() => setShowExpenseForm(!showExpenseForm)}
                                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                                >
                                    {showExpenseForm ? 'Cancel' : 'Add'}
                                </button>
                            </div>

                            {/* Add Expense Form */}
                            {showExpenseForm && (
                                <div className={`mb-4 p-4 rounded-lg transition-all duration-300 ${
                                    isDarkMode 
                                        ? 'bg-white/10 border border-white/20' 
                                        : 'bg-gray-50'
                                }`}>
                                    <input
                                        type="number"
                                        placeholder="Amount"
                                        value={newExpense.amount}
                                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                        className={`w-full mb-2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all duration-300 ${
                                            isDarkMode 
                                                ? 'bg-white/20 border-white/20 text-white placeholder-gray-300 focus:border-white/40' 
                                                : 'border-gray-300'
                                        }`}
                                    />
                                    <select
                                        value={newExpense.currency}
                                        onChange={(e) => setNewExpense({ ...newExpense, currency: e.target.value })}
                                        className={`w-full mb-2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all duration-300 ${
                                            isDarkMode 
                                                ? 'bg-white/20 border-white/20 text-white focus:border-white/40' 
                                                : 'border-gray-300'
                                        }`}
                                    >
                                        {Object.keys(CURRENCY_INFO).map(code => (
                                            <option key={code} value={code} className={isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}>{code}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Description"
                                        value={newExpense.description}
                                        onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                        className={`w-full mb-2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all duration-300 ${
                                            isDarkMode 
                                                ? 'bg-white/20 border-white/20 text-white placeholder-gray-300 focus:border-white/40' 
                                                : 'border-gray-300'
                                        }`}
                                    />
                                    <select
                                        value={newExpense.category}
                                        onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                                        className={`w-full mb-2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all duration-300 ${
                                            isDarkMode 
                                                ? 'bg-white/20 border-white/20 text-white focus:border-white/40' 
                                                : 'border-gray-300'
                                        }`}
                                    >
                                        {EXPENSE_CATEGORIES.map(cat => (
                                            <option key={cat.value} value={cat.value} className={isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}>
                                                {cat.icon} {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={addExpense}
                                        className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        Add Expense
                                    </button>
                                </div>
                            )}

                            {/* Total Expenses */}
                            <div className={`mb-4 p-3 rounded-lg transition-all duration-300 ${
                                isDarkMode 
                                    ? 'bg-blue-900/20 border border-blue-700/50' 
                                    : 'bg-blue-50'
                            }`}>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-700">${totalExpensesUSD.toFixed(2)}</div>
                                    <div className="text-sm text-blue-600">Total Expenses (USD)</div>
                                </div>
                            </div>

                            {/* Export Button */}
                            {expenses.length > 0 && (
                                <button
                                    onClick={exportExpenses}
                                    className="w-full mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Export CSV
                                </button>
                            )}

                            {/* Expenses List */}
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {expenses.map(expense => (
                                    <div key={expense.id} className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                                        isDarkMode 
                                            ? 'bg-white/10 border border-white/20' 
                                            : 'bg-gray-50'
                                    }`}>
                                        <div className="flex-1">
                                            <div className={`font-medium transition-all duration-300 ${
                                                isDarkMode ? 'text-white' : 'text-gray-800'
                                            }`}>{expense.description}</div>
                                            <div className={`text-sm transition-all duration-300 ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                            }`}>
                                                {expense.amount} {expense.currency} • {EXPENSE_CATEGORIES.find(c => c.value === expense.category)?.icon}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeExpense(expense.id)}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                {expenses.length === 0 && (
                                    <div className={`text-center py-4 transition-all duration-300 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                    }`}>
                                        <PieChart className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                        <p className="text-sm">No expenses yet</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Favorite Pairs */}
                        {favoritePairs.length > 0 && (
                            <div className={`rounded-2xl shadow-xl p-6 transition-all duration-300 ${
                                isDarkMode 
                                    ? 'bg-white/10 border border-white/20' 
                                    : 'bg-white'
                            }`}>
                                <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 transition-all duration-300 ${
                                    isDarkMode ? 'text-white' : 'text-gray-800'
                                }`}>
                                    ❤️ Favorite Pairs
                                </h3>
                                <div className="space-y-2">
                                    {favoritePairs.map(pair => {
                                        const [from, to] = pair.split('-');
                                        return (
                                            <div key={pair} className={`p-3 rounded-lg border transition-all duration-300 ${
                                                isDarkMode 
                                                    ? 'bg-pink-900/20 border-pink-700/50' 
                                                    : 'bg-pink-50 border-pink-200'
                                            }`}>
                                                <div className={`font-medium transition-all duration-300 ${
                                                    isDarkMode ? 'text-pink-200' : 'text-pink-800'
                                                }`}>
                                                    {CURRENCY_INFO[from]?.flag} {from} → {CURRENCY_INFO[to]?.flag} {to}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Currency Strength */}
                        <div className={`rounded-2xl shadow-xl p-6 transition-all duration-300 ${
                            isDarkMode 
                                ? 'bg-white/10 border border-white/20' 
                                : 'bg-white'
                        }`}>
                            <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 transition-all duration-300 ${
                                isDarkMode ? 'text-white' : 'text-gray-800'
                            }`}>
                                <TrendingUp className="text-green-500" />
                                Currency Strength
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm transition-all duration-300 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>USD</span>
                                    <div className="flex items-center gap-1">
                                        <TrendingUp className="w-4 h-4 text-green-500" />
                                        <span className="text-sm font-medium text-green-600">Strong</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm transition-all duration-300 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-800'
                                    }`}>EUR</span>
                                    <div className="flex items-center gap-1">
                                        <TrendingDown className="w-4 h-4 text-red-500" />
                                        <span className="text-sm font-medium text-red-600">Weak</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm transition-all duration-300 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-800'
                                    }`}>JPY</span>
                                    <div className="flex items-center gap-1">
                                        <TrendingDown className="w-4 h-4 text-red-500" />
                                        <span className="text-sm font-medium text-red-600">Weak</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedCurrencyConverter;