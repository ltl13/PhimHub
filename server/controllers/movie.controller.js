const argon2 = require("argon2");

const Movie = require("../models/Movie");
const { confirmAccess } = require("../shared/functions");

const getAllMovies = async (req, res) => {
    // const confirm = await confirmAccess({
    //     role: req.body.role,
    //     func: "getAllMovies",
    // });
    //if (!confirm) return res.redirect("back");

    try {
        const allMovies = await Movie.find().populate( {
            path: "movieTypes",
            select: "typeName"
        });
        return res.status(200).json({
            success: true,
            allMovies
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const getMovieById = async (req, res) => {
    // const confirm = await confirmAccess({
    //     role: req.body.role,
    //     func: "getMovieById",
    // });
    // if (!confirm) return res.redirect("back");

    try {
        const movie = await Movie.findById(req.params.id).populate({
            path: "movieTypes",
            select: "typeName"
        })
        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found"
            })
        }
        return res.status(200).json({
            success: true,
            movie
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const createMovie = async (req,res) => {
    // const confirm = await confirmAccess({
    //     role: req.body.role,
    //     func: "createMovie"
    // })

    // if (!confirm) return res.redirect("back");

    try {
        const {
            name,
            duration,
            premiereDate,
            poster,
            description,
            directors,
            productionCompanies,
            writers,
            actors,
            movieTypes
        } = req.body;

        const newMovie = new Movie({
            name,
            duration,
            premiereDate,
            poster,
            description,
            directors,
            productionCompanies,
            writers,
            actors,
            movieTypes
        })
        await newMovie.save();

        return res.status(201).json({
            success: true,
            message: "New Movie was created successfully"
        })
    } catch (error) {
        console.log(error);
        return res.stauts(500).json({
            success: false,
            message: "Internal servar error"
        })
    }
}

const updateMovieById = async (req, res) => {
    // Check if user can access this route
    // const confirm = await confirmAccess({
    //     role: req.body.role,
    //     func: "updateMovieById",
    // });
    // if (!confirm) return res.redirect("back");

    try {
        const {
            name,
            duration,
            premiereDate,
            poster,
            description,
            directors,
            productionCompanies,
            writers,
            actors,
            movieTypes
        } = req.body;

        const movie = await Movie.findOne({ _id: req.params.id })
        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found"
            })
        }

        await Movie.findOneAndUpdate(
            { _id: req.params.id},
            {
                name,
                duration,
                premiereDate: new Date(premiereDate.concat("T00:00:10Z")),
                poster,
                description,
                directors,
                productionCompanies,
                writers,
                actors,
                movieTypes 
            },
            { new: true }
        ).then((result) => result.save());
        return res.status(200).json({
            success: true,
            message: "Movie's information has been updated successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Internal server error"
        })  
    }
}

const deleteMovieById = async (req, res) => {
    // Check if user can access this route
    // const confirm = await confirmAccess({
    //     role: req.body.role,
    //     func: "deleteMovieById",
    // });
    // if (!confirm) return res.redirect("back");

    try {
        // Nghĩ lại thì chức năng này không nên có
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

module.exports = {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovieById,
    deleteMovieById
};