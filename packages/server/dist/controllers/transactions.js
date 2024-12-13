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
exports.getTransactionByHash = exports.getTransactions = void 0;
const db_1 = require("../config/db");
const address_1 = require("../helpers/address");
const getTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { network, page = 0, limit = 10 } = req.query;
        const clickhouseClient = db_1.clickhouseClients[network];
        const skip = Number(page) * Number(limit);
        const transactionsResultSet = yield clickhouseClient.query({
            query: `
                SELECT
                    f_tx_idx,
                    f_gas_fee_cap,
                    f_value,
                    f_to,
                    f_hash,
                    f_timestamp,
                    f_from,
                    f_el_block_number,
                    f_gas_price,
                    f_gas,
                    f_tx_type,
                    f_data
                FROM
                    t_transactions
                ORDER BY
                    f_slot DESC,
                    f_tx_idx DESC,
                    f_timestamp DESC
                LIMIT ${Number(limit)}
                OFFSET ${skip}
            `,
            format: 'JSONEachRow',
        });
        const transactionsResult = yield transactionsResultSet.json();
        res.json({
            transactions: transactionsResult.map((tx) => {
                var _a;
                return (Object.assign(Object.assign({}, tx), { f_to: (_a = tx.f_to) !== null && _a !== void 0 ? _a : address_1.ADDRESS_ZERO_SHORT }));
            })
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
});
exports.getTransactions = getTransactions;
const getTransactionByHash = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { hash } = req.params;
        const { network } = req.query;
        const clickhouseClient = db_1.clickhouseClients[network];
        const transactionResultSet = yield clickhouseClient.query({
            query: `
                SELECT
                    f_tx_idx,
                    f_gas_fee_cap,
                    f_value,
                    f_to,
                    f_hash,
                    f_timestamp,
                    f_from,
                    f_el_block_number,
                    f_gas_price,
                    f_gas,
                    f_tx_type,
                    f_data,
                    f_nonce
                FROM
                    t_transactions
                WHERE
                    f_hash = '${hash}'
                LIMIT 1
            `,
            format: 'JSONEachRow',
        });
        const transactionResult = yield transactionResultSet.json();
        if (!transactionResult[0]) {
            return res.json();
        }
        res.json({
            transaction: Object.assign(Object.assign({}, transactionResult[0]), { f_to: (_a = transactionResult[0].f_to) !== null && _a !== void 0 ? _a : address_1.ADDRESS_ZERO_SHORT })
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
});
exports.getTransactionByHash = getTransactionByHash;
//# sourceMappingURL=transactions.js.map