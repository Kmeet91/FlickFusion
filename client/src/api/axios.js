import axios from 'axios';

// Base instance for TMDb API
const instance = axios.create({
    baseURL: "https://api.themoviedb.org/3",
});

export default instance;