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
exports.CommentsController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var CommentsController = function () {
    var _classDecorators = [(0, common_1.Controller)('comments'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createPostComment_decorators;
    var _getPostComments_decorators;
    var _createTaskComment_decorators;
    var _getTaskComments_decorators;
    var CommentsController = _classThis = /** @class */ (function () {
        function CommentsController_1(commentsService) {
            this.commentsService = (__runInitializers(this, _instanceExtraInitializers), commentsService);
        }
        CommentsController_1.prototype.createPostComment = function (postId, userId, createCommentDto) {
            return this.commentsService.createComment(postId, userId, createCommentDto);
        };
        CommentsController_1.prototype.getPostComments = function (postId) {
            return this.commentsService.getPostComments(postId);
        };
        CommentsController_1.prototype.createTaskComment = function (taskId, userId, createCommentDto) {
            return this.commentsService.createTaskComment(taskId, userId, createCommentDto);
        };
        CommentsController_1.prototype.getTaskComments = function (taskId) {
            return this.commentsService.getTaskComments(taskId);
        };
        return CommentsController_1;
    }());
    __setFunctionName(_classThis, "CommentsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createPostComment_decorators = [(0, common_1.Post)('posts/:postId')];
        _getPostComments_decorators = [(0, common_1.Get)('posts/:postId')];
        _createTaskComment_decorators = [(0, common_1.Post)('tasks/:taskId')];
        _getTaskComments_decorators = [(0, common_1.Get)('tasks/:taskId')];
        __esDecorate(_classThis, null, _createPostComment_decorators, { kind: "method", name: "createPostComment", static: false, private: false, access: { has: function (obj) { return "createPostComment" in obj; }, get: function (obj) { return obj.createPostComment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPostComments_decorators, { kind: "method", name: "getPostComments", static: false, private: false, access: { has: function (obj) { return "getPostComments" in obj; }, get: function (obj) { return obj.getPostComments; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createTaskComment_decorators, { kind: "method", name: "createTaskComment", static: false, private: false, access: { has: function (obj) { return "createTaskComment" in obj; }, get: function (obj) { return obj.createTaskComment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTaskComments_decorators, { kind: "method", name: "getTaskComments", static: false, private: false, access: { has: function (obj) { return "getTaskComments" in obj; }, get: function (obj) { return obj.getTaskComments; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CommentsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CommentsController = _classThis;
}();
exports.CommentsController = CommentsController;
