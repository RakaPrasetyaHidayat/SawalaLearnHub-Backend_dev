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
exports.SupabaseService = void 0;
var common_1 = require("@nestjs/common");
var supabase_js_1 = require("@supabase/supabase-js");
var SupabaseService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SupabaseService = _classThis = /** @class */ (function () {
        function SupabaseService_1(env) {
            this.env = env;
            // Regular client with anon key for normal operations
            this.client = (0, supabase_js_1.createClient)(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
            // Admin client with service role key for admin operations
            this.adminClient = (0, supabase_js_1.createClient)(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
        }
        SupabaseService_1.prototype.getClient = function (useAdmin) {
            if (useAdmin === void 0) { useAdmin = false; }
            return useAdmin ? this.adminClient : this.client;
        };
        // Generic CRUD operations
        SupabaseService_1.prototype.create = function (table_1, data_1) {
            return __awaiter(this, arguments, void 0, function (table, data, useAdmin) {
                var _a, result, error;
                if (useAdmin === void 0) { useAdmin = false; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.getClient(useAdmin)
                                .from(table)
                                .insert(data)
                                .select()
                                .single()];
                        case 1:
                            _a = _b.sent(), result = _a.data, error = _a.error;
                            if (error)
                                throw error;
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        SupabaseService_1.prototype.findOne = function (table_1, id_1) {
            return __awaiter(this, arguments, void 0, function (table, id, useAdmin) {
                var _a, data, error;
                if (useAdmin === void 0) { useAdmin = false; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.getClient(useAdmin)
                                .from(table)
                                .select('*')
                                .eq('id', id)
                                .single()];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error)
                                throw error;
                            return [2 /*return*/, data];
                    }
                });
            });
        };
        SupabaseService_1.prototype.findMany = function (table_1) {
            return __awaiter(this, arguments, void 0, function (table, options, useAdmin) {
                var _a, page, _b, limit, _c, orderBy, _d, orderDirection, offset, query, _e, data, error, count;
                if (options === void 0) { options = {}; }
                if (useAdmin === void 0) { useAdmin = false; }
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            _a = options.page, page = _a === void 0 ? 1 : _a, _b = options.limit, limit = _b === void 0 ? 10 : _b, _c = options.orderBy, orderBy = _c === void 0 ? 'created_at' : _c, _d = options.orderDirection, orderDirection = _d === void 0 ? 'desc' : _d;
                            offset = (page - 1) * limit;
                            query = this.getClient(useAdmin)
                                .from(table)
                                .select('*', { count: 'exact' })
                                .order(orderBy, { ascending: orderDirection === 'asc' })
                                .range(offset, offset + limit - 1);
                            return [4 /*yield*/, query];
                        case 1:
                            _e = _f.sent(), data = _e.data, error = _e.error, count = _e.count;
                            if (error)
                                throw error;
                            return [2 /*return*/, { data: data, count: count || 0 }];
                    }
                });
            });
        };
        SupabaseService_1.prototype.update = function (table_1, id_1, data_1) {
            return __awaiter(this, arguments, void 0, function (table, id, data, useAdmin) {
                var _a, result, error;
                if (useAdmin === void 0) { useAdmin = false; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.getClient(useAdmin)
                                .from(table)
                                .update(data)
                                .eq('id', id)
                                .select()
                                .single()];
                        case 1:
                            _a = _b.sent(), result = _a.data, error = _a.error;
                            if (error)
                                throw error;
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        SupabaseService_1.prototype.delete = function (table_1, id_1) {
            return __awaiter(this, arguments, void 0, function (table, id, useAdmin) {
                var error;
                if (useAdmin === void 0) { useAdmin = false; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getClient(useAdmin)
                                .from(table)
                                .delete()
                                .eq('id', id)];
                        case 1:
                            error = (_a.sent()).error;
                            if (error)
                                throw error;
                            return [2 /*return*/];
                    }
                });
            });
        };
        // File storage operations
        SupabaseService_1.prototype.uploadFile = function (file_1, fileName_1) {
            return __awaiter(this, arguments, void 0, function (file, fileName, options) {
                var _a, bucket, _b, path, _c, upsert, filePath, _d, uploadError, data, publicUrl;
                if (options === void 0) { options = {}; }
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _a = options.bucket, bucket = _a === void 0 ? 'public' : _a, _b = options.path, path = _b === void 0 ? '' : _b, _c = options.upsert, upsert = _c === void 0 ? false : _c;
                            filePath = path ? "".concat(path, "/").concat(fileName) : fileName;
                            return [4 /*yield*/, this.adminClient.storage
                                    .from(bucket)
                                    .upload(filePath, file, {
                                    upsert: upsert,
                                    contentType: this.getContentType(fileName),
                                })];
                        case 1:
                            _d = _e.sent(), uploadError = _d.error, data = _d.data;
                            if (uploadError)
                                throw uploadError;
                            publicUrl = this.adminClient.storage
                                .from(bucket)
                                .getPublicUrl(filePath).data.publicUrl;
                            return [2 /*return*/, publicUrl];
                    }
                });
            });
        };
        SupabaseService_1.prototype.deleteFile = function (fileName_1) {
            return __awaiter(this, arguments, void 0, function (fileName, options) {
                var _a, bucket, _b, path, filePath, error;
                if (options === void 0) { options = {}; }
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = options.bucket, bucket = _a === void 0 ? 'public' : _a, _b = options.path, path = _b === void 0 ? '' : _b;
                            filePath = path ? "".concat(path, "/").concat(fileName) : fileName;
                            return [4 /*yield*/, this.adminClient.storage
                                    .from(bucket)
                                    .remove([filePath])];
                        case 1:
                            error = (_c.sent()).error;
                            if (error)
                                throw error;
                            return [2 /*return*/];
                    }
                });
            });
        };
        SupabaseService_1.prototype.getContentType = function (fileName) {
            var _a;
            var ext = (_a = fileName.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            var mimeTypes = {
                pdf: 'application/pdf',
                doc: 'application/msword',
                docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                jpg: 'image/jpeg',
                jpeg: 'image/jpeg',
                png: 'image/png',
                gif: 'image/gif'
            };
            return mimeTypes[ext || ''] || 'application/octet-stream';
        };
        return SupabaseService_1;
    }());
    __setFunctionName(_classThis, "SupabaseService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SupabaseService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SupabaseService = _classThis;
}();
exports.SupabaseService = SupabaseService;
