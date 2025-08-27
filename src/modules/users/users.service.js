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
exports.UsersService = void 0;
var common_1 = require("@nestjs/common");
var user_role_enum_1 = require("../auth/enums/user-role.enum");
var UsersService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var UsersService = _classThis = /** @class */ (function () {
        function UsersService_1(supabaseService) {
            this.supabaseService = supabaseService;
        }
        UsersService_1.prototype.updateUserStatus = function (userId, updateStatusDto, adminId) {
            return __awaiter(this, void 0, void 0, function () {
                var user, admin, _a, updatedUser, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.supabaseService.getClient()
                                .from('users')
                                .select()
                                .eq('id', userId)
                                .single()];
                        case 1:
                            user = (_b.sent()).data;
                            if (!user) {
                                throw new common_1.NotFoundException('User not found');
                            }
                            return [4 /*yield*/, this.supabaseService.getClient()
                                    .from('users')
                                    .select()
                                    .eq('id', adminId)
                                    .single()];
                        case 2:
                            admin = (_b.sent()).data;
                            if (!admin || admin.role !== user_role_enum_1.UserRole.ADMIN) {
                                throw new common_1.UnauthorizedException('Only admins can update user status');
                            }
                            if (!(updateStatusDto.status === user_role_enum_1.UserStatus.REJECTED)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.supabaseService.getClient()
                                    .from('rejection_logs')
                                    .insert({
                                    user_id: userId,
                                    admin_id: adminId,
                                    rejected_at: new Date().toISOString()
                                })];
                        case 3:
                            _b.sent();
                            _b.label = 4;
                        case 4: return [4 /*yield*/, this.supabaseService.getClient()
                                .from('users')
                                .update({ status: updateStatusDto.status })
                                .eq('id', userId)
                                .select()
                                .single()];
                        case 5:
                            _a = _b.sent(), updatedUser = _a.data, error = _a.error;
                            if (error)
                                throw error;
                            return [2 /*return*/, updatedUser];
                    }
                });
            });
        };
        UsersService_1.prototype.deleteRejectedUser = function (userId, adminId) {
            return __awaiter(this, void 0, void 0, function () {
                var user, admin, error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.supabaseService.getClient()
                                .from('users')
                                .select()
                                .eq('id', userId)
                                .single()];
                        case 1:
                            user = (_a.sent()).data;
                            if (!user) {
                                throw new common_1.NotFoundException('User not found');
                            }
                            if (user.status !== user_role_enum_1.UserStatus.REJECTED) {
                                throw new common_1.BadRequestException('Can only delete rejected users');
                            }
                            return [4 /*yield*/, this.supabaseService.getClient()
                                    .from('users')
                                    .select()
                                    .eq('id', adminId)
                                    .single()];
                        case 2:
                            admin = (_a.sent()).data;
                            if (!admin || admin.role !== user_role_enum_1.UserRole.ADMIN) {
                                throw new common_1.UnauthorizedException('Only admins can delete users');
                            }
                            return [4 /*yield*/, this.supabaseService.getClient()
                                    .from('users')
                                    .delete()
                                    .eq('id', userId)];
                        case 3:
                            error = (_a.sent()).error;
                            if (error)
                                throw error;
                            return [2 /*return*/, { message: 'User deleted successfully' }];
                    }
                });
            });
        };
        UsersService_1.prototype.findAll = function (searchDto) {
            return __awaiter(this, void 0, void 0, function () {
                var search, role, status, _a, page, _b, limit, query, _c, users, count;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            search = searchDto.search, role = searchDto.role, status = searchDto.status, _a = searchDto.page, page = _a === void 0 ? 1 : _a, _b = searchDto.limit, limit = _b === void 0 ? 10 : _b;
                            query = this.supabaseService.getClient(true)
                                .from('users')
                                .select('*');
                            if (search) {
                                query = query.or("full_name.ilike.%".concat(search, "%,email.ilike.%").concat(search, "%"));
                            }
                            if (role) {
                                query = query.eq('role', role);
                            }
                            if (status) {
                                query = query.eq('status', status);
                            }
                            return [4 /*yield*/, query
                                    .range((page - 1) * limit, page * limit - 1)
                                    .order('created_at', { ascending: false })];
                        case 1:
                            _c = _d.sent(), users = _c.data, count = _c.count;
                            return [2 /*return*/, {
                                    users: users,
                                    total: count || 0,
                                    page: page,
                                    limit: limit
                                }];
                    }
                });
            });
        };
        UsersService_1.prototype.updateStatus = function (id, updateStatusDto) {
            return __awaiter(this, void 0, void 0, function () {
                var status, _a, user, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            status = updateStatusDto.status;
                            // Validate the status
                            if (!Object.values(user_role_enum_1.UserStatus).includes(status)) {
                                throw new common_1.BadRequestException('Invalid status');
                            }
                            return [4 /*yield*/, this.supabaseService.getClient(true)
                                    .from('users')
                                    .update({ status: status, updated_at: new Date() })
                                    .eq('id', id)
                                    .select()
                                    .single()];
                        case 1:
                            _a = _b.sent(), user = _a.data, error = _a.error;
                            if (error)
                                throw error;
                            if (!user)
                                throw new common_1.NotFoundException('User not found');
                            return [2 /*return*/, user];
                    }
                });
            });
        };
        return UsersService_1;
    }());
    __setFunctionName(_classThis, "UsersService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UsersService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UsersService = _classThis;
}();
exports.UsersService = UsersService;
