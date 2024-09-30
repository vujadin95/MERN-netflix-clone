import { User } from "../models/user.model.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function searchPerson(request, response) {
  const { query } = request.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`
    );
    if (data.results.length === 0) {
      return response.status(404).send(null);
    }

    await User.findByIdAndUpdate(request.user._id, {
      $push: {
        searchHistory: {
          id: data.results[0].id,
          image: data.results[0].profile_path,
          title: data.results[0].name,
          searchType: "person",
          createdAt: new Date(),
        },
      },
    });

    response.status(200).json({ success: true, content: data.results });
  } catch (error) {
    console.log("Error in searchPerson controller: ", error.message);
    response.status(500).json({
      success: false,
      message: "Internal Server Error",
      errorMessage: error.message,
    });
  }
}
export async function searchMovie(request, response) {
  const { query } = request.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`
    );

    if (data.results.length === 0) {
      return response.status(404).send(null);
    }

    await User.findByIdAndUpdate(request.user._id, {
      $push: {
        searchHistory: {
          id: data.results[0].id,
          image: data.results[0].poster_path,
          title: data.results[0].title,
          searchType: "movie",
          createdAt: new Date(),
        },
      },
    });

    return response.status(200).json({ succes: true, content: data.results });
  } catch (error) {
    console.log("Error in searchMovie controller: ", error.message);
    response.status(500).json({
      success: false,
      message: "Internal Server Error",
      errorMessage: error.message,
    });
  }
}
export async function searchTv(request, response) {
  const { query } = request.params;
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`
    );

    if (data.results.length === 0) {
      return response.status(404).send(null);
    }

    await User.findByIdAndUpdate(request.user._id, {
      $push: {
        searchHistory: {
          id: data.results[0].id,
          image: data.results[0].poster_path,
          title: data.results[0].name,
          searchType: "tv",
          createdAt: new Date(),
        },
      },
    });

    return response.status(200).json({ succes: true, content: data.results });
  } catch (error) {
    console.log("Error in searchTv controller: ", error.message);
    response.status(500).json({
      success: false,
      message: "Internal Server Error",
      errorMessage: error.message,
    });
  }
}

export async function getSearchHistory(request, response) {
  try {
    response
      .status(200)
      .json({ succes: true, content: request.user.searchHistory });
  } catch (error) {
    response
      .status(500)
      .json({ succes: false, message: "Internal Server Error" });
  }
}

export async function removeFromSearchHistory(request, response) {
  const { id } = request.params;
  try {
    await User.findByIdAndUpdate(request.user._id, {
      $pull: {
        searchHistory: { id: parseInt(id) },
      },
    });

    response
      .status(200)
      .json({ succes: true, message: "Item removed from search history." });
  } catch (error) {
    console.log("Error in removeFromSearchHistory controller: ", error.message);
    response.status(500).json({
      success: false,
      message: "Internal Server Error",
      errorMessage: error.message,
    });
  }
}
