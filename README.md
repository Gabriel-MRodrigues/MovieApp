# Movie App

A modern movie discovery app built using the TMDB API. Users can search for movies, explore trending titles, and view some detailed information about each film such as rating, title, poster, language and release year — all within a clean and user-friendly interface.

## Features

- Search Movies: Find movies by title using the TMDB API.
- Trending Section: Automatically displays the most searched movies by users in real time.
- Search Tracking Database: Tracks and stores user search counts in a lightweight database (appwrite) to power the trending section.

## Tech Stack

- React
- Database: AppWrite
- API: TMDB (The Movie Database)

## How Trending Section Works

Each time a user searches for a movie, the app stores that search count in a local database. These counts are aggregated to display the top searched movies in the Trending section, helping users discover what others are watching/searching.
