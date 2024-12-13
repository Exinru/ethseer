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
exports.getEntities = exports.getEntity = void 0;
const db_1 = require("../config/db");
const getEntity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.params;
        const { network, numberEpochs = 225 } = req.query;
        const chClient = db_1.clickhouseClients[network];
        const [entityStatsResultSet, blocksProposedResultSet, entityPerformanceResultSet] = yield Promise.all([
            chClient.query({
                query: `
                        SELECT SUM(f_balance_eth) AS aggregate_balance,
                            COUNT(CASE vls.f_status WHEN 0 THEN 1 ELSE null END) AS deposited,
                            COUNT(CASE vls.f_status WHEN 1 THEN 1 ELSE null END) AS active,
                            COUNT(CASE vls.f_status WHEN 2 THEN 1 ELSE null END) AS exited,
                            COUNT(CASE vls.f_status WHEN 3 THEN 1 ELSE null END) AS slashed
                        FROM
                            t_validator_last_status vls
                        INNER JOIN
                            t_eth2_pubkeys pk ON (vls.f_val_idx = pk.f_val_idx) AND (LOWER(pk.f_pool_name) = '${name.toLowerCase()}')
                    `,
                format: 'JSONEachRow',
            }),
            chClient.query({
                query: `
                        SELECT
                            COUNT(CASE pd.f_proposed WHEN true THEN 1 ELSE null END) AS f_proposed,
                            COUNT(CASE pd.f_proposed WHEN false THEN 1 ELSE null END) AS f_missed
                        FROM
                            t_proposer_duties pd
                        INNER JOIN
                            t_eth2_pubkeys pk ON (pd.f_val_idx = pk.f_val_idx) AND (LOWER(pk.f_pool_name) = '${name.toLowerCase()}')
                    `,
                format: 'JSONEachRow',
            }),
            chClient.query({
                query: `
                        SELECT
                            SUM(toInt64(aggregated_rewards)) AS aggregated_rewards,
                            SUM(aggregated_max_rewards) AS aggregated_max_rewards,
                            SUM(count_sync_committee) AS count_sync_committee,
                            SUM(count_missing_source) AS count_missing_source,
                            SUM(count_missing_target) AS count_missing_target,
                            SUM(count_missing_head) AS count_missing_head,
                            SUM(count_expected_attestations) AS count_expected_attestations,
                            SUM(proposed_blocks_performance) AS proposed_blocks_performance,
                            SUM(missed_blocks_performance) AS missed_blocks_performance,
                            SUM(number_active_vals) AS number_active_vals
                        FROM (
                            SELECT *
                            FROM t_pool_summary
                            WHERE LOWER(f_pool_name) = '${name.toLowerCase()}'
                            ORDER BY f_epoch DESC
                            LIMIT ${Number(numberEpochs)}
                        ) AS subquery;
                    `,
                format: 'JSONEachRow',
            }),
        ]);
        const entityStatsResult = yield entityStatsResultSet.json();
        const blocksProposedResult = yield blocksProposedResultSet.json();
        const entityPerformanceResult = yield entityPerformanceResultSet.json();
        let entity = null;
        if (entityStatsResult[0]) {
            entity = Object.assign(Object.assign(Object.assign({}, entityStatsResult[0]), { proposed_blocks: blocksProposedResult[0] }), entityPerformanceResult[0]);
        }
        res.json({
            entity,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server',
        });
    }
});
exports.getEntity = getEntity;
const getEntities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { network } = req.query;
        const chClient = db_1.clickhouseClients[network];
        const [entitiesResultSet, countResultSet] = yield Promise.all([
            chClient.query({
                query: `
                        SELECT
                            COUNT(CASE vls.f_status WHEN 1 THEN 1 ELSE null END) AS act_number_validators,
                            pk.f_pool_name
                        FROM
                            t_validator_last_status vls
                        LEFT OUTER JOIN
                            t_eth2_pubkeys pk ON (vls.f_val_idx = pk.f_val_idx)
                        GROUP BY pk.f_pool_name
                    `,
                format: 'JSONEachRow',
            }),
            chClient.query({
                query: `
                        SELECT COUNT(DISTINCT(f_pool_name)) AS count
                        FROM t_eth2_pubkeys
                    `,
                format: 'JSONEachRow',
            }),
        ]);
        const entitiesResult = yield entitiesResultSet.json();
        const countResult = yield countResultSet.json();
        res.json({
            entities: entitiesResult,
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
exports.getEntities = getEntities;
//# sourceMappingURL=entities.js.map