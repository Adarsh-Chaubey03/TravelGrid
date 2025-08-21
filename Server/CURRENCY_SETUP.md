# Currency Converter Setup Guide

## Environment Variables

Create a `.env` file in the Server directory with the following variable:

```env
EXCHANGE_API=your_exchange_rate_api_key_here
```

## Getting Your Exchange Rate API Key

1. Go to [ExchangeRate-API](https://www.exchangerate-api.com/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your `.env` file

## Features

- Real-time exchange rates for 170+ currencies
- Historical exchange rate data
- Automatic rate updates every 5 minutes
- Offline mode with cached rates

## API Endpoints

- `GET /api/currency/rates/:baseCurrency` - Get current rates for a base currency
- `GET /api/currency/historical/:baseCurrency/:targetCurrency/:date` - Get historical rates
- `GET /api/currency/currencies` - Get list of supported currencies

## Usage

The currency converter will automatically use real-time rates when the API key is configured, and fall back to offline cached rates when the API is unavailable.
