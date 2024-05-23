const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Proxy endpoint
app.post('/proxy', async (req, res) => {
    const { url, method = 'GET', headers = {}, body } = req.body;

    try {
        const response = await fetch(url, {
            method,
            headers: {
                ...headers,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).json({ error: 'Proxy Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
