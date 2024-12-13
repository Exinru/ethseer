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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlockGenesis = exports.getNetworks = void 0;
const db_1 = require("../config/db");
const getNetworks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const networksEnv = process.env.NETWORKS;
        if (!networksEnv) {
            throw new Error("NETWORKS environment variable not set");
        }
        const networksArray = JSON.parse(networksEnv);
        const networkNames = networksArray.map((networkObj) => networkObj.network);
        res.json({
            networks: networkNames
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
});
exports.getNetworks = getNetworks;
const getBlockGenesis = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { network } = req.query;
        const chClient = db_1.clickhouseClients[network];
        const blockGenesisResultSet = yield chClient.query({
            query: `
                SELECT f_genesis_time
                FROM t_genesis
                LIMIT 1
            `,
            format: 'JSONEachRow',
        });
        const blockGenesisResult = yield blockGenesisResultSet.json();
        res.json({
            block_genesis: Number(blockGenesisResult[0].f_genesis_time) * 1000
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
});
exports.getBlockGenesis = getBlockGenesis;
//# sourceMappingURL=networks.js.map