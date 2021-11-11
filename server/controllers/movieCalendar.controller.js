const argon2 = require("argon2");
const MovieCalendar = require("../models/MovieCalendar");

const movieCalendar = require("../models/MovieCalendar");
//const { confirmAccess } = require("../shared/functions");

const getAllMovieCalendars = async (req, res) => {

    try {
        const allMovieCalendars = await MovieCalendar.find().populate({
                path: "room",
                select: "name"
            }).populate({
                path: "movie",
                select: "name"
            }
        );
        return res.status(200).json({
            success: true,
            allMovieCalendars
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const getMovieCalendarById = async (req, res) => {

    try {
        const movieCalendar = await MovieCalendar.findById(req.params.id).populate({
            path: "room",
            select: "name"
        }).populate({
            path: "movie",
            select: "name"
        });
        if (!movieCalendar) {
            return res.status(406).json({
                success: false,
                message: "Movie not found"
            })
        }
        return res.status(200).json({
            success: true,
            movieCalendar
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const createMovieCalendar = async (req,res) => {
   try {
        const {
            dateTimeStart,
            price,
            room,
            movie
        } = req.body;

        const newMovieCalendar = new MovieCalendar({
            dateTimeStart,
            price,
            room,
            movie
        })
        await newMovieCalendar.save();

        return res.status(201).json({
            success: true,
            message: "New movie calendar was created successfully"
        })
    } catch (error) {
        console.log(error);
        return res.stauts(500).json({
            success: false,
            message: "Internal servar error"
        })
    }
}

const updateMovieCalendarById = async (req, res) => {

    try {
        const {
            dateTimeStart,
            price,
            room,
            movie
        } = req.body;

        const movieCalendar = await MovieCalendar.findOne({ _id: req.params.id })
        if (!movieCalendar) {
            return res.status(406).json({
                success: false,
                message: "Movie calendar not found"
            })
        }

        await MovieCalendar.findOneAndUpdate(
            { _id: req.params.id},
            {
                dateTimeStart: new Date(dateTimeStart.concat("T00:00:10Z")),
                price,
                room,
                movie
            },
            { new: true }
        ).then((result) => result.save());
        return res.status(200).json({
            success: true,
            message: "Movie calendar's information has been updated successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Internal server error"
        })
    }
}

const deleteMovieCalendarById = async (req, res) => {
    try {


        const delMovieCalendar = await MovieCalendar.findByIdAndDelete(req.params.id);
        if  (!delMovieCalendar) {
            return res.status(406).json({
                success: false,
                message: "Movie calendar not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Delete movie calendar successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

module.exports = {
    getAllMovieCalendars,
    getMovieCalendarById,
    createMovieCalendar,
    updateMovieCalendarById,
    deleteMovieCalendarById
};