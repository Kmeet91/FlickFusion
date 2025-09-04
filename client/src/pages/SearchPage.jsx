import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import { API_KEY } from '../api/requests';
import Navbar from '../components/Navbar';
import AddToListButton from '../components/AddToListButton';
import Footer from '../components/Footer';


const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (query) {
            setLoading(true);
            async function fetchData() {
                try {
                    const request = await axios.get(`/search/multi?api_key=${API_KEY}&query=${query}`);
                    setResults(request.data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv'));
                } catch (error) {
                    console.error("Failed to fetch search results:", error);
                } finally {
                    setLoading(false);
                }
            }
            fetchData();
        } else {
            setResults([]);
            setLoading(false);
        }
    }, [query]);

    if (loading) return <div className="bg-[#141414] text-white h-screen flex justify-center items-center">Searching...</div>;

    return (
        <div className='bg-[#141414] min-h-screen text-white'>
            <Navbar />
            <div className="pt-24 px-4 md:px-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-8">
                    {query ? `Results for: ${query}` : 'Please enter a search term'}
                </h1>
                {results.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8">
                        {results.map(item => (
                            item.poster_path && (
                                <div key={item.id}>
                                    <div className="group relative">
                                        <Link to={`/details/${item.media_type}/${item.id}`}>
                                            <div className="aspect-[2/3] bg-neutral-800 rounded-md overflow-hidden transition-transform transform group-hover:scale-105">
                                                <img className="w-full h-full object-cover" src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`} alt={item.title || item.name} />
                                            </div>
                                        </Link>
                                        <AddToListButton movie={item} />
                                    </div>
                                    <p className="mt-2 text-sm text-gray-200 truncate">{item.title || item.name}</p>
                                </div>
                            )
                        ))}
                    </div>
                ) : (
                    query && <p>No results found for "{query}". Please try another search.</p>
                )}
            </div>
            <Footer />
        </div>
    );
};
export default SearchPage;