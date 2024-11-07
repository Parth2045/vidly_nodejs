"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomer = exports.deleteCustomer = exports.updateCustomer = exports.storeCustomer = exports.getCustomers = void 0;
const customer_1 = require("../models/customer");
const getCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customers = yield customer_1.Customer.find().sort('name').lean().select('-__v -password');
    res.send(customers);
});
exports.getCustomers = getCustomers;
const storeCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, customer_1.validateCustomer)(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    if (yield (0, customer_1.isEmailExist)(req.body.email))
        return res.status(422).send('Email already exist');
    let customer = new customer_1.Customer({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        isGold: req.body.isGold,
        phone: req.body.phone,
        password: req.body.password,
    });
    yield customer.save();
    res.send(yield customer_1.Customer.findById(customer._id).select("-__v -password"));
});
exports.storeCustomer = storeCustomer;
const updateCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (Object.keys(req.body).length <= 0)
        return res.status(400).send('Nothing to update');
    const { error } = (0, customer_1.validateCustomerUpdate)(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const customer = yield customer_1.Customer.findByIdAndUpdate(req.params.id, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        isGold: req.body.isGold,
        phone: req.body.phone,
        password: req.body.password,
    }, { new: true }).lean().select('-__v -password');
    if (!customer)
        return res.status(404).send('The customer with the given ID was not found.');
    res.send(customer);
});
exports.updateCustomer = updateCustomer;
const deleteCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield customer_1.Customer.findByIdAndRemove(req.params.id).lean().select('-__v -password');
    if (!customer)
        return res.status(404).send('The customer with the given ID was not found.');
    res.send(customer);
});
exports.deleteCustomer = deleteCustomer;
const getCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield customer_1.Customer.findById(req.params.id).lean().select('-__v -password');
    if (!customer)
        return res.status(404).send('The customer with the given ID was not found.');
    res.send(customer);
});
exports.getCustomer = getCustomer;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield customer_1.Customer.find({ email: req.params.email, password: req.params.password }).lean().select('-__v -password');
    if (!customer)
        return res.status(404).send('The customer with the given ID was not found.');
    res.send(customer);
});
