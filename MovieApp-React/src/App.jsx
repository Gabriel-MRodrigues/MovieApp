import { useEffect, useState } from 'react';
import Search from './components/search';
import Spinner from './components/Spinner';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

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

  const fetchMovies = async () => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      const endPoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const res = await fetch(endPoint, API_OPTIONS);
      if (!res.ok) {
        throw new Error('Failed to fetch movies...');
      }
      const data = await res.json();

      if (data.Response === 'false') {
        setErrorMessage(data.Error || 'Failed to set movies...');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
    } catch (e) {
      console.error(`Error fetching movies: ${e}`);
      setErrorMessage(`Error fetching movies, please try again later...`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="/hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => {
                return (
                  <p className="text-white" key={movie.id}>
                    {movie.title}
                  </p>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
