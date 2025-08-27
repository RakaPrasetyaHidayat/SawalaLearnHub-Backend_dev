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
exports.CreateCommentDto = exports.CreatePostDto = exports.UpdateTaskSubmissionDto = exports.SubmitTaskDto = exports.CreateTaskDto = exports.CreateResourceDto = exports.UpdateUserStatusDto = exports.RegisterUserDto = void 0;
var class_validator_1 = require("class-validator");
var interfaces_1 = require("../interfaces");
var RegisterUserDto = function () {
    var _a;
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _password_decorators;
    var _password_initializers = [];
    var _password_extraInitializers = [];
    var _full_name_decorators;
    var _full_name_initializers = [];
    var _full_name_extraInitializers = [];
    var _school_name_decorators;
    var _school_name_initializers = [];
    var _school_name_extraInitializers = [];
    var _major_decorators;
    var _major_initializers = [];
    var _major_extraInitializers = [];
    var _angkatan_decorators;
    var _angkatan_initializers = [];
    var _angkatan_extraInitializers = [];
    return _a = /** @class */ (function () {
            function RegisterUserDto() {
                this.email = __runInitializers(this, _email_initializers, void 0);
                this.password = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _password_initializers, void 0));
                this.full_name = (__runInitializers(this, _password_extraInitializers), __runInitializers(this, _full_name_initializers, void 0));
                this.school_name = (__runInitializers(this, _full_name_extraInitializers), __runInitializers(this, _school_name_initializers, void 0));
                this.major = (__runInitializers(this, _school_name_extraInitializers), __runInitializers(this, _major_initializers, void 0));
                this.angkatan = (__runInitializers(this, _major_extraInitializers), __runInitializers(this, _angkatan_initializers, void 0));
                __runInitializers(this, _angkatan_extraInitializers);
            }
            return RegisterUserDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _email_decorators = [(0, class_validator_1.IsEmail)()];
            _password_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(6)];
            _full_name_decorators = [(0, class_validator_1.IsString)()];
            _school_name_decorators = [(0, class_validator_1.IsString)()];
            _major_decorators = [(0, class_validator_1.IsString)()];
            _angkatan_decorators = [(0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: function (obj) { return "password" in obj; }, get: function (obj) { return obj.password; }, set: function (obj, value) { obj.password = value; } }, metadata: _metadata }, _password_initializers, _password_extraInitializers);
            __esDecorate(null, null, _full_name_decorators, { kind: "field", name: "full_name", static: false, private: false, access: { has: function (obj) { return "full_name" in obj; }, get: function (obj) { return obj.full_name; }, set: function (obj, value) { obj.full_name = value; } }, metadata: _metadata }, _full_name_initializers, _full_name_extraInitializers);
            __esDecorate(null, null, _school_name_decorators, { kind: "field", name: "school_name", static: false, private: false, access: { has: function (obj) { return "school_name" in obj; }, get: function (obj) { return obj.school_name; }, set: function (obj, value) { obj.school_name = value; } }, metadata: _metadata }, _school_name_initializers, _school_name_extraInitializers);
            __esDecorate(null, null, _major_decorators, { kind: "field", name: "major", static: false, private: false, access: { has: function (obj) { return "major" in obj; }, get: function (obj) { return obj.major; }, set: function (obj, value) { obj.major = value; } }, metadata: _metadata }, _major_initializers, _major_extraInitializers);
            __esDecorate(null, null, _angkatan_decorators, { kind: "field", name: "angkatan", static: false, private: false, access: { has: function (obj) { return "angkatan" in obj; }, get: function (obj) { return obj.angkatan; }, set: function (obj, value) { obj.angkatan = value; } }, metadata: _metadata }, _angkatan_initializers, _angkatan_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RegisterUserDto = RegisterUserDto;
var UpdateUserStatusDto = function () {
    var _a;
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateUserStatusDto() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                __runInitializers(this, _status_extraInitializers);
            }
            return UpdateUserStatusDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, class_validator_1.IsEnum)(interfaces_1.UserStatus)];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateUserStatusDto = UpdateUserStatusDto;
