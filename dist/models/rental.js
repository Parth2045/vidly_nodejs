"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.Rental = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = require("mongoose");
const rentalSchema = new mongoose_1.Schema({
    customer: {
        type: new mongoose_1.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50,
            },
            isGold: {
                type: Boolean,
                default: false,
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50,
            },
        }),
        required: true,
    },
    movie: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Movie' }],
    dateOut: {
        type: Date,
        required: true,
        default: Date.now,
    },
    dateReturned: {
        type: Date,
    },
    rentalFee: {
        type: Number,
        min: 0,
    },
});
const Rental = (0, mongoose_1.model)('Rental', rentalSchema);
exports.Rental = Rental;
function validate(rental) {
    const schema = {
        customerId: joi_1.default.string().required(),
        movieId: joi_1.default.string().required(),
    };
    return joi_1.default.validate(rental, schema);
}
exports.validate = validate;
