const fetch = require('node-fetch');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { term } = req.query;

    try {
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=software&country=KR&lang=ko_kr`;
        const response = await fetch(url, { headers: { 'User-Agent': 'React-App' } });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data from iTunes API' });
    }
}