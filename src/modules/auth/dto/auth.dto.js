"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordDto = exports.ForgotPasswordDto = exports.LoginDto = exports.RegisterDto = void 0;
var class_validator_1 = require("class-validator");
var user_role_enum_1 = require("../enums/user-role.enum");
var RegisterDto = function () {
    var _a;
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _full_name_decorators;
    var _full_name_initializers = [];
    var _full_name_extraInitializers = [];
    var _password_decorators;
    var _password_initializers = [];
    var _password_extraInitializers = [];
    var _role_decorators;
    var _role_initializers = [];
    var _role_extraInitializers = [];
    var _division_id_decorators;
    var _division_id_initializers = [];
    var _division_id_extraInitializers = [];
    var _angkatan_decorators;
    var _angkatan_initializers = [];
    var _angkatan_extraInitializers = [];
    var _school_name_decorators;
    var _school_name_initializers = [];
    var _school_name_extraInitializers = [];
    return _a = /** @class */ (function () {
            function RegisterDto() {
                this.email = __runInitializers(this, _email_initializers, void 0);
                this.full_name = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _full_name_initializers, void 0));
                this.password = (__runInitializers(this, _full_name_extraInitializers), __runInitializers(this, _password_initializers, void 0));
                this.role = (__runInitializers(this, _password_extraInitializers), __runInitializers(this, _role_initializers, void 0));
                this.division_id = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _division_id_initializers, void 0));
                this.angkatan = (__runInitializers(this, _division_id_extraInitializers), __runInitializers(this, _angkatan_initializers, void 0));
                this.school_name = (__runInitializers(this, _angkatan_extraInitializers), __runInitializers(this, _school_name_initializers, void 0));
                __runInitializers(this, _school_name_extraInitializers);
            }
            return RegisterDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _email_decorators = [(0, class_validator_1.IsEmail)(), (0, class_validator_1.IsNotEmpty)()];
            _full_name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _password_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MinLength)(6)];
            _role_decorators = [(0, class_validator_1.IsEnum)(user_role_enum_1.UserRole), (0, class_validator_1.IsNotEmpty)()];
            _division_id_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _angkatan_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsNotEmpty)()];
            _school_name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _full_name_decorators, { kind: "field", name: "full_name", static: false, private: false, access: { has: function (obj) { return "full_name" in obj; }, get: function (obj) { return obj.full_name; }, set: function (obj, value) { obj.full_name = value; } }, metadata: _metadata }, _full_name_initializers, _full_name_extraInitializers);
            __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: function (obj) { return "password" in obj; }, get: function (obj) { return obj.password; }, set: function (obj, value) { obj.password = value; } }, metadata: _metadata }, _password_initializers, _password_extraInitializers);
            __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: function (obj) { return "role" in obj; }, get: function (obj) { return obj.role; }, set: function (obj, value) { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
            __esDecorate(null, null, _division_id_decorators, { kind: "field", name: "division_id", static: false, private: false, access: { has: function (obj) { return "division_id" in obj; }, get: function (obj) { return obj.division_id; }, set: function (obj, value) { obj.division_id = value; } }, metadata: _metadata }, _division_id_initializers, _division_id_extraInitializers);
            __esDecorate(null, null, _angkatan_decorators, { kind: "field", name: "angkatan", static: false, private: false, access: { has: function (obj) { return "angkatan" in obj; }, get: function (obj) { return obj.angkatan; }, set: function (obj, value) { obj.angkatan = value; } }, metadata: _metadata }, _angkatan_initializers, _angkatan_extraInitializers);
            __esDecorate(null, null, _school_name_decorators, { kind: "field", name: "school_name", static: false, private: false, access: { has: function (obj) { return "school_name" in obj; }, get: function (obj) { return obj.school_name; }, set: function (obj, value) { obj.school_name = value; } }, metadata: _metadata }, _school_name_initializers, _school_name_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RegisterDto = RegisterDto;
var LoginDto = function () {
    var _a;
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _password_decorators;
    var _password_initializers = [];
    var _password_extraInitializers = [];
    return _a = /** @class */ (function () {
            function LoginDto() {
                this.email = __runInitializers(this, _email_initializers, void 0);
                this.password = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _password_initializers, void 0));
                __runInitializers(this, _password_extraInitializers);
            }
            return LoginDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _email_decorators = [(0, class_validator_1.IsEmail)(), (0, class_validator_1.IsNotEmpty)()];
            _password_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: function (obj) { return "password" in obj; }, get: function (obj) { return obj.password; }, set: function (obj, value) { obj.password = value; } }, metadata: _metadata }, _password_initializers, _password_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.LoginDto = LoginDto;
var ForgotPasswordDto = function () {
    var _a;
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ForgotPasswordDto() {
                this.email = __runInitializers(this, _email_initializers, void 0);
                __runInitializers(this, _email_extraInitializers);
            }
            return ForgotPasswordDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _email_decorators = [(0, class_validator_1.IsEmail)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ForgotPasswordDto = ForgotPasswordDto;
var ResetPasswordDto = function () {
    var _a;
    var _token_decorators;
    var _token_initializers = [];
    var _token_extraInitializers = [];
    var _new_password_decorators;
    var _new_password_initializers = [];
    var _new_password_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ResetPasswordDto() {
                this.token = __runInitializers(this, _token_initializers, void 0);
                this.new_password = (__runInitializers(this, _token_extraInitializers), __runInitializers(this, _new_password_initializers, void 0));
                __runInitializers(this, _new_password_extraInitializers);
            }
            return ResetPasswordDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _token_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _new_password_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MinLength)(6)];
            __esDecorate(null, null, _token_decorators, { kind: "field", name: "token", static: false, private: false, access: { has: function (obj) { return "token" in obj; }, get: function (obj) { return obj.token; }, set: function (obj, value) { obj.token = value; } }, metadata: _metadata }, _token_initializers, _token_extraInitializers);
            __esDecorate(null, null, _new_password_decorators, { kind: "field", name: "new_password", static: false, private: false, access: { has: function (obj) { return "new_password" in obj; }, get: function (obj) { return obj.new_password; }, set: function (obj, value) { obj.new_password = value; } }, metadata: _metadata }, _new_password_initializers, _new_password_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ResetPasswordDto = ResetPasswordDto;