var CreateResourceDto = function () {
    var _a;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _file_url_decorators;
    var _file_url_initializers = [];
    var _file_url_extraInitializers = [];
    var _angkatan_decorators;
    var _angkatan_initializers = [];
    var _angkatan_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateResourceDto() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.file_url = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _file_url_initializers, void 0));
                this.angkatan = (__runInitializers(this, _file_url_extraInitializers), __runInitializers(this, _angkatan_initializers, void 0));
                __runInitializers(this, _angkatan_extraInitializers);
            }
            return CreateResourceDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsString)()];
            _file_url_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _angkatan_decorators = [(0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _file_url_decorators, { kind: "field", name: "file_url", static: false, private: false, access: { has: function (obj) { return "file_url" in obj; }, get: function (obj) { return obj.file_url; }, set: function (obj, value) { obj.file_url = value; } }, metadata: _metadata }, _file_url_initializers, _file_url_extraInitializers);
            __esDecorate(null, null, _angkatan_decorators, { kind: "field", name: "angkatan", static: false, private: false, access: { has: function (obj) { return "angkatan" in obj; }, get: function (obj) { return obj.angkatan; }, set: function (obj, value) { obj.angkatan = value; } }, metadata: _metadata }, _angkatan_initializers, _angkatan_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateResourceDto = CreateResourceDto;
var CreateTaskDto = function () {
    var _a;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _deadline_decorators;
    var _deadline_initializers = [];
    var _deadline_extraInitializers = [];
    var _angkatan_decorators;
    var _angkatan_initializers = [];
    var _angkatan_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateTaskDto() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.deadline = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _deadline_initializers, void 0));
                this.angkatan = (__runInitializers(this, _deadline_extraInitializers), __runInitializers(this, _angkatan_initializers, void 0));
                __runInitializers(this, _angkatan_extraInitializers);
            }
            return CreateTaskDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsString)()];
            _deadline_decorators = [(0, class_validator_1.IsDateString)()];
            _angkatan_decorators = [(0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _deadline_decorators, { kind: "field", name: "deadline", static: false, private: false, access: { has: function (obj) { return "deadline" in obj; }, get: function (obj) { return obj.deadline; }, set: function (obj, value) { obj.deadline = value; } }, metadata: _metadata }, _deadline_initializers, _deadline_extraInitializers);
            __esDecorate(null, null, _angkatan_decorators, { kind: "field", name: "angkatan", static: false, private: false, access: { has: function (obj) { return "angkatan" in obj; }, get: function (obj) { return obj.angkatan; }, set: function (obj, value) { obj.angkatan = value; } }, metadata: _metadata }, _angkatan_initializers, _angkatan_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateTaskDto = CreateTaskDto;
var SubmitTaskDto = function () {
    var _a;
    var _comment_decorators;
    var _comment_initializers = [];
    var _comment_extraInitializers = [];
    var _file_url_decorators;
    var _file_url_initializers = [];
    var _file_url_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SubmitTaskDto() {
                this.comment = __runInitializers(this, _comment_initializers, void 0);
                this.file_url = (__runInitializers(this, _comment_extraInitializers), __runInitializers(this, _file_url_initializers, void 0));
                __runInitializers(this, _file_url_extraInitializers);
            }
            return SubmitTaskDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _comment_decorators = [(0, class_validator_1.IsString)()];
            _file_url_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _comment_decorators, { kind: "field", name: "comment", static: false, private: false, access: { has: function (obj) { return "comment" in obj; }, get: function (obj) { return obj.comment; }, set: function (obj, value) { obj.comment = value; } }, metadata: _metadata }, _comment_initializers, _comment_extraInitializers);
            __esDecorate(null, null, _file_url_decorators, { kind: "field", name: "file_url", static: false, private: false, access: { has: function (obj) { return "file_url" in obj; }, get: function (obj) { return obj.file_url; }, set: function (obj, value) { obj.file_url = value; } }, metadata: _metadata }, _file_url_initializers, _file_url_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SubmitTaskDto = SubmitTaskDto;
var UpdateTaskSubmissionDto = function () {
    var _a;
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _comment_decorators;
    var _comment_initializers = [];
    var _comment_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateTaskSubmissionDto() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.comment = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _comment_initializers, void 0));
                __runInitializers(this, _comment_extraInitializers);
            }
            return UpdateTaskSubmissionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, class_validator_1.IsEnum)(TaskStatus)];
            _comment_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _comment_decorators, { kind: "field", name: "comment", static: false, private: false, access: { has: function (obj) { return "comment" in obj; }, get: function (obj) { return obj.comment; }, set: function (obj, value) { obj.comment = value; } }, metadata: _metadata }, _comment_initializers, _comment_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateTaskSubmissionDto = UpdateTaskSubmissionDto;
