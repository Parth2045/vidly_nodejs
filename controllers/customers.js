import { Customer, validateCustomer } from '../models/customer.js';

const getCustomers = async (req, res) => {
    const customers = await Customer.find().sort('name').lean().select('-__v');
    res.send(customers);
};

const storeCustomer = async (req, res) => {
    const { error } = validateCustomer(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    let customer = new Customer({ 
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone
    });
    customer = await customer.save();
    
    res.send(customer);
};

const updateCustomer = async (req, res) => {
    const { error } = validateCustomer(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    const customer = await Customer.findByIdAndUpdate(req.params.id,
      { 
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
      }, { new: true }).lean().select('-__v');

    if (!customer) return res.status(404).send('The customer with the given ID was not found.');

    res.send(customer);
};

const deleteCustomer = async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id).lean().select('-__v');

    if (!customer) return res.status(404).send('The customer with the given ID was not found.');

    res.send(customer);
};

const getCustomer = async (req, res) => {
    const customer = await Customer.findById(req.params.id).lean().select('-__v -date');

    if (!customer) return res.status(404).send('The customer with the given ID was not found.');

    res.send(customer);
};

export { getCustomers, storeCustomer, updateCustomer, deleteCustomer, getCustomer };