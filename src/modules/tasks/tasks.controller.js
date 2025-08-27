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
exports.TasksController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var roles_guard_1 = require("../auth/guards/roles.guard");
var roles_decorator_1 = require("../auth/decorators/roles.decorator");
var user_role_enum_1 = require("../auth/enums/user-role.enum");
var TasksController = function () {
    var _classDecorators = [(0, common_1.Controller)('tasks'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createTask_decorators;
    var _submitTask_decorators;
    var _updateTaskStatus_decorators;
    var _getTasksByYear_decorators;
    var _getUserTasks_decorators;
    var TasksController = _classThis = /** @class */ (function () {
        function TasksController_1(tasksService) {
            this.tasksService = (__runInitializers(this, _instanceExtraInitializers), tasksService);
        }
        TasksController_1.prototype.createTask = function (createTaskDto, adminId) {
            return this.tasksService.createTask(createTaskDto, adminId);
        };
        TasksController_1.prototype.submitTask = function (taskId, userId, submitTaskDto) {
            return this.tasksService.submitTask(taskId, userId, submitTaskDto);
        };
        TasksController_1.prototype.updateTaskStatus = function (taskId, userId, adminId, updateStatusDto) {
            return this.tasksService.updateTaskStatus(taskId, userId, adminId, updateStatusDto);
        };
        TasksController_1.prototype.getTasksByYear = function (year) {
            return this.tasksService.getTasksByYear(year);
        };
        TasksController_1.prototype.getUserTasks = function (userId) {
            return this.tasksService.getUserTasks(userId);
        };
        return TasksController_1;
    }());
    __setFunctionName(_classThis, "TasksController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createTask_decorators = [(0, common_1.Post)(), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN), (0, common_1.UseGuards)(roles_guard_1.RolesGuard)];
        _submitTask_decorators = [(0, common_1.Post)(':taskId/submit')];
        _updateTaskStatus_decorators = [(0, common_1.Put)(':taskId/users/:userId/status'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN), (0, common_1.UseGuards)(roles_guard_1.RolesGuard)];
        _getTasksByYear_decorators = [(0, common_1.Get)('year/:year')];
        _getUserTasks_decorators = [(0, common_1.Get)('users/:userId')];
        __esDecorate(_classThis, null, _createTask_decorators, { kind: "method", name: "createTask", static: false, private: false, access: { has: function (obj) { return "createTask" in obj; }, get: function (obj) { return obj.createTask; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _submitTask_decorators, { kind: "method", name: "submitTask", static: false, private: false, access: { has: function (obj) { return "submitTask" in obj; }, get: function (obj) { return obj.submitTask; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateTaskStatus_decorators, { kind: "method", name: "updateTaskStatus", static: false, private: false, access: { has: function (obj) { return "updateTaskStatus" in obj; }, get: function (obj) { return obj.updateTaskStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTasksByYear_decorators, { kind: "method", name: "getTasksByYear", static: false, private: false, access: { has: function (obj) { return "getTasksByYear" in obj; }, get: function (obj) { return obj.getTasksByYear; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getUserTasks_decorators, { kind: "method", name: "getUserTasks", static: false, private: false, access: { has: function (obj) { return "getUserTasks" in obj; }, get: function (obj) { return obj.getUserTasks; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TasksController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TasksController = _classThis;
}();
exports.TasksController = TasksController;
