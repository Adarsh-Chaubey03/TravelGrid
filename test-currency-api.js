// Test script for Currency API endpoints
// Run this after starting the server to test the API

const testCurrencyAPI = async () => {
    const baseURL = 'http://localhost:5000/api/currency';

    console.log('🧪 Testing Currency API Endpoints...\n');

    try {
        // Test 1: Get supported currencies
        console.log('1️⃣ Testing GET /currencies...');
        const currenciesResponse = await fetch(`${baseURL}/currencies`);
        console.log('Status:', currenciesResponse.status);
        if (currenciesResponse.ok) {
            const currenciesData = await currenciesResponse.json();
            console.log('✅ Currencies endpoint working');
            console.log('Response:', currenciesData);
        } else {
            console.log('❌ Currencies endpoint failed');
        }
        console.log('');

        // Test 2: Get exchange rates (this will fail without API key, which is expected)
        console.log('2️⃣ Testing GET /rates/USD...');
        const ratesResponse = await fetch(`${baseURL}/rates/USD`);
        console.log('Status:', ratesResponse.status);
        if (ratesResponse.ok) {
            const ratesData = await ratesResponse.json();
            console.log('✅ Rates endpoint working');
            console.log('Response:', ratesData);
        } else {
            const errorData = await ratesResponse.json();
            console.log('⚠️ Rates endpoint response (expected without API key):');
            console.log('Response:', errorData);
        }
        console.log('');

        // Test 3: Get historical rates
        console.log('3️⃣ Testing GET /historical/USD/EUR/2024-01-15...');
        const historicalResponse = await fetch(`${baseURL}/historical/USD/EUR/2024-01-15`);
        console.log('Status:', historicalResponse.status);
        if (historicalResponse.ok) {
            const historicalData = await historicalResponse.json();
            console.log('✅ Historical endpoint working');
            console.log('Response:', historicalData);
        } else {
            const errorData = await historicalResponse.json();
            console.log('⚠️ Historical endpoint response (expected without API key):');
            console.log('Response:', errorData);
        }

    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
    }

    console.log('\n🎯 Test Summary:');
    console.log('- If you see "API key not configured" messages, that means the endpoints are working but need the EXCHANGE_API key');
    console.log('- If you see connection errors, make sure the server is running on port 5000');
    console.log('- To get real data, add EXCHANGE_API=your_key_here to Server/.env file');
};

// Run the test
testCurrencyAPI();
