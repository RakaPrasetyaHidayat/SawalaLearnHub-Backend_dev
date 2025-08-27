"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourcesController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var ResourcesController = function () {
    var _classDecorators = [(0, common_1.Controller)('resources'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createResource_decorators;
    var _getResourcesByYear_decorators;
    var _getUserResources_decorators;
    var ResourcesController = _classThis = /** @class */ (function () {
        function ResourcesController_1(resourcesService) {
            this.resourcesService = (__runInitializers(this, _instanceExtraInitializers), resourcesService);
        }
        ResourcesController_1.prototype.createResource = function (createResourceDto, userId) {
            return this.resourcesService.createResource(createResourceDto, userId);
        };
        ResourcesController_1.prototype.getResourcesByYear = function (year) {
            return this.resourcesService.getResourcesByYear(year);
        };
        ResourcesController_1.prototype.getUserResources = function (userId) {
            return this.resourcesService.getUserResources(userId);
        };
        return ResourcesController_1;
    }());
    __setFunctionName(_classThis, "ResourcesController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createResource_decorators = [(0, common_1.Post)()];
        _getResourcesByYear_decorators = [(0, common_1.Get)('year/:year')];
        _getUserResources_decorators = [(0, common_1.Get)('users/:userId')];
        __esDecorate(_classThis, null, _createResource_decorators, { kind: "method", name: "createResource", static: false, private: false, access: { has: function (obj) { return "createResource" in obj; }, get: function (obj) { return obj.createResource; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getResourcesByYear_decorators, { kind: "method", name: "getResourcesByYear", static: false, private: false, access: { has: function (obj) { return "getResourcesByYear" in obj; }, get: function (obj) { return obj.getResourcesByYear; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getUserResources_decorators, { kind: "method", name: "getUserResources", static: false, private: false, access: { has: function (obj) { return "getUserResources" in obj; }, get: function (obj) { return obj.getUserResources; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ResourcesController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ResourcesController = _classThis;
}();
exports.ResourcesController = ResourcesController;
