import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import { API_KEY } from '../api/requests';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';

const ActorDetailPage = () => {
    const { personId } = useParams();
    const [person, setPerson] = useState(null);
    const [credits, setCredits] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const personDetailsReq = axios.get(`/person/${personId}?api_key=${API_KEY}&language=en-US`);
                const combinedCreditsReq = axios.get(`/person/${personId}/combined_credits?api_key=${API_KEY}&language=en-US`);

                const [personRes, creditsRes] = await Promise.all([personDetailsReq, combinedCreditsReq]);

                setPerson(personRes.data);
                const sortedCredits = creditsRes.data.cast
                    .filter(c => c.poster_path)
                    .sort((a, b) => b.popularity - a.popularity);
                setCredits(sortedCredits);

            } catch (error) {
                console.error("Failed to fetch person details:", error);
            }
        }
        fetchData();
    }, [personId]);

    if (!person) {
        return <Loader />;
    }

    return (
        <div className="bg-[#141414] min-h-screen text-white flex flex-col">
            <Navbar />
            {/* --- Main content layout changed to CSS Grid --- */}
            <main className="flex-grow pt-24 px-8 md:px-16 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* --- Left Column: Actor Info (1/4 width on desktop) --- */}
                <div className="md:col-span-1 w-full flex-shrink-0 text-center md:text-left">
                    <img src={`https://image.tmdb.org/t/p/w500/${person.profile_path}`} alt={person.name} className="rounded-lg shadow-lg mx-auto md:mx-0" />
                    <h2 className="text-2xl font-bold mt-4">Personal Info</h2>
                    <p className="mt-2"><strong className="block">Known For:</strong> {person.known_for_department}</p>
                    <p className="mt-2"><strong className="block">Birthday:</strong> {person.birthday}</p>
                    <p className="mt-2"><strong className="block">Place of Birth:</strong> {person.place_of_birth}</p>
                </div>

                {/* --- Right Column: Biography and Known For (3/4 width on desktop) --- */}
                <div className="md:col-span-3">
                    <h1 className="text-4xl md:text-5xl font-bold">{person.name}</h1>
                    <h3 className="text-xl font-semibold mt-6 mb-2">Biography</h3>
                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{person.biography || "No biography available."}</p>

                    <h3 className="text-2xl font-bold mt-8 mb-4">Known For</h3>
                    <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                        {credits.slice(0, 10).map(credit => (
                            <Link to={`/details/${credit.media_type}/${credit.id}`} key={`${credit.id}-${credit.credit_id}`} className="flex-shrink-0 w-36">
                                <img src={`https://image.tmdb.org/t/p/w500/${credit.poster_path}`} alt={credit.title || credit.name} className="rounded-lg" />
                                <p className="text-sm mt-2 truncate">{credit.title || credit.name}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ActorDetailPage;