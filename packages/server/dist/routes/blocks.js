"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const blocks_1 = require("../controllers/blocks");
const check_fields_1 = require("../middlewares/check-fields");
const network_validator_1 = require("../helpers/network-validator");
const router = (0, express_1.Router)();
router.get('/latest', [
    (0, express_validator_1.query)('network').not().isEmpty(),
    (0, express_validator_1.query)('network').custom(network_validator_1.existsNetwork),
    check_fields_1.checkFields,
], blocks_1.getLatestBlock);
router.get('/:id', [
    (0, express_validator_1.check)('id').isInt({ min: 0, max: 2147483647 }),
    (0, express_validator_1.query)('network').not().isEmpty(),
    (0, express_validator_1.query)('network').custom(network_validator_1.existsNetwork),
    check_fields_1.checkFields,
], blocks_1.getBlockById);
router.get('/:id/transactions', [
    (0, express_validator_1.check)('id').isInt({ min: 0, max: 2147483647 }),
    (0, express_validator_1.query)('network').not().isEmpty(),
    (0, express_validator_1.query)('network').custom(network_validator_1.existsNetwork),
    check_fields_1.checkFields,
], blocks_1.getTransactionsByBlock);
router.get('/', [
    (0, express_validator_1.query)('network').not().isEmpty(),
    (0, express_validator_1.query)('network').custom(network_validator_1.existsNetwork),
    check_fields_1.checkFields,
], blocks_1.getBlocks);
exports.default = router;
//# sourceMappingURL=blocks.js.map