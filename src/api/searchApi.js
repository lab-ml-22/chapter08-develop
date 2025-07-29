import axios from 'axios'

export const fetchSearchWord = async(query, country = 'KR', entity = 'software') => {
console.log(`fetchSearchWord의 query = ${query}`)

    const response = await axios.get(`/api/search.js`, {
        params: { term: query, country, entity },
    })   
console.log(`API 응답 전체:`, response.data);
console.log(`API 응답 results:`, response.data?.results);

     // results가 없으면 빈 배열 반환
     return response.data && response.data.results ? response.data.results : []

// console.log(`response는 = ${JSON.stringify(response.data.results)}`);
    // return response.data.results
}