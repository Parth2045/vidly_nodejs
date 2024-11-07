"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Customer = void 0;
exports.validateCustomer = validateCustomer;
exports.validateCustomerUpdate = validateCustomerUpdate;
exports.isEmailExist = isEmailExist;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = require("bcrypt");
const SALT_WORK_FACTOR = 10;
const customerSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true,
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 50
    },
    date: {
        type: Date,
        default: Date.now
    }
});
customerSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next();
        try {
            this.password = yield (0, bcrypt_1.hash)(this.password, SALT_WORK_FACTOR);
            next();
        }
        catch (error) {
            return next(error);
        }
    });
});
customerSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const update = this.getUpdate();
        try {
            if (update && update.password) {
                update.password = yield (0, bcrypt_1.hash)(update.password, SALT_WORK_FACTOR);
            }
            next();
        }
        catch (error) {
            return next(error);
        }
    });
});
const Customer = (0, mongoose_1.model)('Customer', customerSchema);
exports.Customer = Customer;
function validateCustomer(customer) {
    const schema = {
        firstName: joi_1.default.string().min(2).max(50).required(),
        lastName: joi_1.default.string().min(2).max(50).required(),
        email: joi_1.default.string().min(5).max(255).required(),
        phone: joi_1.default.string().min(5).max(50).required(),
        password: joi_1.default.string().min(8).max(50).required(),
        isGold: joi_1.default.boolean()
    };
    return joi_1.default.validate(customer, schema);
}
function validateCustomerUpdate(customer) {
    const schema = {
        firstName: joi_1.default.string().min(2).max(50),
        lastName: joi_1.default.string().min(2).max(50),
        email: joi_1.default.string().min(5).max(255),
        phone: joi_1.default.string().min(5).max(50),
        password: joi_1.default.string().min(8).max(50),
        isGold: joi_1.default.boolean()
    };
    return joi_1.default.validate(customer, schema);
}
function isEmailExist(email) {
    return Customer.findOne({ email });
}
