"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validators_1 = require("../controllers/validators");
const check_fields_1 = require("../middlewares/check-fields");
const network_validator_1 = require("../helpers/network-validator");
const router = (0, express_1.Router)();
router.get('/count-active-validators', [
    (0, express_validator_1.query)('network').not().isEmpty(),
    (0, express_validator_1.query)('network').custom(network_validator_1.existsNetwork),
    check_fields_1.checkFields,
], validators_1.getCountActiveValidators);
router.get('/', [
    (0, express_validator_1.query)('network').not().isEmpty(),
    (0, express_validator_1.query)('network').custom(network_validator_1.existsNetwork),
    check_fields_1.checkFields,
], validators_1.getValidators);
router.get('/:id', [
    (0, express_validator_1.check)('id').isInt({ min: 0, max: 2147483647 }),
    (0, express_validator_1.query)('network').not().isEmpty(),
    (0, express_validator_1.query)('network').custom(network_validator_1.existsNetwork),
    check_fields_1.checkFields,
], validators_1.getValidatorById);
router.get('/:id/proposed-blocks', [
    (0, express_validator_1.check)('id').isInt({ min: 0, max: 2147483647 }),
    (0, express_validator_1.query)('network').not().isEmpty(),
    (0, express_validator_1.query)('network').custom(network_validator_1.existsNetwork),
    check_fields_1.checkFields,
], validators_1.getProposedBlocksByValidator);
router.get('/:id/withdrawals', [
    (0, express_validator_1.check)('id').isInt({ min: 0, max: 2147483647 }),
    (0, express_validator_1.query)('network').not().isEmpty(),
    (0, express_validator_1.query)('network').custom(network_validator_1.existsNetwork),
    check_fields_1.checkFields,
], validators_1.getWithdrawalsByValidator);
exports.default = router;
//# sourceMappingURL=validators.js.map