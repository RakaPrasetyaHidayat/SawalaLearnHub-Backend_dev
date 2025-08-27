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
exports.SearchUsersDto = exports.UserSocialAccountDto = exports.UserEducationDto = exports.UpdateUserProfileDto = exports.UpdateUserStatusDto = void 0;
var class_validator_1 = require("class-validator");
var user_role_enum_1 = require("../../auth/enums/user-role.enum");
var UpdateUserStatusDto = function () {
    var _a;
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _role_decorators;
    var _role_initializers = [];
    var _role_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateUserStatusDto() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.role = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _role_initializers, void 0));
                __runInitializers(this, _role_extraInitializers);
            }
            return UpdateUserStatusDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, class_validator_1.IsEnum)(user_role_enum_1.UserStatus), (0, class_validator_1.IsNotEmpty)()];
            _role_decorators = [(0, class_validator_1.IsEnum)(user_role_enum_1.UserRole), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: function (obj) { return "role" in obj; }, get: function (obj) { return obj.role; }, set: function (obj, value) { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateUserStatusDto = UpdateUserStatusDto;
var UpdateUserProfileDto = function () {
    var _a;
    var _full_name_decorators;
    var _full_name_initializers = [];
    var _full_name_extraInitializers = [];
    var _division_id_decorators;
    var _division_id_initializers = [];
    var _division_id_extraInitializers = [];
    var _school_name_decorators;
    var _school_name_initializers = [];
    var _school_name_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateUserProfileDto() {
                this.full_name = __runInitializers(this, _full_name_initializers, void 0);
                this.division_id = (__runInitializers(this, _full_name_extraInitializers), __runInitializers(this, _division_id_initializers, void 0));
                this.school_name = (__runInitializers(this, _division_id_extraInitializers), __runInitializers(this, _school_name_initializers, void 0));
                __runInitializers(this, _school_name_extraInitializers);
            }
            return UpdateUserProfileDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _full_name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _division_id_decorators = [(0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _school_name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _full_name_decorators, { kind: "field", name: "full_name", static: false, private: false, access: { has: function (obj) { return "full_name" in obj; }, get: function (obj) { return obj.full_name; }, set: function (obj, value) { obj.full_name = value; } }, metadata: _metadata }, _full_name_initializers, _full_name_extraInitializers);
            __esDecorate(null, null, _division_id_decorators, { kind: "field", name: "division_id", static: false, private: false, access: { has: function (obj) { return "division_id" in obj; }, get: function (obj) { return obj.division_id; }, set: function (obj, value) { obj.division_id = value; } }, metadata: _metadata }, _division_id_initializers, _division_id_extraInitializers);
            __esDecorate(null, null, _school_name_decorators, { kind: "field", name: "school_name", static: false, private: false, access: { has: function (obj) { return "school_name" in obj; }, get: function (obj) { return obj.school_name; }, set: function (obj, value) { obj.school_name = value; } }, metadata: _metadata }, _school_name_initializers, _school_name_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateUserProfileDto = UpdateUserProfileDto;
var UserEducationDto = function () {
    var _a;
    var _institution_decorators;
    var _institution_initializers = [];
    var _institution_extraInitializers = [];
    var _degree_decorators;
    var _degree_initializers = [];
    var _degree_extraInitializers = [];
    var _start_year_decorators;
    var _start_year_initializers = [];
    var _start_year_extraInitializers = [];
    var _end_year_decorators;
    var _end_year_initializers = [];
    var _end_year_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UserEducationDto() {
                this.institution = __runInitializers(this, _institution_initializers, void 0);
                this.degree = (__runInitializers(this, _institution_extraInitializers), __runInitializers(this, _degree_initializers, void 0));
                this.start_year = (__runInitializers(this, _degree_extraInitializers), __runInitializers(this, _start_year_initializers, void 0));
                this.end_year = (__runInitializers(this, _start_year_extraInitializers), __runInitializers(this, _end_year_initializers, void 0));
                __runInitializers(this, _end_year_extraInitializers);
            }
            return UserEducationDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _institution_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _degree_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _start_year_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsNotEmpty)()];
            _end_year_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _institution_decorators, { kind: "field", name: "institution", static: false, private: false, access: { has: function (obj) { return "institution" in obj; }, get: function (obj) { return obj.institution; }, set: function (obj, value) { obj.institution = value; } }, metadata: _metadata }, _institution_initializers, _institution_extraInitializers);
            __esDecorate(null, null, _degree_decorators, { kind: "field", name: "degree", static: false, private: false, access: { has: function (obj) { return "degree" in obj; }, get: function (obj) { return obj.degree; }, set: function (obj, value) { obj.degree = value; } }, metadata: _metadata }, _degree_initializers, _degree_extraInitializers);
            __esDecorate(null, null, _start_year_decorators, { kind: "field", name: "start_year", static: false, private: false, access: { has: function (obj) { return "start_year" in obj; }, get: function (obj) { return obj.start_year; }, set: function (obj, value) { obj.start_year = value; } }, metadata: _metadata }, _start_year_initializers, _start_year_extraInitializers);
            __esDecorate(null, null, _end_year_decorators, { kind: "field", name: "end_year", static: false, private: false, access: { has: function (obj) { return "end_year" in obj; }, get: function (obj) { return obj.end_year; }, set: function (obj, value) { obj.end_year = value; } }, metadata: _metadata }, _end_year_initializers, _end_year_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UserEducationDto = UserEducationDto;
var UserSocialAccountDto = function () {
    var _a;
    var _platform_name_decorators;
    var _platform_name_initializers = [];
    var _platform_name_extraInitializers = [];
    var _url_decorators;
    var _url_initializers = [];
    var _url_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UserSocialAccountDto() {
                this.platform_name = __runInitializers(this, _platform_name_initializers, void 0);
                this.url = (__runInitializers(this, _platform_name_extraInitializers), __runInitializers(this, _url_initializers, void 0));
                __runInitializers(this, _url_extraInitializers);
            }
            return UserSocialAccountDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _platform_name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _url_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _platform_name_decorators, { kind: "field", name: "platform_name", static: false, private: false, access: { has: function (obj) { return "platform_name" in obj; }, get: function (obj) { return obj.platform_name; }, set: function (obj, value) { obj.platform_name = value; } }, metadata: _metadata }, _platform_name_initializers, _platform_name_extraInitializers);
            __esDecorate(null, null, _url_decorators, { kind: "field", name: "url", static: false, private: false, access: { has: function (obj) { return "url" in obj; }, get: function (obj) { return obj.url; }, set: function (obj, value) { obj.url = value; } }, metadata: _metadata }, _url_initializers, _url_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UserSocialAccountDto = UserSocialAccountDto;
var SearchUsersDto = function () {
    var _a;
    var _search_decorators;
    var _search_initializers = [];
    var _search_extraInitializers = [];
    var _role_decorators;
    var _role_initializers = [];
    var _role_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _page_decorators;
    var _page_initializers = [];
    var _page_extraInitializers = [];
    var _limit_decorators;
    var _limit_initializers = [];
    var _limit_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SearchUsersDto() {
                this.search = __runInitializers(this, _search_initializers, void 0);
                this.role = (__runInitializers(this, _search_extraInitializers), __runInitializers(this, _role_initializers, void 0));
                this.status = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.page = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _page_initializers, void 0));
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, void 0));
                __runInitializers(this, _limit_extraInitializers);
            }
            return SearchUsersDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _search_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _role_decorators = [(0, class_validator_1.IsEnum)(user_role_enum_1.UserRole), (0, class_validator_1.IsOptional)()];
            _status_decorators = [(0, class_validator_1.IsEnum)(user_role_enum_1.UserStatus), (0, class_validator_1.IsOptional)()];
            _page_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _limit_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: function (obj) { return "search" in obj; }, get: function (obj) { return obj.search; }, set: function (obj, value) { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
            __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: function (obj) { return "role" in obj; }, get: function (obj) { return obj.role; }, set: function (obj, value) { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SearchUsersDto = SearchUsersDto;
