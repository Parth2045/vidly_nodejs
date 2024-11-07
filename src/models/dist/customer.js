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
exports.validateEmailPassword = exports.isEmailExist = exports.validateCustomerUpdate = exports.validateCustomer = exports.Customer = void 0;
var joi_1 = require("joi");
var mongoose_1 = require("mongoose");
var bcrypt_1 = require("bcrypt");
var jsonwebtoken_1 = require("jsonwebtoken");
var SALT_WORK_FACTOR = 10;
var JWT_SECRET = '17c748b44fa7d672c97d2d0063156dba41bdcb23d1c95e57f7eb961245adac6f473f4a02a83f80bbeb126e03bdf9faac2661b9c408822941275e5adf0ee6200ecfca1ebabef7cff418a53c5a22158d82b22c32d4d0b06b74ad7720cbb505ed1d3219045c5fa90b8786e96471efff7d1a1b321fa3e4c4cdaae3f3d8d9f2dc7698c42c84a81b9784f3f970e121f52e2534f1c1db84f22cf1e0694774a56981abd9cb90dfbf314f8b114048fc166b937e5da323ee5e339149a54a44c3d5f32f69740323278f941754e67371dda2cd12b2a6dbcd0a848faedafeae5d18cb030b194b80466e3755edeea131313539d947551c5976f729f553987add7e282926f00471';
var JWT_EXPIRE_TIME = 3600; // IN SECONDS
var customerSchema = new mongoose_1["default"].Schema({
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
        unique: true
    },
    isGold: {
        type: Boolean,
        "default": false
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
        "default": Date.now
    }
});
customerSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!this.isModified("password"))
                        return [2 /*return*/, next()];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    _a = this;
                    return [4 /*yield*/, bcrypt_1.hash(this.password, SALT_WORK_FACTOR)];
                case 2:
                    _a.password = _b.sent();
                    next();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    return [2 /*return*/, next(error_1)];
                case 4: return [2 /*return*/];
            }
        });
    });
});
customerSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function () {
        var update, _a, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    update = this.getUpdate();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    if (!(update && update.password)) return [3 /*break*/, 3];
                    _a = update;
                    return [4 /*yield*/, bcrypt_1.hash(update.password, SALT_WORK_FACTOR)];
                case 2:
                    _a.password = _b.sent();
                    _b.label = 3;
                case 3:
                    next();
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _b.sent();
                    return [2 /*return*/, next(error_2)];
                case 5: return [2 /*return*/];
            }
        });
    });
});
customerSchema.method('isValidPassword', function (password) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bcrypt_1.compare(password, this.password)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
});
customerSchema.method('customerToken', function (customer) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, jsonwebtoken_1["default"].sign({
                    data: customer
                }, JWT_SECRET, { expiresIn: JWT_EXPIRE_TIME })];
        });
    });
});
var Customer = mongoose_1.model('Customer', customerSchema);
exports.Customer = Customer;
function validateCustomer(customer) {
    var schema = {
        firstName: joi_1["default"].string().min(2).max(50).required(),
        lastName: joi_1["default"].string().min(2).max(50).required(),
        email: joi_1["default"].string().min(5).max(255).required(),
        phone: joi_1["default"].string().min(5).max(50).required(),
        password: joi_1["default"].string().min(8).max(50).required(),
        isGold: joi_1["default"].boolean()
    };
    return joi_1["default"].validate(customer, schema);
}
exports.validateCustomer = validateCustomer;
function validateCustomerUpdate(customer) {
    var schema = {
        firstName: joi_1["default"].string().min(2).max(50),
        lastName: joi_1["default"].string().min(2).max(50),
        phone: joi_1["default"].string().min(5).max(50),
        password: joi_1["default"].string().min(8).max(50),
        isGold: joi_1["default"].boolean()
    };
    return joi_1["default"].validate(customer, schema);
}
exports.validateCustomerUpdate = validateCustomerUpdate;
function validateEmailPassword(customer) {
    var schema = {
        email: joi_1["default"].string().min(5).max(255).required(),
        password: joi_1["default"].string().min(8).max(50).required()
    };
    return joi_1["default"].validate(customer, schema);
}
exports.validateEmailPassword = validateEmailPassword;
function isEmailExist(email) {
    return Customer.findOne({ email: email });
}
exports.isEmailExist = isEmailExist;
