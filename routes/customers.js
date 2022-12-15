const auth = require('../middleware/auth');
const { Customer, validate } = require('../models/customer');
const express = require('express');
const router = express.Router();

const prefixRouteURL = '/';

router.get(prefixRouteURL, async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.post(prefixRouteURL, auth, async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    });
    await customer.save();

    res.send(customer);
});

router.put(prefixRouteURL + ':id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, 
        {
            isGold: req.body.isGold,
            name: req.body.name,
            phone: req.body.phone
        },
        {
            new: true
        });

    if(!customer) return res.status(404).send('The customer with given ID was not found');

    res.send(customer);
});

router.delete(prefixRouteURL + ':id', auth, async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);

    if(!customer) return res.status(404).send('The customer with given ID was not found');

    res.send(customer);
});

router.get(prefixRouteURL + ':id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if(!customer) return res.status(404).send('The customer with given ID was not found');

    res.send(customer);
});

module.exports = router;