var CreatePostDto = function () {
    var _a;
    var _content_decorators;
    var _content_initializers = [];
    var _content_extraInitializers = [];
    var _media_url_decorators;
    var _media_url_initializers = [];
    var _media_url_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreatePostDto() {
                this.content = __runInitializers(this, _content_initializers, void 0);
                this.media_url = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _media_url_initializers, void 0));
                __runInitializers(this, _media_url_extraInitializers);
            }
            return CreatePostDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _content_decorators = [(0, class_validator_1.IsString)()];
            _media_url_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: function (obj) { return "content" in obj; }, get: function (obj) { return obj.content; }, set: function (obj, value) { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
            __esDecorate(null, null, _media_url_decorators, { kind: "field", name: "media_url", static: false, private: false, access: { has: function (obj) { return "media_url" in obj; }, get: function (obj) { return obj.media_url; }, set: function (obj, value) { obj.media_url = value; } }, metadata: _metadata }, _media_url_initializers, _media_url_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreatePostDto = CreatePostDto;
var CreateCommentDto = function () {
    var _a;
    var _content_decorators;
    var _content_initializers = [];
    var _content_extraInitializers = [];
    var _reference_id_decorators;
    var _reference_id_initializers = [];
    var _reference_id_extraInitializers = [];
    var _reference_type_decorators;
    var _reference_type_initializers = [];
    var _reference_type_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateCommentDto() {
                this.content = __runInitializers(this, _content_initializers, void 0);
                this.reference_id = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _reference_id_initializers, void 0));
                this.reference_type = (__runInitializers(this, _reference_id_extraInitializers), __runInitializers(this, _reference_type_initializers, void 0));
                __runInitializers(this, _reference_type_extraInitializers);
            }
            return CreateCommentDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _content_decorators = [(0, class_validator_1.IsString)()];
            _reference_id_decorators = [(0, class_validator_1.IsString)()];
            _reference_type_decorators = [(0, class_validator_1.IsString)()];
            __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: function (obj) { return "content" in obj; }, get: function (obj) { return obj.content; }, set: function (obj, value) { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
            __esDecorate(null, null, _reference_id_decorators, { kind: "field", name: "reference_id", static: false, private: false, access: { has: function (obj) { return "reference_id" in obj; }, get: function (obj) { return obj.reference_id; }, set: function (obj, value) { obj.reference_id = value; } }, metadata: _metadata }, _reference_id_initializers, _reference_id_extraInitializers);
            __esDecorate(null, null, _reference_type_decorators, { kind: "field", name: "reference_type", static: false, private: false, access: { has: function (obj) { return "reference_type" in obj; }, get: function (obj) { return obj.reference_type; }, set: function (obj, value) { obj.reference_type = value; } }, metadata: _metadata }, _reference_type_initializers, _reference_type_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateCommentDto = CreateCommentDto;
