"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
var common_1 = require("@nestjs/common");
var PostsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PostsService = _classThis = /** @class */ (function () {
        function PostsService_1(supabaseService) {
            this.supabaseService = supabaseService;
        }
        PostsService_1.prototype.create = function (createPostDto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, post, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.supabaseService.getClient()
                                .from('posts')
                                .insert(__assign(__assign({}, createPostDto), { user_id: userId }))
                                .select()
                                .single()];
                        case 1:
                            _a = _b.sent(), post = _a.data, error = _a.error;
                            if (error)
                                throw error;
                            return [2 /*return*/, post];
                    }
                });
            });
        };
        PostsService_1.prototype.findAll = function (filterDto) {
            return __awaiter(this, void 0, void 0, function () {
                var user_id, _a, page, _b, limit, query, _c, posts, count;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            user_id = filterDto.user_id, _a = filterDto.page, page = _a === void 0 ? 1 : _a, _b = filterDto.limit, limit = _b === void 0 ? 10 : _b;
                            query = this.supabaseService.getClient()
                                .from('posts')
                                .select("\n        *,\n        users!inner(id, full_name, email),\n        post_likes(count),\n        post_comments(count)\n      ");
                            if (user_id) {
                                query = query.eq('user_id', user_id);
                            }
                            return [4 /*yield*/, query
                                    .range((page - 1) * limit, page * limit - 1)
                                    .order('created_at', { ascending: false })];
                        case 1:
                            _c = _d.sent(), posts = _c.data, count = _c.count;
                            return [2 /*return*/, {
                                    posts: posts,
                                    total: count || 0,
                                    page: page,
                                    limit: limit
                                }];
                    }
                });
            });
        };
        PostsService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, post, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.supabaseService.getClient()
                                .from('posts')
                                .select()
                                .eq('id', id)
                                .single()];
                        case 1:
                            _a = _b.sent(), post = _a.data, error = _a.error;
                            if (error || !post) {
                                throw new common_1.NotFoundException('Post not found');
                            }
                            return [2 /*return*/, post];
                    }
                });
            });
        };
        PostsService_1.prototype.update = function (id, updatePostDto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var post, _a, updatedPost, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            post = _b.sent();
                            if (post.user_id !== userId) {
                                throw new common_1.UnauthorizedException('You can only update your own posts');
                            }
                            return [4 /*yield*/, this.supabaseService.getClient()
                                    .from('posts')
                                    .update(updatePostDto)
                                    .eq('id', id)
                                    .select()
                                    .single()];
                        case 2:
                            _a = _b.sent(), updatedPost = _a.data, error = _a.error;
                            if (error)
                                throw error;
                            return [2 /*return*/, updatedPost];
                    }
                });
            });
        };
        PostsService_1.prototype.remove = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var post;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            post = _a.sent();
                            if (post.user_id !== userId) {
                                throw new common_1.UnauthorizedException('You can only delete your own posts');
                            }
                            return [4 /*yield*/, this.supabaseService.delete('posts', id)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        // Likes
        PostsService_1.prototype.toggleLike = function (postId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var post, existingLike;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(postId)];
                        case 1:
                            post = _a.sent();
                            return [4 /*yield*/, this.supabaseService.getClient()
                                    .from('post_likes')
                                    .select()
                                    .eq('post_id', postId)
                                    .eq('user_id', userId)
                                    .single()];
                        case 2:
                            existingLike = (_a.sent()).data;
                            if (!existingLike) return [3 /*break*/, 4];
                            // Unlike
                            return [4 /*yield*/, this.supabaseService.delete('post_likes', existingLike.id)];
                        case 3:
                            // Unlike
                            _a.sent();
                            return [2 /*return*/, { liked: false }];
                        case 4: 
                        // Like
                        return [4 /*yield*/, this.supabaseService.create('post_likes', {
                                post_id: postId,
                                user_id: userId
                            })];
                        case 5:
                            // Like
                            _a.sent();
                            return [2 /*return*/, { liked: true }];
                    }
                });
            });
        };
        PostsService_1.prototype.getUserPosts = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.findAll({ user_id: userId, page: 1, limit: 10 })];
                });
            });
        };
        return PostsService_1;
    }());
    __setFunctionName(_classThis, "PostsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PostsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PostsService = _classThis;
}();
exports.PostsService = PostsService;
