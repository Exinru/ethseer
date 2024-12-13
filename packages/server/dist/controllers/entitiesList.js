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
exports.getEntityList = void 0;
const db_1 = require("../config/db");
const getEntityList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { network } = req.query;
        const chClient = db_1.clickhouseClients[network];
        const [entityListResultSet] = yield Promise.all([
            chClient.query({
                query: `
                        SELECT DISTINCT
                            f_pool_name
                        FROM
                            t_eth2_pubkeys
                    `,
                format: 'JSONEachRow',
            }),
        ]);
        const entityListResult = yield entityListResultSet.json();
        res.json({
            entityListResult: entityListResult,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server',
        });
    }
});
exports.getEntityList = getEntityList;
//# sourceMappingURL=entitiesList.js.map