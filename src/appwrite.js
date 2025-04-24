import { Client, Databases, Query, ID } from 'appwrite';

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

// since we are using and API to get access to the movie data, this database was intended to store user searches and to build the trending movies section on the main App
// it stores any movie the user searches for and it updates its properties accordingly
// the main focus of the database is to store the movies and keep track on how many times the user has searched for its movie name
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(PROJECT_ID);

const database = new Databases(client);

// this function receives a search term typed by the user and the movie object that was fetched from the API
// it then searches through the database based on the search term to get the movie that was searched
// then it updates the count property of each movie on the database by 1
// so, this way we can keep track of how many times the movie was searched for so we can build the trending movies section on the main App
// if no results was found on the database (always first interaction), it creates a new element with the properties
// set to its searchTerm, count as 1, movie_id as the movie object id and poster_url as the movie object poster path found on the tmdb API
export const updateSearchCount = async (searchTerm, movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('searchTerm', searchTerm),
    ]);

    if (result.documents.length > 0) {
      const doc = result.documents[0];

      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
      });
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (e) {
    console.error(e);
  }
};

// this function is intended to retrieve the first 5 movies from the database and return it
// the query has a limit of 5, because we only want 5 movies to display as trending movies on the main App
// and the query orders the data by their count property
export const getTrendingMovies = async () => {
  const retrieveLimit = 5;
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(retrieveLimit),
      Query.orderDesc('count'),
    ]);
    return result.documents;
  } catch (e) {
    console.error(e);
  }
};
