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
exports.dbConnection = exports.clickhouseClients = void 0;
const client_1 = require("@clickhouse/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.clickhouseClients = {};
const dbConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const networks = JSON.parse(process.env.NETWORKS);
        if (!networks) {
            throw new Error('No networks found');
        }
        for (const network of networks) {
            exports.clickhouseClients[network.network] = (0, client_1.createClient)({
                host: network.host,
                username: network.user,
                password: network.password,
                database: network.name,
                clickhouse_settings: {
                    output_format_json_quote_64bit_integers: 0,
                },
                log: {
                    level: process.env.CLICKHOUSE_TRACE === 'True' ? client_1.ClickHouseLogLevel.TRACE : client_1.ClickHouseLogLevel.OFF,
                },
            });
        }
        console.log('Database connected');
    }
    catch (error) {
        console.log(error);
        throw new Error('Error when trying to connect to the DB');
    }
});
exports.dbConnection = dbConnection;
//# sourceMappingURL=db.js.map