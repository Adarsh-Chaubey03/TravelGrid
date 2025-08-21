const API_BASE_URL = '/api/currency';

export const currencyService = {
    // Get real-time exchange rates for a base currency
    async getExchangeRates(baseCurrency) {
        try {
            const response = await fetch(`${API_BASE_URL}/rates/${baseCurrency}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
            throw error;
        }
    },

    // Get historical exchange rates for a specific date
    async getHistoricalRates(baseCurrency, targetCurrency, date) {
        try {
            const response = await fetch(`${API_BASE_URL}/historical/${baseCurrency}/${targetCurrency}/${date}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching historical rates:', error);
            throw error;
        }
    },

    // Get list of supported currencies
    async getSupportedCurrencies() {
        try {
            const response = await fetch(`${API_BASE_URL}/currencies`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching supported currencies:', error);
            throw error;
        }
    },

    // Get multiple historical rates for charting
    async getHistoricalDataForChart(baseCurrency, targetCurrency, days = 7) {
        try {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            const dates = [];
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                dates.push(new Date(d).toISOString().split('T')[0]);
            }

            const historicalRates = [];
            for (const date of dates) {
                try {
                    const data = await this.getHistoricalRates(baseCurrency, targetCurrency, date);
                    if (data.success) {
                        historicalRates.push({
                            date: new Date(date).toLocaleDateString(),
                            rate: data.rate
                        });
                    }
                } catch (error) {
                    console.error(`Error fetching data for ${date}:`, error);
                }
            }

            return historicalRates;
        } catch (error) {
            console.error('Error fetching historical data for chart:', error);
            throw error;
        }
    }
};

export default currencyService;
