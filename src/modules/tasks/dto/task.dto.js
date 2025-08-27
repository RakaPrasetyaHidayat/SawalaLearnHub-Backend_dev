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
exports.UpdateTaskStatusDto = exports.SubmitTaskDto = exports.CreateTaskDto = void 0;
var class_validator_1 = require("class-validator");
var interfaces_1 = require("@common/interfaces");
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
            _title_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _description_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _deadline_decorators = [(0, class_validator_1.IsDateString)(), (0, class_validator_1.IsNotEmpty)()];
            _angkatan_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
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
    var _submission_url_decorators;
    var _submission_url_initializers = [];
    var _submission_url_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SubmitTaskDto() {
                this.submission_url = __runInitializers(this, _submission_url_initializers, void 0);
                this.notes = (__runInitializers(this, _submission_url_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
            return SubmitTaskDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _submission_url_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _notes_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _submission_url_decorators, { kind: "field", name: "submission_url", static: false, private: false, access: { has: function (obj) { return "submission_url" in obj; }, get: function (obj) { return obj.submission_url; }, set: function (obj, value) { obj.submission_url = value; } }, metadata: _metadata }, _submission_url_initializers, _submission_url_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SubmitTaskDto = SubmitTaskDto;
var UpdateTaskStatusDto = function () {
    var _a;
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _feedback_decorators;
    var _feedback_initializers = [];
    var _feedback_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateTaskStatusDto() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.feedback = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _feedback_initializers, void 0));
                __runInitializers(this, _feedback_extraInitializers);
            }
            return UpdateTaskStatusDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, class_validator_1.IsEnum)(interfaces_1.SubmissionStatus), (0, class_validator_1.IsNotEmpty)()];
            _feedback_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _feedback_decorators, { kind: "field", name: "feedback", static: false, private: false, access: { has: function (obj) { return "feedback" in obj; }, get: function (obj) { return obj.feedback; }, set: function (obj, value) { obj.feedback = value; } }, metadata: _metadata }, _feedback_initializers, _feedback_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateTaskStatusDto = UpdateTaskStatusDto;
