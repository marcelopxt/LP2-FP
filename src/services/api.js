import axios from 'axios';

const API_KEY = 'c0c4d37b298f40fc83e906c279bbe0f2';
const URL_BASE = 'https://api.rawg.io/api';

async function montarRequisicao(endpoint, filters) {
    if (!endpoint) return null;
    const url = URL_BASE + endpoint;
    try {
        const response = await axios.get(url, {
            params: {
                key: API_KEY,
                ...filters,
            }
        });
        return response;
    } catch (error) {
        console.error("API Request Error:", error);
        throw error;
    }
}

async function getPopularGames({ page = 1, search = '', genre = null, ordering = null } = {}) {
    try {
        const filters = {
            page_size: 20,
            page: page,
            ordering: ordering,
        };
        if (search)
            filters.search = search;
        if (genre)
            filters.genres = genre;

        const response = await montarRequisicao('/games', filters);
        return response.data.results;
    } catch (error) {
        console.log("Error fetching games:", error);
        return [];
    }
}

export { getPopularGames };