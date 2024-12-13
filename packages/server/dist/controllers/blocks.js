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
exports.getTransactionsByBlock = exports.getLatestBlock = exports.getBlockById = exports.getBlocks = void 0;
const db_1 = require("../config/db");
const getBlocks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { network, page = 0, limit = 32 } = req.query;
        const chClient = db_1.clickhouseClients[network];
        const skip = Number(page) * Number(limit);
        const [blocksResultSet, countResultSet] = yield Promise.all([
            chClient.query({
                query: `
                        SELECT
                            f_el_block_number,
                            f_el_block_hash,
                            f_timestamp,
                            f_slot,
                            f_epoch,
                            f_el_fee_recp,
                            f_el_gas_limit,
                            f_el_gas_used,
                            f_el_transactions,
                            f_payload_size_bytes
                        FROM t_block_metrics
                        WHERE f_el_block_number <> 0
                        ORDER BY f_el_block_number DESC
                        LIMIT ${Number(limit)}
                        OFFSET ${skip}
                    `,
                format: 'JSONEachRow',
            }),
            chClient.query({
                query: `
                        SELECT COUNT(*) AS count
                        FROM t_block_metrics
                        WHERE f_el_block_number <> 0
                    `,
                format: 'JSONEachRow',
            }),
        ]);
        const blocksResult = yield blocksResultSet.json();
        const countResult = yield countResultSet.json();
        res.json({
            blocks: blocksResult,
            totalCount: Number(countResult[0].count),
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
});
exports.getBlocks = getBlocks;
const getBlockById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { network } = req.query;
        const chClient = db_1.clickhouseClients[network];
        const blockResultSet = yield chClient.query({
            query: `
                    SELECT
                        f_el_block_number,
                        f_el_block_hash,
                        f_timestamp,
                        f_slot,
                        f_epoch,
                        f_el_fee_recp,
                        f_el_gas_limit,
                        f_el_gas_used,
                        f_el_transactions,
                        f_payload_size_bytes
                    FROM t_block_metrics
                    WHERE f_el_block_number = ${id}
                    LIMIT 1
                `,
            format: 'JSONEachRow',
        });
        const blockResult = yield blockResultSet.json();
        res.json({
            block: blockResult[0],
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
});
exports.getBlockById = getBlockById;
const getLatestBlock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { network } = req.query;
        const chClient = db_1.clickhouseClients[network];
        const blockResultSet = yield chClient.query({
            query: `
                    SELECT
                        f_el_block_number,
                        f_el_block_hash,
                        f_timestamp,
                        f_slot,
                        f_epoch,
                        f_el_fee_recp,
                        f_el_gas_limit,
                        f_el_gas_used,
                        f_el_transactions,
                        f_payload_size_bytes
                    FROM t_block_metrics
                    WHERE f_el_block_number <> 0
                    ORDER BY f_el_block_number DESC
                    LIMIT 1
                `,
            format: 'JSONEachRow',
        });
        const blockResult = yield blockResultSet.json();
        res.json({
            block: blockResult[0],
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
});
exports.getLatestBlock = getLatestBlock;
const getTransactionsByBlock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { network } = req.query;
        const chClient = db_1.clickhouseClients[network];
        const transactionsResultSet = yield chClient.query({
            query: `
                    SELECT
                        f_tx_type,
                        f_value,
                        f_gas_fee_cap,
                        f_to,
                        f_hash,
                        f_timestamp,
                        f_from
                    FROM t_transactions
                    WHERE f_el_block_number = ${id}
                `,
            format: 'JSONEachRow',
        });
        const transactionsResult = yield transactionsResultSet.json();
        res.json({
            transactions: transactionsResult,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
});
exports.getTransactionsByBlock = getTransactionsByBlock;
//# sourceMappingURL=blocks.js.map