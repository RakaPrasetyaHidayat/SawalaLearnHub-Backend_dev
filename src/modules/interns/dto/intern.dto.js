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
exports.FilterInternsDto = exports.UpdateInternDto = exports.CreateInternDto = void 0;
var class_validator_1 = require("class-validator");
var CreateInternDto = function () {
    var _a;
    var _user_id_decorators;
    var _user_id_initializers = [];
    var _user_id_extraInitializers = [];
    var _angkatan_decorators;
    var _angkatan_initializers = [];
    var _angkatan_extraInitializers = [];
    var _division_id_decorators;
    var _division_id_initializers = [];
    var _division_id_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateInternDto() {
                this.user_id = __runInitializers(this, _user_id_initializers, void 0);
                this.angkatan = (__runInitializers(this, _user_id_extraInitializers), __runInitializers(this, _angkatan_initializers, void 0));
                this.division_id = (__runInitializers(this, _angkatan_extraInitializers), __runInitializers(this, _division_id_initializers, void 0));
                this.status = (__runInitializers(this, _division_id_extraInitializers), __runInitializers(this, _status_initializers, 'active'));
                __runInitializers(this, _status_extraInitializers);
            }
            return CreateInternDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _user_id_decorators = [(0, class_validator_1.IsUUID)()];
            _angkatan_decorators = [(0, class_validator_1.IsNumber)()];
            _division_id_decorators = [(0, class_validator_1.IsUUID)()];
            _status_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _user_id_decorators, { kind: "field", name: "user_id", static: false, private: false, access: { has: function (obj) { return "user_id" in obj; }, get: function (obj) { return obj.user_id; }, set: function (obj, value) { obj.user_id = value; } }, metadata: _metadata }, _user_id_initializers, _user_id_extraInitializers);
            __esDecorate(null, null, _angkatan_decorators, { kind: "field", name: "angkatan", static: false, private: false, access: { has: function (obj) { return "angkatan" in obj; }, get: function (obj) { return obj.angkatan; }, set: function (obj, value) { obj.angkatan = value; } }, metadata: _metadata }, _angkatan_initializers, _angkatan_extraInitializers);
            __esDecorate(null, null, _division_id_decorators, { kind: "field", name: "division_id", static: false, private: false, access: { has: function (obj) { return "division_id" in obj; }, get: function (obj) { return obj.division_id; }, set: function (obj, value) { obj.division_id = value; } }, metadata: _metadata }, _division_id_initializers, _division_id_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateInternDto = CreateInternDto;
var UpdateInternDto = function () {
    var _a;
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _division_id_decorators;
    var _division_id_initializers = [];
    var _division_id_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateInternDto() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.division_id = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _division_id_initializers, void 0));
                __runInitializers(this, _division_id_extraInitializers);
            }
            return UpdateInternDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _division_id_decorators = [(0, class_validator_1.IsUUID)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _division_id_decorators, { kind: "field", name: "division_id", static: false, private: false, access: { has: function (obj) { return "division_id" in obj; }, get: function (obj) { return obj.division_id; }, set: function (obj, value) { obj.division_id = value; } }, metadata: _metadata }, _division_id_initializers, _division_id_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateInternDto = UpdateInternDto;
var FilterInternsDto = function () {
    var _a;
    var _angkatan_decorators;
    var _angkatan_initializers = [];
    var _angkatan_extraInitializers = [];
    var _division_id_decorators;
    var _division_id_initializers = [];
    var _division_id_extraInitializers = [];
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
            function FilterInternsDto() {
                this.angkatan = __runInitializers(this, _angkatan_initializers, void 0);
                this.division_id = (__runInitializers(this, _angkatan_extraInitializers), __runInitializers(this, _division_id_initializers, void 0));
                this.status = (__runInitializers(this, _division_id_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.page = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _page_initializers, 1));
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, 10));
                __runInitializers(this, _limit_extraInitializers);
            }
            return FilterInternsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _angkatan_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _division_id_decorators = [(0, class_validator_1.IsUUID)(), (0, class_validator_1.IsOptional)()];
            _status_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _page_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _limit_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _angkatan_decorators, { kind: "field", name: "angkatan", static: false, private: false, access: { has: function (obj) { return "angkatan" in obj; }, get: function (obj) { return obj.angkatan; }, set: function (obj, value) { obj.angkatan = value; } }, metadata: _metadata }, _angkatan_initializers, _angkatan_extraInitializers);
            __esDecorate(null, null, _division_id_decorators, { kind: "field", name: "division_id", static: false, private: false, access: { has: function (obj) { return "division_id" in obj; }, get: function (obj) { return obj.division_id; }, set: function (obj, value) { obj.division_id = value; } }, metadata: _metadata }, _division_id_initializers, _division_id_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.FilterInternsDto = FilterInternsDto;
