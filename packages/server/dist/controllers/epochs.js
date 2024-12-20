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
exports.listenEpochNotification = exports.getSlotsByEpoch = exports.getEpochById = exports.getEpochsStatistics = void 0;
const db_1 = require("../config/db");
const getEpochsStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { network, page = 0, limit = 10 } = req.query;
        const clickhouseClient = db_1.clickhouseClients[network];
        const skip = Number(page) * Number(limit);
        const [epochsStatsResultSet, blocksStatsResultSet, epochsCountResultSet] = yield Promise.all([
            clickhouseClient
                .query({
                query: `
                        SELECT
                            f_epoch,
                            f_slot,
                            f_num_att_vals,
                            f_num_active_vals,
                            f_att_effective_balance_eth,
                            f_total_effective_balance_eth,
                            f_missing_source,
                            f_missing_target,
                            f_missing_head
                        FROM
                            t_epoch_metrics_summary
                        ORDER BY
                            f_epoch DESC
                        LIMIT ${Number(limit)}
                        OFFSET ${skip}
                    `,
                format: 'JSONEachRow',
            })
                .catch((err) => {
                console.error('Error executing epochsStats query:', err);
                throw new Error('Failed to execute epochsStats query');
            }),
            clickhouseClient
                .query({
                query: `
                        SELECT
                            CAST((f_proposer_slot / 32) AS UInt64) AS epoch,
                            groupArray(CASE WHEN f_proposed = 1 THEN 1 ELSE 0 END) AS proposed_blocks
                        FROM
                            t_proposer_duties
                        GROUP BY
                            epoch
                        ORDER BY
                            epoch DESC
                        LIMIT ${Number(limit) + 1}
                        OFFSET ${skip}
                    `,
                format: 'JSONEachRow',
            })
                .catch((err) => {
                console.error('Error executing blocksStats query:', err);
                throw new Error('Failed to execute blocksStats query');
            }),
            clickhouseClient
                .query({
                query: `
                        SELECT COUNT(*) AS count
                        FROM t_epoch_metrics_summary
                    `,
                format: 'JSONEachRow',
            })
                .catch((err) => {
                console.error('Error executing epochsCount query:', err);
                throw new Error('Failed to execute epochsCount query');
            }),
        ]);
        const epochsStatsResult = yield epochsStatsResultSet.json();
        const blocksStatsResult = yield blocksStatsResultSet.json();
        const epochsCountResult = yield epochsCountResultSet.json();
        let arrayEpochs = [];
        epochsStatsResult.forEach((epoch) => {
            const aux = blocksStatsResult.find((blocks) => Number(blocks.epoch) === Number(epoch.f_epoch));
            arrayEpochs.push(Object.assign(Object.assign({}, epoch), { proposed_blocks: aux === null || aux === void 0 ? void 0 : aux.proposed_blocks }));
        });
        res.json({
            epochsStats: arrayEpochs,
            totalCount: Number(epochsCountResult[0].count),
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server',
        });
    }
});
exports.getEpochsStatistics = getEpochsStatistics;
const getEpochById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { network } = req.query;
        const clickhouseClient = db_1.clickhouseClients[network];
        const [epochStatsResultSet, blocksProposedResultSet, withdrawalsResultSet] = yield Promise.all([
            clickhouseClient.query({
                query: `
                        SELECT
                            f_epoch,
                            f_slot,
                            f_num_att_vals,
                            f_num_active_vals,
                            f_att_effective_balance_eth,
                            f_total_effective_balance_eth,
                            f_missing_source,
                            f_missing_target,
                            f_missing_head
                        FROM
                            t_epoch_metrics_summary
                        WHERE
                            f_epoch = ${id}
                    `,
                format: 'JSONEachRow',
            }),
            clickhouseClient.query({
                query: `
                        SELECT
                            COUNT(*) AS proposed_blocks
                        FROM
                            t_proposer_duties
                        WHERE
                            CAST((f_proposer_slot / 32) AS UInt64) = ${id} AND f_proposed = 1
                    `,
                format: 'JSONEachRow',
            }),
            clickhouseClient.query({
                query: `
                        SELECT
                            SUM(f_amount) AS total_withdrawals
                        FROM
                            t_withdrawals
                        WHERE
                            CAST((f_slot / 32) AS UInt64) = ${id}
                    `,
                format: 'JSONEachRow',
            }),
        ]);
        const epochStatsResult = yield epochStatsResultSet.json();
        const blocksProposedResult = yield blocksProposedResultSet.json();
        const withdrawalsResult = yield withdrawalsResultSet.json();
        res.json({
            epoch: Object.assign(Object.assign(Object.assign({}, epochStatsResult[0]), blocksProposedResult[0]), { withdrawals: withdrawalsResult[0].total_withdrawals }),
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server',
        });
    }
});
exports.getEpochById = getEpochById;
const getSlotsByEpoch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { network } = req.query;
        const clickhouseClient = db_1.clickhouseClients[network];
        const [slotsEpochResultSet, withdrawalsResultSet] = yield Promise.all([
            clickhouseClient.query({
                query: `
                        SELECT
                            pd.f_val_idx,
                            pd.f_proposer_slot,
                            pd.f_proposed,
                            pk.f_pool_name
                        FROM
                            t_proposer_duties pd
                        LEFT OUTER JOIN
                            t_eth2_pubkeys pk ON pd.f_val_idx = pk.f_val_idx
                        WHERE
                            CAST((pd.f_proposer_slot / 32) AS UInt64) = ${id}
                        ORDER BY
                            pd.f_proposer_slot DESC
                    `,
                format: 'JSONEachRow',
            }),
            clickhouseClient.query({
                query: `
                        SELECT
                            f_slot,
                            f_amount
                        FROM
                            t_withdrawals
                        WHERE
                            CAST((f_slot / 32) AS UInt64) = ${id}
                    `,
                format: 'JSONEachRow',
            }),
        ]);
        const slotsEpochResult = yield slotsEpochResultSet.json();
        const withdrawalsResult = yield withdrawalsResultSet.json();
        const slots = slotsEpochResult.map((slot) => (Object.assign(Object.assign({}, slot), { withdrawals: withdrawalsResult
                .filter((withdrawal) => withdrawal.f_slot === slot.f_proposer_slot)
                .reduce((acc, withdrawal) => acc + Number(withdrawal.f_amount), 0) })));
        res.json({
            slots,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server',
        });
    }
});
exports.getSlotsByEpoch = getSlotsByEpoch;
const listenEpochNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
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
        const genesisTime = Number(blockGenesisResult[0].f_genesis_time) * 1000;
        const nextEpoch = Math.floor((Date.now() - genesisTime) / 12000 / 32) - 1;
        const newEpochEstimatedTime = genesisTime + (nextEpoch + 2) * 12000 * 32 + 4000;
        yield new Promise(resolve => setTimeout(resolve, newEpochEstimatedTime - Date.now()));
        let latestEpochInserted = 0;
        let currentTimeout = 1000;
        do {
            if (latestEpochInserted > 0) {
                yield new Promise(resolve => setTimeout(resolve, currentTimeout));
                currentTimeout *= 1.5;
            }
            const latestEpochResultSet = yield chClient.query({
                query: `
                    SELECT
                        f_epoch
                    FROM
                        t_epoch_metrics_summary
                    ORDER BY
                        f_epoch DESC
                    LIMIT 1
                `,
                format: 'JSONEachRow',
            });
            const latestEpochResult = yield latestEpochResultSet.json();
            latestEpochInserted = (_b = (_a = latestEpochResult[0]) === null || _a === void 0 ? void 0 : _a.f_epoch) !== null && _b !== void 0 ? _b : 0;
        } while (latestEpochInserted < nextEpoch);
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        });
        res.write('event: new_epoch\n');
        res.write(`data: Epoch ${nextEpoch}`);
        res.write('\n\n');
        res.end();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server',
        });
    }
});
exports.listenEpochNotification = listenEpochNotification;
//# sourceMappingURL=epochs.js.map