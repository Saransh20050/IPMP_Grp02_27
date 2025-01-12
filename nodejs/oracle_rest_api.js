const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json()); 

async function transferAmount(name, city) {
    const url = 'https://jsonmock.hackerrank.com/api/transactions';
    let credit_max = 0;
    let debit_max = 0;
    let page = 1;

    while (true) {
        console.log(`Fetching data from page: ${page}`);
        
        const response = await axios.get(`${url}?page=${page}`);
        const data = response.data;

        console.log(`Data from page ${page}:`, data.data);

        for (const transaction of data.data) {
            console.log(`Processing Transaction: ID=${transaction.id}`);
            console.log(`Transaction Name: ${transaction.userName}, City: ${transaction.location.city}`);

        
            const isNameMatch = transaction.userName === name;
            const isCityMatch = transaction.location.city === city;

            console.log(`Match Found: Name=${isNameMatch}, City=${isCityMatch}`);

            if (isNameMatch && isCityMatch) {
                let amount = parseFloat(transaction.amount.replace('$', '').replace(',', ''));
                if (transaction.txnType === 'credit') {
                    credit_max = Math.max(credit_max, amount);
                    console.log(`Updated Credit Max: ${credit_max}`);
                } else if (transaction.txnType === 'debit') {
                    debit_max = Math.max(debit_max, amount);
                    console.log(`Updated Debit Max: ${debit_max}`);
                }
            }
        }
        if (page >= data.total_pages) {
            console.log('Reached the last page.');
            break;
        }

        page++;
    }

    console.log(`Final Credit Max: ${credit_max}, Final Debit Max: ${debit_max}`);
    return [`$${credit_max.toFixed(2)}`, `$${debit_max.toFixed(2)}`];
}

app.post('/transferAmount', async (req, res) => {
    const { name, city } = req.body;
    console.log(`Received Request: Name=${name}, City=${city}`);

    try {
        const result = await transferAmount(name, city);
        console.log(`Response Sent: ${JSON.stringify(result)}`);
        res.json(result); 
    } catch (error) {
        console.error('Error Occurred:', error.message);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
