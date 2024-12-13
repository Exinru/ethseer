"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.existsNetwork = void 0;
const db_1 = require("../config/db");
const existsNetwork = (network) => {
    if (db_1.clickhouseClients[network] === undefined) {
        throw new Error('Network not found');
    }
    return true;
};
exports.existsNetwork = existsNetwork;
//# sourceMappingURL=network-validator.js.map