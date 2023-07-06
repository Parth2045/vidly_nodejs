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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getCurrentUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const lodash_1 = __importDefault(require("lodash"));
const user_1 = require("../models/user");
;
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.User.findById(req.user._id).select('-password').lean();
    console.log("USER: ", req.user, req.user._id, user);
    res.send(user);
});
exports.getCurrentUser = getCurrentUser;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = user_1.UserValidator.validateUser(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    let user = yield user_1.User.findOne({ email: req.body.email });
    if (user)
        return res.status(400).send('User already registered.');
    user = new user_1.User(lodash_1.default.pick(req.body, ['name', 'email', 'password']));
    const salt = yield bcrypt_1.default.genSalt(10);
    user.password = yield bcrypt_1.default.hash(user.password, salt);
    yield user.save();
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(lodash_1.default.pick(user, ['_id', 'name', 'email']));
});
exports.createUser = createUser;
