import { Request, Response } from 'express';
import { Customer, validateCustomer } from '../models/customer';

const getCustomers = async (req: Request, res: Response): Promise<any> => {
    const customers = await Customer.find().sort('name').lean().select('-__v');
    res.send(customers);
};

const storeCustomer = async (req: Request, res: Response): Promise<any> => {
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

const updateCustomer = async (req: Request, res: Response): Promise<any> => {
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

const deleteCustomer = async (req: Request, res: Response): Promise<any> => {
    const customer = await Customer.findByIdAndRemove(req.params.id).lean().select('-__v');

    if (!customer) return res.status(404).send('The customer with the given ID was not found.');

    res.send(customer);
};

const getCustomer = async (req: Request, res: Response): Promise<any> => {
    const customer = await Customer.findById(req.params.id).lean().select('-__v -date');

    if (!customer) return res.status(404).send('The customer with the given ID was not found.');

    res.send(customer);
};

export { getCustomers, storeCustomer, updateCustomer, deleteCustomer, getCustomer };