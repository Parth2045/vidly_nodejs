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
exports.validateEmailPassword = validateEmailPassword;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SALT_WORK_FACTOR = 10;
const JWT_SECRET = '17c748b44fa7d672c97d2d0063156dba41bdcb23d1c95e57f7eb961245adac6f473f4a02a83f80bbeb126e03bdf9faac2661b9c408822941275e5adf0ee6200ecfca1ebabef7cff418a53c5a22158d82b22c32d4d0b06b74ad7720cbb505ed1d3219045c5fa90b8786e96471efff7d1a1b321fa3e4c4cdaae3f3d8d9f2dc7698c42c84a81b9784f3f970e121f52e2534f1c1db84f22cf1e0694774a56981abd9cb90dfbf314f8b114048fc166b937e5da323ee5e339149a54a44c3d5f32f69740323278f941754e67371dda2cd12b2a6dbcd0a848faedafeae5d18cb030b194b80466e3755edeea131313539d947551c5976f729f553987add7e282926f00471';
const JWT_EXPIRE_TIME = 3600; // IN SECONDS
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
customerSchema.method('isValidPassword', function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, bcrypt_1.compare)(password, this.password);
    });
});
customerSchema.method('customerToken', function (customer) {
    return __awaiter(this, void 0, void 0, function* () {
        return jsonwebtoken_1.default.sign({
            data: customer
        }, JWT_SECRET, { expiresIn: JWT_EXPIRE_TIME });
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
        phone: joi_1.default.string().min(5).max(50),
        password: joi_1.default.string().min(8).max(50),
        isGold: joi_1.default.boolean()
    };
    return joi_1.default.validate(customer, schema);
}
function validateEmailPassword(customer) {
    const schema = {
        email: joi_1.default.string().min(5).max(255).required(),
        password: joi_1.default.string().min(8).max(50).required()
    };
    return joi_1.default.validate(customer, schema);
}
function isEmailExist(email) {
    return Customer.findOne({ email });
}
