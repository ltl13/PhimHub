const argon2 = require('argon2');
const mongoose = require('mongoose');

const Movie = require('../models/Movie');
const { confirmAccess, standardName } = require('../shared/functions');

const getAllMovies = async (req, res) => {
  // const confirm = await confirmAccess({
  //     staffType: req.body.staffTypeJwt,
  //     func: "getAllMovies",
  // });
  //if (!confirm) return res.redirect("back");

  try {
    const allMovies = await Movie.find({ deletedAt: null }).populate({
      path: 'movieTypes',
      select: 'typeName',
    });
    return res.status(200).json({
      success: true,
      allMovies,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const getAllMoviesInShowing = async (req, res) => {
  // const confirm = await confirmAccess({
  //     staffType: req.body.staffTypeJwt,
  //     func: "getAllMovies",
  // });
  //if (!confirm) return res.redirect("back");

  try {
    const allMovies = await Movie.find({
      deletedAt: null,
      status: true,
    }).populate({
      path: 'movieTypes',
      select: 'typeName',
    });
    return res.status(200).json({
      success: true,
      allMovies,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const getMovieById = async (req, res) => {
  // const confirm = await confirmAccess({
  //     staffType: req.body.staffTypeJwt,
  //     func: "getMovieById",
  // });
  // if (!confirm) return res.redirect("back");

  try {
    const movie = await Movie.findById(req.params.id).populate({
      path: 'movieTypes',
      select: 'typeName',
    });
    if (!movie) {
      return res.status(406).json({
        success: false,
        message: 'Movie not found',
      });
    }
    return res.status(200).json({
      success: true,
      movie,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const createMovie = async (req, res) => {
  const confirm = await confirmAccess({
    staffType: req.body.staffTypeJwt,
    func: 'MovieManagement',
  });

  if (!confirm)
    return res.status(400).json({
      success: false,
      message: 'Not has access',
    });

  try {
    const {
      name,
      duration,
      premiereDate,
      verticalPoster,
      horizontalPoster,
      trailer,
      description,
      directors,
      productionCompanies,
      writers,
      actors,
      movieTypes,
      status,
    } = req.body;

    const standardizedName = standardName(name);

    let checker = await Movie.findOne({
      name: standardizedName,
      deletedAt: null,
    });
    if (checker) {
      return res.status(400).json({
        success: false,
        invalid: 'name',
        message: 'Name already exists',
      });
    }

    const newMovie = new Movie({
      name: standardizedName,
      duration,
      premiereDate,
      verticalPoster,
      horizontalPoster,
      trailer,
      description,
      directors,
      productionCompanies,
      writers,
      actors,
      movieTypes,
      status,
    });
    await newMovie.save();

    return res.status(201).json({
      success: true,
      message: 'New Movie was created successfully',
      newMovie: newMovie,
    });
  } catch (error) {
    console.log(error);
    return res.stauts(500).json({
      success: false,
      message: 'Internal servar error',
    });
  }
};

const updateMovieById = async (req, res) => {
  const confirm = await confirmAccess({
    staffType: req.body.staffTypeJwt,
    func: 'MovieManagement',
  });

  if (!confirm)
    return res.status(400).json({
      success: false,
      message: 'Not has access',
    });

  try {
    const {
      name,
      duration,
      premiereDate,
      verticalPoster,
      horizontalPoster,
      trailer,
      description,
      directors,
      productionCompanies,
      writers,
      actors,
      movieTypes,
      status,
    } = req.body;

    const standardizedName = standardName(name);

    const movie = await Movie.findOne({ _id: req.params.id });
    if (!movie) {
      return res.status(406).json({
        success: false,
        message: 'Movie not found',
      });
    }

    let checker = await Movie.findOne({
      name: standardizedName,
      deletedAt: null,
    });
    if (checker && standardizedName !== movie.name) {
      return res.status(400).json({
        success: false,
        invalid: 'name',
        message: 'Name already exists',
      });
    }

    await Movie.findOneAndUpdate(
      { _id: req.params.id },
      {
        name: standardizedName,
        duration,
        premiereDate,
        verticalPoster,
        horizontalPoster,
        trailer,
        description,
        directors,
        productionCompanies,
        writers,
        actors,
        movieTypes,
        status,
      },
      { new: true }
    ).then((result) => result.save());
    return res.status(200).json({
      success: true,
      message: "Movie's information has been updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const deleteMovieById = async (req, res) => {
  const confirm = await confirmAccess({
    staffType: req.body.staffTypeJwt,
    func: 'MovieManagement',
  });

  if (!confirm)
    return res.status(400).json({
      success: false,
      message: 'Not has access',
    });

  try {
    const deleteMovie = await Movie.findOneAndUpdate(
      { _id: req.params.id, status: true },
      { deletedAt: new Date(Date.now()) },
      { new: true }
    );
    if (!deleteMovie) {
      return res.status(406).json({
        success: false,
        message: 'Movie not found',
      });
    }
    deleteMovie.save();

    return res.status(200).json({
      success: true,
      message: 'Delete Movie successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovieById,
  deleteMovieById,
  getAllMoviesInShowing,
};
