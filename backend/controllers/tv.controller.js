import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function getTrendingTv(request, response) {
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/trending/tv/day?language=en-US`
    );

    const randomTrendingTv =
      data.results[Math.floor(Math.random() * data.results?.length)];

    response.status(200).json({ success: true, content: randomTrendingTv });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Internal server error",
      errorMessage: error.message,
    });
  }
}

export async function getTvTrailers(request, response) {
  const { id } = request.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`
    );

    response.status(200).json({ success: true, content: data.results });
  } catch (error) {
    if (error.message.includes("404")) {
      return response.status(404).send(null);
    }
    response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

export async function getTvDetails(request, response) {
  const { id } = request.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${id}?language=en-US`
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

export async function getSimilarTv(request, response) {
  const { id } = request.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`
    );
    response.status(200).json({ success: true, content: data.results });
  } catch (error) {
    response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function getTvByCatagory(request, response) {
  const { category } = request.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${category}?language=en-US&page=1`
    );
    response.status(200).json({ success: true, content: data.results });
  } catch (error) {
    response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}
