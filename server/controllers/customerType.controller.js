const argon2 = require("argon2");
// const jsonwebtoken = require("jsonwebtoken");
// const nodemailer = require("nodemailer");

const Movie = require("../models/Movie");

const addMovie = async(req, res) => {
    try {
        const {
            name,
            duaration,
            premiereDate,
        } = req.body;
        
        const newMovie = new Movie({
            name,
            duaration,
            premiereDate
        });
        await newMovie.save();

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};