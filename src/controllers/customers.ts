import { Request, Response } from 'express';
import { Customer, validateCustomer, validateCustomerUpdate } from '../models/customer';

const getCustomers = async (req: Request, res: Response): Promise<any> => {
  const customers = await Customer.find().sort('name').lean().select('-__v -password');
  res.send(customers);
};

const storeCustomer = async (req: Request, res: Response): Promise<any> => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    isGold: req.body.isGold,
    phone: req.body.phone,
    password: req.body.password,
  });

  await customer.save();

  res.send(await Customer.findById(customer._id).select("-__v -password"));
};

const updateCustomer = async (req: Request, res: Response): Promise<any> => {
  const { error } = validateCustomerUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(req.params.id,
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      isGold: req.body.isGold,
      phone: req.body.phone,
      password: req.body.password,
    }, { new: true }).lean().select('-__v -password');

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
};

const deleteCustomer = async (req: Request, res: Response): Promise<any> => {
  const customer = await Customer.findByIdAndRemove(req.params.id).lean().select('-__v -password');

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
};

const getCustomer = async (req: Request, res: Response): Promise<any> => {
  const customer = await Customer.findById(req.params.id).lean().select('-__v -password');

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
};

export { getCustomers, storeCustomer, updateCustomer, deleteCustomer, getCustomer };