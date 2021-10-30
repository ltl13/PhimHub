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
            return res.status(404).json({
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

        const newMovieType = new MovieType({ typeName});
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

}

const deleteMovieTypeById = async (req, res) => {

}

module.exports = {
    getAllMovieTypes,
    getMovieTypeById,
    createMovieType,
    updateMovieTypeById,
    deleteMovieTypeById
};