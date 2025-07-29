import React, { useState, useEffect } from 'react';

const currencies = {
  AUD: 'Australian Dollar',
  BRL: 'Brazilian Real', CAD: 'Canadian Dollar',
  CHF: 'Swiss Franc', CNY: 'Chinese Yuan',
  CZK: 'Czech Koruna', DKK: 'Danish Krone', EUR: 'Euro',
  GBP: 'British Pound', HKD: 'Hong Kong Dollar', HUF: 'Hungarian Forint',
  IDR: 'Indonesian Rupiah', ILS: 'Israeli Shekel', INR: 'Indian Rupee',
  JPY: 'Japanese Yen', KRW: 'South Korean Won', 
  MXN: 'Mexican Peso', MYR: 'Malaysian Ringgit', NOK: 'Norwegian Krone',
  NZD: 'New Zealand Dollar', PHP: 'Philippine Peso', PLN: 'Polish Zloty',
  SEK: 'Swedish Krona',
  SGD: 'Singapore Dollar', THB: 'Thai Baht', TRY: 'Turkish Lira',
  USD: 'US Dollar', 
  ZAR: 'South African Rand'
};

const CurrencyConverter = () => { 
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('EUR'); 
  const [toCurrency, setToCurrency] = useState('USD');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(''); 

  useEffect(() => {
    const abortController = new AbortController();

    const fetchConversion = async () => {
      if (isNaN(amount) || amount <= 0) {
        setError('Please enter a valid amount.');
        setConvertedAmount(null); 
        setIsLoading(false); 
        return;
      }

      setIsLoading(true);
      setError('');
      setConvertedAmount(null); 

      try {
        const response = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`,
          { signal: abortController.signal }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.rates && data.rates[toCurrency]) {
          setConvertedAmount(data.rates[toCurrency].toFixed(2));
          setLastUpdated(new Date().toLocaleString()); 
        } else {
          setError('Conversion rate not found. Try EUR-based pairs.');
          setLastUpdated(''); 
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Conversion error:", err); 
          setError('Failed to fetch rates. Please try another pair or check your connection.');
          setLastUpdated(''); 
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversion();
    return () => abortController.abort();
  }, [amount, fromCurrency, toCurrency]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 p-4 font-inter">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-800">Currency Converter</h1>

        {/* Amount Input Group */}
        <div className="mb-6">
          <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min="0"
            step="0.01"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all duration-200 text-lg"
            placeholder="Enter amount"
          />
        </div>

        {/* From Currency Select Group */}
        <div className="mb-6">
          <label htmlFor="fromCurrency" className="block text-sm font-semibold text-gray-700 mb-2">From Currency</label>
          <select
            id="fromCurrency"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none appearance-none bg-white pr-8 text-lg"
          >
            {Object.entries(currencies).map(([code, name]) => (
              <option key={code} value={code}>
                {code} - {name}
              </option>
            ))}
          </select>
        </div>

        {/* To Currency Select Group */}
        <div className="mb-8">
          <label htmlFor="toCurrency" className="block text-sm font-semibold text-gray-700 mb-2">To Currency</label>
          <select
            id="toCurrency"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none appearance-none bg-white pr-8 text-lg"
          >
            {Object.entries(currencies).map(([code, name]) => (
              <option key={code} value={code}>
                {code} - {name}
              </option>
            ))}
          </select>
        </div>

        {/* Result Display Area */}
        <div className="text-center bg-pink-50 p-6 rounded-xl shadow-inner">
          {isLoading ? (
            <p className="text-pink-600 text-xl font-medium">Loading...</p>
          ) : (
            <>
              {error ? (
                <p className="text-red-600 text-lg font-medium">{error}</p>
              ) : (
                convertedAmount !== null && ( 
                  <>
                    <div className="text-3xl font-bold text-pink-700 mb-2">
                      {amount} {fromCurrency} = {convertedAmount} {toCurrency}
                    </div>
                    {lastUpdated && (
                      <div className="text-sm text-gray-500 italic">
                        Last updated: {lastUpdated}
                      </div>
                    )}
                  </>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
