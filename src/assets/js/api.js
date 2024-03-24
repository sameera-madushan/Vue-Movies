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

export default {
    fetchMovieDb,
}
