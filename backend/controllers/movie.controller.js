import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function getTrendingMovie(request, response) {
  try {
    const data = await fetchFromTMDB(
      "https://api.themoviedb.org/3/trending/movie/day?language=en-US"
    );
    const randomTrendingMovie =
      data.results[Math.floor(Math.random() * data.results?.length)];

    response.status(200).json({ success: true, content: randomTrendingMovie });
  } catch (error) {
    response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function getMovieTrailers(request, response) {
  const { id } = request.params;
  try {
    //
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`
    );
    response.status(200).json({ success: true, content: data.results });
  } catch (error) {
    if (error.message.includes("404")) {
      return response.status(404).send(null);
    }
    response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function getMovieDetails(request, response) {
  const { id } = request.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}?language=en-US`
    );
    response.status(200).json({ success: true, content: data });
  } catch (error) {
    if (error.message.includes("404")) {
      return response.status(404).send(null);
    }
    response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function getSimilarMovies(request, response) {
  const { id } = request.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`
    );
    response.status(200).json({ success: true, content: data.results });
  } catch (error) {
    response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function getMoviesByCatagory(request, response) {
  const { category } = request.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`
    );
    response.status(200).json({ success: true, content: data.results });
  } catch (error) {
    response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}
