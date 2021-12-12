const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth.middleware');

const {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovieById,
  deleteMovieById,
} = require('../controllers/movie.controller');

router.get('/get-all', getAllMovies);
router.get('/get/:id', getMovieById);
router.post('/create', verifyToken, createMovie);
router.put('/update/:id', verifyToken, updateMovieById);
router.delete('/delete/:id', verifyToken, deleteMovieById);

module.exports = router;
