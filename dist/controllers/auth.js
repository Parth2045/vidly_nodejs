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
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../models/user");
const auth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    let user = yield user_1.User.findOne({ email: req.body.email }).lean();
    if (!user)
        return res.status(400).send('Invalid email or password.');
    const validPassword = yield bcrypt_1.default.compare(req.body.password, user.password);
    if (!validPassword)
        return res.status(400).send('Invalid email or password.');
    const userModelObj = new user_1.User(user);
    const token = userModelObj.generateAuthToken();
    res.send(token);
});
function validate(req) {
    const schema = joi_1.default.object({
        email: joi_1.default.string().min(5).max(255).required().email(),
        password: joi_1.default.string().min(5).max(255).required()
    });
    return joi_1.default.validate(req, schema);
}
/**
 * NOTE :  //IF SINGLE FUNCTION EXPORTED THEN USE "export default FNNAME".
 */
exports.default = auth;
