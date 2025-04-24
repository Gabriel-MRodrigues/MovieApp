import { useEffect, useState } from 'react';

import Search from './components/search';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';

import { getTrendingMovies, updateSearchCount } from './appwrite';

import { debounceSearchTerm } from './debounceFunc';

// getting api url from tmdb
const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// setting api options for read only
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [movieList, setMovieList] = useState([]);

  // debouncing search by 1000ms
  const debouncedSearchTerm = debounceSearchTerm(searchTerm, 1000);

  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingErrorMessage, setTrendingErrorMessage] = useState('');
  const [isTrendingLoading, setIsTrendingLoading] = useState(false);

  const fetchMovies = async (query = '') => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      const endPoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const res = await fetch(endPoint, API_OPTIONS);
      if (!res.ok) {
        throw new Error('Failed to fetch movies...');
      }
      // getting data from response
      const data = await res.json();

      if (data.Response === 'false') {
        setErrorMessage(data.Error || 'Failed to set movies...');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
      // console.log(data.results);
    } catch (e) {
      console.error(`Error fetching movies: ${e}`);
      setErrorMessage(`Error fetching movies, please try again later...`);
    } finally {
      setIsLoading(false);
    }
  };

  // function to get trending movies for trending section
  const loadTrendingMovies = async () => {
    setTrendingErrorMessage('');
    setIsTrendingLoading(true);

    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
      // console.log(movies);
    } catch (e) {
      console.error(`Error fetching trending movies: ${e}`);
      setTrendingErrorMessage('Error fetching trending movies...');
    } finally {
      setIsTrendingLoading(false);
    }
  };

  // useEffect to call fetchMovies function depending on the searchTerm
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // useEffect to call loadTrendingMovies as soon page is loaded, regardless of any dependencies
  useEffect(() => {
    loadTrendingMovies();
  }, []);

  // rendering html into page
  return (
    <main>
      <div className="pattern" />

      {/* header section */}
      <div className="wrapper">
        <header>
          <img src="/hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          {/* loading Search component for search functionality */}
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {/* trending movies section */}
        {isTrendingLoading ? (
          <Spinner />
        ) : trendingErrorMessage ? (
          <p className="text-red-500 m-[40px] text-center">
            {trendingErrorMessage}
          </p>
        ) : (
          trendingMovies.length > 0 && (
            <section className="trending">
              <h2>Trending Movies</h2>
              <ul>
                {/* mapping each trending movie and returning a list tag in html */}
                {trendingMovies.map((movie, index) => {
                  return (
                    <li key={movie.$id}>
                      <p>{index + 1}</p>
                      <img src={movie.poster_url} alt={movie.title} />
                    </li>
                  );
                })}
              </ul>
            </section>
          )
        )}
        {/* section to display all movies fetched from the API */}
        <section className="all-movies">
          <h2>All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500 m-[40px] text-center">{errorMessage}</p>
          ) : movieList.length === 0 ? (
            <p className="text-red-500 m-[40px] text-center">
              Searched movie title not found...
            </p>
          ) : (
            <ul>
              {/* mapping through each movie and return a MovieCard component to display movie */}
              {movieList.map((movie) => {
                return <MovieCard key={movie.id} movie={movie} />;
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
