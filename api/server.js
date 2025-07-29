const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3002;

// CORS 설정
app.use(cors());

// iTunes API 검색 엔드포인트 (프록시용)
app.get('/search.js', async (req, res) => {
    const { term, country = 'KR', entity = 'software' } = req.query;
    
    console.log(`서버에서 받은 검색어: ${term}`);
    
    if (!term) {
        return res.status(400).json({ error: '검색어가 필요합니다.' });
    }

    try {
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=${entity}&country=${country}&lang=ko_kr`;
        console.log(`iTunes API 호출 URL: ${url}`);
        
        const response = await fetch(url, { 
            headers: { 
                'User-Agent': 'React-App/1.0',
                'Accept': 'application/json'
            } 
        });
        
        if (!response.ok) {
            throw new Error(`iTunes API 응답 오류: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`iTunes API 응답 결과 수: ${data.resultCount || 0}`);
        console.log(`iTunes API 응답 데이터:`, data);
        
        res.json(data);
    } catch (error) {
        console.error('API 호출 오류:', error);
        res.status(500).json({ error: 'Failed to fetch data from iTunes API', details: error.message });
    }
});

// iTunes API 검색 엔드포인트 (원래 경로)
app.get('/api/search.js', async (req, res) => {
    const { term, country = 'KR', entity = 'software' } = req.query;
    
    console.log(`서버에서 받은 검색어: ${term}`);
    
    if (!term) {
        return res.status(400).json({ error: '검색어가 필요합니다.' });
    }

    try {
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=${entity}&country=${country}&lang=ko_kr`;
        console.log(`iTunes API 호출 URL: ${url}`);
        
        const response = await fetch(url, { 
            headers: { 
                'User-Agent': 'React-App/1.0',
                'Accept': 'application/json'
            } 
        });
        
        if (!response.ok) {
            throw new Error(`iTunes API 응답 오류: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`iTunes API 응답 결과 수: ${data.resultCount || 0}`);
        console.log(`iTunes API 응답 데이터:`, data);
        
        res.json(data);
    } catch (error) {
        console.error('API 호출 오류:', error);
        res.status(500).json({ error: 'Failed to fetch data from iTunes API', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`API 서버가 http://localhost:${PORT}에서 실행 중입니다.`);
}); 