import axios from "axios";

export const API_TOKEN = import.meta.env.VITE_API_TOKEN

const headers = {
    'Authorization': API_TOKEN
}

export const fetchMovieDb = async (params, url) => {
    try{
        const response = await axios.get(url, {params, headers});
        return response.data
    }catch (error){
        console.error('Error fetching data:', error)
    }
}

export const fetchRaw = async (fullUrl) => {
    try {
        const response = await axios.get(fullUrl, {headers, params: { language: 'en-US' }});
        return response.data;
    } catch (error) {
        console.error('Error fetching raw data:', error);
    }
};


export default {
    fetchMovieDb,
    fetchRaw
}
