import { Movie, validateMovie } from '../models/movie.js';
import { Genre } from '../models/genre.js';

const getMovies = async (req, res) => {
    const movies = await Movie.find().sort('name').lean().select('-__v');
    res.send(movies);
};

const storeMovie = async (req, res) => {
    const { error } = validateMovie(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    const genre = await Genre.findById(req.body.genreId).lean();
    if (!genre) return res.status(400).send('Invalid genre.');
  
    const movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    });
    await movie.save();
    
    res.send(movie);
};

const updateMovie = async (req, res) => {
    const { error } = validateMovie(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    const genre = await Genre.findById(req.body.genreId).lean();
    if (!genre) return res.status(400).send('Invalid genre.');
  
    const movie = await Movie.findByIdAndUpdate(req.params.id,
      { 
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
      }, { new: true }).lean();
  
    if (!movie) return res.status(404).send('The movie with the given ID was not found.');
    
    res.send(movie);
};

const deleteMovie = async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id).lean().select('-__v');
  
    if (!movie) return res.status(404).send('The movie with the given ID was not found.');
  
    res.send(movie);
};

const getMovie = async (req, res) => {
    const movie = await Movie.findById(req.params.id).lean().select('-__v');
  
    if (!movie) return res.status(404).send('The movie with the given ID was not found.');
  
    res.send(movie);
};

export { getMovies, storeMovie, updateMovie, deleteMovie, getMovie };