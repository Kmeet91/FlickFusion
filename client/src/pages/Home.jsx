import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Row from '../components/Row';
import requests from '../api/requests';
import api from '../api/api';
import Footer from '../components/Footer';

const Home = () => {
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const { data } = await api.get('/users/recommendations');
                if (data.length > 0) {
                    setRecommendations(data);
                }
            } catch (error) {
                console.error("Could not fetch recommendations", error);
            }
        };
        fetchRecommendations();
    }, []);

    return (
        <div className='bg-[#141414] text-white min-h-screen'>
            <Navbar />
            <Hero />
            <div className='pl-4 md:pl-12'>
                {/* Conditionally render the recommendations row */}
                {recommendations.length > 0 && (
                    <Row title="Recommended For You" movies={recommendations} categoryKey="recommendations" />
                )}
                <Row title="NETFLIX ORIGINALS" fetchUrl={requests.fetchNetflixOriginals} categoryKey={"fetchNetflixOriginals"} mediaType="tv" isLargeRow />
                <Row title="Trending Now" fetchUrl={requests.fetchTrending} categoryKey={"fetchTrending"}/>
                <Row title="Top Rated" fetchUrl={requests.fetchTopRated} categoryKey={"fetchTopRated"}/>
                <Row title="Action Movies" fetchUrl={requests.fetchActionMovies} categoryKey="fetchActionMovies" />
                <Row title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} categoryKey="fetchComedyMovies" />
                <Row title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} categoryKey="fetchHorrorMovies" />
            </div>
            <Footer />
        </div>
    );
};

export default Home;