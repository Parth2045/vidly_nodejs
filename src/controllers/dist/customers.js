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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.signIn = exports.getCustomer = exports.deleteCustomer = exports.updateCustomer = exports.storeCustomer = exports.getCustomers = void 0;
var customer_1 = require("../models/customer");
var lodash_1 = require("lodash");
var getCustomers = function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var customers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, customer_1.Customer.find().sort('name').lean().select('-__v -password')];
            case 1:
                customers = _a.sent();
                res.send(customers);
                return [2 /*return*/];
        }
    });
}); };
exports.getCustomers = getCustomers;
var storeCustomer = function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var error, customer, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                error = customer_1.validateCustomer(req.body).error;
                if (error)
                    return [2 /*return*/, res.status(400).send({ error: error.details[0].message })];
                return [4 /*yield*/, customer_1.isEmailExist(req.body.email)];
            case 1:
                if (_c.sent())
                    return [2 /*return*/, res.status(422).send({ error: 'Email already exist' })];
                customer = new customer_1.Customer({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    isGold: req.body.isGold,
                    phone: req.body.phone,
                    password: req.body.password
                });
                return [4 /*yield*/, customer.save()];
            case 2:
                _c.sent();
                _b = (_a = res).send;
                return [4 /*yield*/, customer_1.Customer.findById(customer._id).select("-__v -password")];
            case 3:
                _b.apply(_a, [_c.sent()]);
                return [2 /*return*/];
        }
    });
}); };
exports.storeCustomer = storeCustomer;
var updateCustomer = function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var error, customer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (Object.keys(req.body).length <= 0)
                    return [2 /*return*/, res.status(400).send('Nothing to update')];
                error = customer_1.validateCustomerUpdate(req.body).error;
                if (error)
                    return [2 /*return*/, res.status(400).send(error.details[0].message)];
                return [4 /*yield*/, customer_1.Customer.findByIdAndUpdate(req.params.id, {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        isGold: req.body.isGold,
                        phone: req.body.phone,
                        password: req.body.password
                    }, { "new": true }).lean().select('-__v -password')];
            case 1:
                customer = _a.sent();
                if (!customer)
                    return [2 /*return*/, res.status(404).send('The customer with the given ID was not found.')];
                res.send(customer);
                return [2 /*return*/];
        }
    });
}); };
exports.updateCustomer = updateCustomer;
var deleteCustomer = function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var customer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, customer_1.Customer.findByIdAndRemove(req.params.id).lean().select('-__v -password')];
            case 1:
                customer = _a.sent();
                if (!customer)
                    return [2 /*return*/, res.status(404).send('The customer with the given ID was not found.')];
                res.send(customer);
                return [2 /*return*/];
        }
    });
}); };
exports.deleteCustomer = deleteCustomer;
var getCustomer = function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var customer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, customer_1.Customer.findById(req.params.id).lean().select('-__v -password')];
            case 1:
                customer = _a.sent();
                if (!customer)
                    return [2 /*return*/, res.status(404).send('The customer with the given ID was not found.')];
                res.send(customer);
                return [2 /*return*/];
        }
    });
}); };
exports.getCustomer = getCustomer;
var signIn = function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var error, _a, email, password, customer, isMatch, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                error = customer_1.validateEmailPassword(req.body).error;
                if (error)
                    return [2 /*return*/, res.status(400).send({ error: error.details[0].message })];
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, customer_1.Customer.findOne({ email: email }).select('-__v')];
            case 1:
                customer = _f.sent();
                if (!customer)
                    return [2 /*return*/, res.status(400).send("Invalid email or password.")];
                return [4 /*yield*/, customer.isValidPassword(password)];
            case 2:
                isMatch = _f.sent();
                if (!isMatch)
                    return [2 /*return*/, res.status(400).send("Invalid email or password.")];
                _c = (_b = res).send;
                _d = { "customer": lodash_1["default"].omit(customer.toObject(), ['password']) };
                _e = "token";
                return [4 /*yield*/, customer.customerToken(lodash_1["default"].omit(customer.toObject(), ['password']))];
            case 3:
                _c.apply(_b, [(_d[_e] = _f.sent(), _d)]);
                console.log(error);
                res.status(500).send("An unexpected error occurred.");
                return [2 /*return*/];
        }
    });
}); };
exports.signIn = signIn;
