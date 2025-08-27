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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigModule = void 0;
var common_1 = require("@nestjs/common");
var dotenv = require("dotenv");
var zod_1 = require("zod");
var api_config_js_1 = require("./api.config.js");
dotenv.config();
var EnvSchema = zod_1.z.object({
    SUPABASE_URL: zod_1.z.string().url(),
    SUPABASE_ANON_KEY: zod_1.z.string().min(1),
    SUPABASE_SERVICE_ROLE_KEY: zod_1.z.string().min(1),
    SUPABASE_JWT_SECRET: zod_1.z.string().min(1),
    JWT_SECRET: zod_1.z.string().min(1),
    // Server
    PORT: zod_1.z.string().optional(),
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).optional(),
    // API
    API_GLOBAL_PREFIX: zod_1.z.string().default('api'),
    API_ENABLE_VERSIONING: zod_1.z.string().optional(), // 'true' | 'false'
    API_VERSIONING_TYPE: zod_1.z.enum(['uri', 'header']).default('uri'),
    API_DEFAULT_VERSION: zod_1.z.string().default('v1'),
    API_ENABLE_CORS: zod_1.z.string().optional(), // 'true' | 'false'
    API_CORS_ORIGIN: zod_1.z.string().optional(), // csv or '*'
    API_CORS_CREDENTIALS: zod_1.z.string().optional(), // 'true' | 'false'
});
var rawEnv = EnvSchema.parse(process.env);
function parseBoolean(v, def) {
    if (def === void 0) { def = false; }
    if (v === undefined)
        return def;
    return v.toLowerCase() === 'true';
}
function parseCorsOrigin(v) {
    if (!v)
        return false; // default disable unless enabled
    if (v.trim() === '*')
        return true;
    return v.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
}
var env = rawEnv;
var apiConfig = {
    globalPrefix: env.API_GLOBAL_PREFIX,
    enableVersioning: parseBoolean(env.API_ENABLE_VERSIONING, true),
    versioningType: env.API_VERSIONING_TYPE,
    defaultVersion: env.API_DEFAULT_VERSION,
    enableCors: parseBoolean(env.API_ENABLE_CORS, true),
    cors: {
        origin: (_a = parseCorsOrigin(env.API_CORS_ORIGIN)) !== null && _a !== void 0 ? _a : true,
        credentials: parseBoolean(env.API_CORS_CREDENTIALS, true),
    },
};
var ConfigModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            providers: [
                { provide: 'ENV', useValue: env },
                { provide: api_config_js_1.API_CONFIG, useValue: apiConfig },
            ],
            exports: ['ENV', api_config_js_1.API_CONFIG],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ConfigModule = _classThis = /** @class */ (function () {
        function ConfigModule_1() {
        }
        return ConfigModule_1;
    }());
    __setFunctionName(_classThis, "ConfigModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConfigModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConfigModule = _classThis;
}();
exports.ConfigModule = ConfigModule;
