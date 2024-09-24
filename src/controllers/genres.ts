import { Request, Response } from 'express';
import { Genre, validateGenre } from '../models/genre';
import { Movie } from '../models/movie';

const getGenres = async (req: Request, res: Response): Promise<any> => {
    const genres = await Genre.find().sort('name').lean();
    res.send(genres);
};

const storeGenres = async (req: Request, res: Response): Promise<any> => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();

    res.send(genre);
};

const updateGenre = async (req: Request, res: Response): Promise<any> => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true
    }).lean().select('_id name');

    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
}

const deleteGenre = async (req: Request, res: Response): Promise<any> => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
}

const getGenre = async (req: Request, res: Response): Promise<any> => {
    let genre = await Genre.findById(req.params.id).lean().select('-__v');

    const movies = await Movie.find({ 'genre._id': req.params.id }).lean().select('-__v -genre');

    genre.movies = movies;

    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
};

export { getGenres, storeGenres, updateGenre, deleteGenre, getGenre };