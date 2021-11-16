const MovieType = require("../models/MovieType");
const Movie = require("../models/Movie");

const getAllMovieTypes = async (req, res) => {
    try {
        const listMovieTypes = await MovieType.find();
        return res.status(200).json({
            success: true,
            allMovieTypes: listMovieTypes,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const getMovieTypeById = async(req, res) => {
    try {
        const movieType = await MovieType.findById(req.params.id);
        if (!movieType) {
            return res.status(406).json({
                success: false,
                message: "Movie type not found"
            });
        }
        return res.status(200).json({
            success: true,
            movieType,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const createMovieType = async (req, res) => {
    try {
        const { typeName } = req.body;

        const movieType = await MovieType.findOne({  typeName });
        if (movieType) {
            return res.status(400).json({
                success: false,
                message: "This Movie type has existed"
            });
        }

        const newMovieType = new MovieType({ typeName });
        await newMovieType.save();
        return res.status(201).json({
            success: true,
            message: "New Movie type has just been added"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const updateMovieTypeById = async (req, res) => {
    try {
        const {typeName} = req.body;

        const movieType = await MovieType.findById(req.params.id)
        if (!movieType) {
            return res.status(406).json({
                success: false,
                message: "Movie type not found",
              });
        }

        const movieChecker  = await MovieType.findOne({typeName});
        console.log(movieType.typeName != typeName);
        if (movieChecker && movieType.type != typeName) {
            return res.status(400).json({
                success: false,
                message: "This movie type has existed"
            })
        }

        await MovieType.findByIdAndUpdate(
            req.params.id,
            { typeName },
            { new: true }
        ).then(async (result) => await result.save());

        return res.status(200).json({
            success: true,
            message: "Movie type has been updated"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const deleteMovieTypeById = async (req, res) => {
    // const confirm = await confirmAccess({
    //     staffType: req.body.staffType,
    //     func: "deleteMovieTypebyId"
    // })
    // if (!confirm) return res.rediect("back");

    try {
        const movieChecker = await Movie.findOne({
            movieType: req.params.id,
            status: true
        })
        if (movieChecker == null) {
            return res.status(406).json({
                success: false,
                message: "Can not delete because there are still movies of this type"
            })
        }

        const delMovieType = await MovieType.findByIdAndDelete(req.params.id);
        if  (!delMovieType) {
            return res.status(406).json({
                success: false,
                message: "Movie type not found"
            })
        }
        return res.stautus(200).json({
            success: true,
            message: "Delete movie type successfully"
        })
    } catch (error) {

    }
}

module.exports = {
    getAllMovieTypes,
    getMovieTypeById,
    createMovieType,
    updateMovieTypeById,
    deleteMovieTypeById
};