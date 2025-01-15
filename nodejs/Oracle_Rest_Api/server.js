const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Importing the CORS package

const app = express();

// Use the CORS middleware to allow cross-origin requests
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json()); 

async function transferAmount(name, city) {
    const url = 'https://jsonmock.hackerrank.com/api/transactions';
    let credit_max = 0;
    let debit_max = 0;
    let page = 1;

    while (true) {
        console.log(`Fetching data from page: ${page}`);
        
        // Fetch the current page of data
        const response = await axios.get(`${url}?page=${page}`);
        const data = response.data;

        console.log(`Data from page ${page}:`, data.data);

        // Iterate over the transaction records on this page
        for (const transaction of data.data) {
            console.log(`Processing Transaction: ID=${transaction.id}`);
            console.log(`Transaction Name: ${transaction.userName}, City: ${transaction.location.city}`);

            // Match username and city
            const isNameMatch = transaction.userName === name;
            const isCityMatch = transaction.location.city === city;

            console.log(`Match Found: Name=${isNameMatch}, City=${isCityMatch}`);

            if (isNameMatch && isCityMatch) {
                let amount = parseFloat(transaction.amount.replace('$', '').replace(',', ''));

                // Check if it's a credit or debit transaction
                if (transaction.txnType === 'credit') {
                    credit_max = Math.max(credit_max, amount);
                    console.log(`Updated Credit Max: ${credit_max}`);
                } else if (transaction.txnType === 'debit') {
                    debit_max = Math.max(debit_max, amount);
                    console.log(`Updated Debit Max: ${debit_max}`);
                }
            }
        }

        // If we've reached the last page, stop
        if (page >= data.total_pages) {
            console.log('Reached the last page.');
            break;
        }

        // Move to the next page
        page++;
    }

    console.log(`Final Credit Max: ${credit_max}, Final Debit Max: ${debit_max}`);
    // Return the result in currency format
    return [`$${credit_max.toFixed(2)}`, `$${debit_max.toFixed(2)}`];
}

// POST endpoint to handle the request
app.post('/transferAmount', async (req, res) => {
    const { name, city } = req.body;
    console.log(`Received Request: Name=${name}, City=${city}`);

    try {
        const result = await transferAmount(name, city);
        console.log(`Response Sent: ${JSON.stringify(result)}`);
        res.json(result); // Return the result as JSON
    } catch (error) {
        console.error('Error Occurred:', error.message);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
