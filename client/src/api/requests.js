// Replace with your own TMDb API key
export const API_KEY = "4f32f5841c26e46bea4923a417d9415c";

export const rowConfigurations = [
    {
        title: "What's Popular",
        categoryKey: 'popular', // A simple key for this row
        tabs: [
            {
                label: 'In Theaters',
                fetchUrl: `/movie/now_playing?api_key=${API_KEY}&language=en-US`,
                mediaType: 'movie'
            },
            {
                label: 'On TV',
                fetchUrl: `/tv/on_the_air?api_key=${API_KEY}&language=en-US`,
                mediaType: 'tv'
            },
        ]
    },
    {
        title: "Top Rated",
        categoryKey: 'toprated',
        tabs: [
            {
                label: 'Movies',
                fetchUrl: `/movie/top_rated?api_key=${API_KEY}&language=en-US`,
                mediaType: 'movie'
            },
            {
                label: 'TV Shows',
                fetchUrl: `/tv/top_rated?api_key=${API_KEY}&language=en-US`,
                mediaType: 'tv'
            }
        ]
    }
];

const requests = {
    fetchTrending: `/trending/all/week?api_key=${API_KEY}&language=en-US`,
    fetchNetflixOriginals: `/discover/tv?api_key=${API_KEY}&with_networks=213`,
    fetchTopRated: `/movie/top_rated?api_key=${API_KEY}&language=en-US`,
    fetchActionMovies: `/discover/movie?api_key=${API_KEY}&with_genres=28`,
    fetchComedyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=35`,
    fetchHorrorMovies: `/discover/movie?api_key=${API_KEY}&with_genres=27`,
    fetchRomanceMovies: `/discover/movie?api_key=${API_KEY}&with_genres=10749`,
    fetchDocumentaries: `/discover/movie?api_key=${API_KEY}&with_genres=99`,
};

export default requests;