import express from 'express'
const router = express.Router();
import axios from 'axios'

// Get real-time exchange rates
router.get('/rates/:baseCurrency', async (req, res) => {
    try {
        const { baseCurrency } = req.params;
        const apiKey = process.env.EXCHANGE_API;

        if (!apiKey) {
            return res.status(500).json({
                error: 'Exchange rate API key not configured',
                message: 'Please configure EXCHANGE_API in environment variables'
            });
        }

        const response = await axios.get(
            `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`
        );

        res.json({
            success: true,
            baseCurrency: response.data.base_code,
            rates: response.data.conversion_rates,
            lastUpdated: response.data.time_last_update_utc
        });
    } catch (error) {
        console.error('Currency API Error:', error.message);
        res.status(500).json({
            error: 'Failed to fetch exchange rates',
            message: error.message
        });
    }
});

// Get historical exchange rates
router.get('/historical/:baseCurrency/:targetCurrency/:date', async (req, res) => {
    try {
        const { baseCurrency, targetCurrency, date } = req.params;
        const apiKey = process.env.EXCHANGE_API;

        if (!apiKey) {
            return res.status(500).json({
                error: 'Exchange rate API key not configured'
            });
        }

        const response = await axios.get(
            `https://v6.exchangerate-api.com/v6/${apiKey}/history/${baseCurrency}/${date}`
        );

        const targetRate = response.data.conversion_rates[targetCurrency];

        res.json({
            success: true,
            baseCurrency,
            targetCurrency,
            date,
            rate: targetRate,
            lastUpdated: response.data.time_last_update_utc
        });
    } catch (error) {
        console.error('Historical Currency API Error:', error.message);
        res.status(500).json({
            error: 'Failed to fetch historical rates',
            message: error.message
        });
    }
});

// Get supported currencies
router.get('/currencies', async (req, res) => {
    try {
        const apiKey = process.env.EXCHANGE_API;

        if (!apiKey) {
            return res.status(500).json({
                error: 'Exchange rate API key not configured'
            });
        }

        const response = await axios.get(
            `https://v6.exchangerate-api.com/v6/${apiKey}/codes`
        );

        res.json({
            success: true,
            currencies: response.data.supported_codes,
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        console.error('Currencies API Error:', error.message);
        res.status(500).json({
            error: 'Failed to fetch supported currencies',
            message: error.message
        });
    }
});

export default router
