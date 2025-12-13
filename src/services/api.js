import axios from 'axios';

const API_KEY = 'c0c4d37b298f40fc83e906c279bbe0f2';
const URL_BASE = 'https://api.rawg.io/api';

async function montarRequisicao(endpoint, filters) {
    if (!endpoint)
        return null;

    const url = URL_BASE + endpoint;
    try {
        const response = axios.get(url, {
            params: {
                key: API_KEY,
                ...filters,
            }
        });
        console.log(response);
        return response;
    } catch (error) {
        console.error("Erro na requisição:", error);
        throw error;
    }
}

async function getPopularGames() {
    try {
        const filters = {
            ordering: '-metacritic',
        }
        const response = await montarRequisicao('/games', filters);
        console.log(response.data.results);   
        return response.data.results;
    } catch (error) {
        console.log("Deu ruim ao buscar populares:", error);
        return [];
    }
}

export { getPopularGames };
