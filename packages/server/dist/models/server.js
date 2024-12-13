"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("../config/db");
const entities_1 = __importDefault(require("../routes/entities"));
const epochs_1 = __importDefault(require("../routes/epochs"));
const slots_1 = __importDefault(require("../routes/slots"));
const blocks_1 = __importDefault(require("../routes/blocks"));
const validators_1 = __importDefault(require("../routes/validators"));
const networks_1 = __importDefault(require("../routes/networks"));
const transactions_1 = __importDefault(require("../routes/transactions"));
class Server {
    constructor() {
        this.paths = {
            entities: '/api/entities',
            epochs: '/api/epochs',
            slots: '/api/slots',
            blocks: '/api/blocks',
            validators: '/api/validators',
            networks: '/api/networks',
            transactions: '/api/transactions',
        };
        this.app = (0, express_1.default)();
        this.ip = process.env.API_LISTEN_IP || '127.0.0.1';
        this.port = Number(process.env.API_LISTEN_PORT) || 4000;
        this.callsVerbose = process.env.CALLS_VERBOSE === 'True';
        // Connect to the database
        this.connectDB();
        // Middlewares
        this.middlewares();
        // Rutas de mi apliación
        this.routes();
    }
    connectDB() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, db_1.dbConnection)();
        });
    }
    middlewares() {
        // CORS
        this.app.use((0, cors_1.default)());
        // Parse body from json
        this.app.use(express_1.default.json());
        if (this.callsVerbose) {
            // Show the queries in the terminal
            this.app.use('/', (req, res, next) => {
                console.log(`${req.method} - ${req.url}`);
                next();
            });
        }
    }
    routes() {
        this.app.use(this.paths.entities, entities_1.default);
        this.app.use(this.paths.epochs, epochs_1.default);
        this.app.use(this.paths.slots, slots_1.default);
        this.app.use(this.paths.blocks, blocks_1.default);
        this.app.use(this.paths.validators, validators_1.default);
        this.app.use(this.paths.networks, networks_1.default);
        this.app.use(this.paths.transactions, transactions_1.default);
    }
    listen() {
        this.app.listen(this.port, this.ip, () => {
            console.log(`Server running on ${this.ip}:${this.port}`);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map