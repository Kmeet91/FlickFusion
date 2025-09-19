import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import axios from '../api/axios';
import requests from '../api/requests';
import Navbar from '../components/Navbar';
import AddToListButton from '../components/AddToListButton';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
const CategoryPage = () => {
    const { categoryKey } = useParams();
    const [searchParams] = useSearchParams();
    const mediaType = searchParams.get('mediaType') || 'movie';

    const [movies, setMovies] = useState([]);
    const [title, setTitle] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const titleMap = {
        fetchTrending: "Trending Now",
        fetchNetflixOriginals: "Netflix Originals",
        fetchTopRated: "Top Rated",
        fetchActionMovies: "Action Movies",
        fetchComedyMovies: "Comedy Movies",
        fetchHorrorMovies: "Horror Movies",
    };

    const fetchCategoryData = useCallback(async (pageNum, isNewCategory) => {
        const fetchUrl = requests[categoryKey];
        if (!fetchUrl) return;

        setLoading(true);
        setTitle(titleMap[categoryKey] || "Category");
        try {
            const request = await axios.get(`${fetchUrl}&page=${pageNum}`);
            setMovies(prev => isNewCategory ? request.data.results : [...prev, ...request.data.results]);
            setTotalPages(request.data.total_pages);
        } catch (error) {
            console.error("Failed to fetch category data:", error);
        } finally {
            setLoading(false);
        }
    }, [categoryKey]);

    useEffect(() => {
        setPage(1);
        fetchCategoryData(1, true);
    }, [categoryKey, fetchCategoryData]);

    const handleLoadMore = () => {
        const newPage = page + 1;
        if (newPage <= totalPages) {
            setPage(newPage);
            fetchCategoryData(newPage, false);
        }
    };

    if (loading && page === 1) {
        // We will replace this in the next step
        return <Loader />;
    }
    return (
        <div className='bg-[#141414] min-h-screen text-white'>
            <Navbar />
            <div className="pt-24 px-4 md:px-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-8">{title}</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8">
                    {movies.map(movie => movie.poster_path && (
                        <div key={movie.id}>
                            <div className="group relative">
                                <Link to={`/details/${mediaType}/${movie.id}`}>
                                    <div className="aspect-[2/3] bg-neutral-800 rounded-md overflow-hidden transition-transform duration-300 transform group-hover:scale-105">
                                        <img className="w-full h-full object-cover" src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title || movie.name} />
                                    </div>
                                </Link>
                                <AddToListButton movie={{ ...movie, media_type: mediaType }} />
                            </div>
                            <p className="mt-2 text-sm text-gray-200 truncate">{movie.title || movie.name}</p>
                        </div>
                    ))}
                </div>
            </div>
            {page < totalPages && !loading && (
                <div className="text-center mt-8">
                    <button onClick={handleLoadMore} className="bg-red-600 px-6 py-2 rounded-md font-semibold hover:bg-red-700 transition">
                        Load More
                    </button>
                </div>
            )}
            {loading && page > 1 &&  <Loader />}
            <Footer />
        </div>
    );
};
export default CategoryPage;