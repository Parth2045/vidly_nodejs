const auth = require('../middleware/auth');
const {Movie, validate} = require('../models/movies');
const express = require('express');
const { Genre } = require('../models/genres');
const router = express.Router();

const prefixRouteURL = '/';

router.get(prefixRouteURL, async (req, res) => {
    const movies = await Movie.find().sort('title');
    res.send(movies);
});

router.post(prefixRouteURL, auth, async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('Invalid genre.');

    const movie = new Movie({ 
        title: req.body.title,
        genre: { // Embedded Document
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
    });
    await movie.save();

    res.send(movie);
});

router.put(prefixRouteURL + ':id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('Invalid genre.');

    const movie = await Movie.findByIdAndUpdate(req.params.id, 
        { 
            title: req.body.title,
            genre: { // Embedded Document
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate,
        }, 
        {
            new: true 
        }
    );

    if(!movie) return res.status(404).send('The movie with given ID was not found');
 
    res.send(movie);
});

router.delete(prefixRouteURL + ':id', auth, async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id, );

    if(!movie) return res.status(404).send('The movie with given ID was not found');

    res.send(movie);
});

router.get(prefixRouteURL + ':id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    
    if(!movie) return res.status(404).send('The movie with given ID was not found');
    res.send(movie);
});


module.exports = router;