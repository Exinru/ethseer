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
exports.getSlashedVals = void 0;
const db_1 = require("../config/db");
const getSlashedVals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { network, page = 0, limit = 10 } = req.query;
        const chClient = db_1.clickhouseClients[network];
        const skip = Number(page) * Number(limit);
        const [slashedValidatorResultSet, countResultSet] = yield Promise.all([
            chClient.query({
                query: `
                        SELECT
                            sl.f_slashed_validator_index AS f_slashed_validator_index,
                            sl.f_slashed_by_validator_index AS f_slashed_by_validator_index,
                            sl.f_slashing_reason AS f_slashing_reason,
                            sl.f_slot AS f_slot,
                            sl.f_epoch AS f_epoch,
                            pk.f_pool_name AS f_slashed_validator_pool_name,
                            pk_by.f_pool_name AS f_slashed_by_validator_pool_name
                        FROM
                            t_slashings sl
                        LEFT OUTER JOIN
                            t_eth2_pubkeys pk ON f_slashed_validator_index = pk.f_val_idx
                        LEFT OUTER JOIN
                            t_eth2_pubkeys pk_by ON f_slashed_by_validator_index = pk_by.f_val_idx
                        ORDER BY
                            f_epoch DESC
                        LIMIT ${Number(limit)}
                        OFFSET ${skip}
                    `,
                format: 'JSONEachRow',
            }),
            chClient.query({
                query: `
                        SELECT
                            COUNT(*) AS count
                        FROM
                            t_slashings
                    `,
                format: 'JSONEachRow',
            }),
        ]);
        const slashedValidatorResult = yield slashedValidatorResultSet.json();
        const countResult = yield countResultSet.json();
        res.json({
            slashedValidator: slashedValidatorResult,
            totalCount: Number(countResult[0].count),
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server',
        });
    }
});
exports.getSlashedVals = getSlashedVals;
//# sourceMappingURL=slashedValidators.js.map