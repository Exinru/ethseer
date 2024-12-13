"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const slots_1 = require("../controllers/slots");
const check_fields_1 = require("../middlewares/check-fields");
const network_validator_1 = require("../helpers/network-validator");
const router = (0, express_1.Router)();
router.get('/', [
    (0, express_validator_1.query)('network').not().isEmpty(),
    (0, express_validator_1.query)('network').custom(network_validator_1.existsNetwork),
    (0, express_validator_1.query)('page').optional().isInt({ min: 0, max: 2147483647 }),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 0, max: 100 }),
    (0, express_validator_1.query)('epoch').optional().isInt({ min: 0, max: 2147483647 }),
    (0, express_validator_1.query)('lowerEpoch').optional().isInt({ min: 0, max: 2147483647 }),
    (0, express_validator_1.query)('upperEpoch').optional().isInt({ min: 0, max: 2147483647 }),
    (0, express_validator_1.query)('validator').optional().isInt({ min: 0, max: 2147483647 }),
    (0, express_validator_1.query)('lowerDate').optional().isISO8601(),
    (0, express_validator_1.query)('upperDate').optional().isISO8601(),
    (0, express_validator_1.query)('entities').optional().isArray(),
    (0, express_validator_1.query)('clients').optional().isArray(),
    check_fields_1.checkFields,
], slots_1.getSlots);
router.get('/blocks', [
    (0, express_validator_1.query)('network').not().isEmpty(),
    (0, express_validator_1.query)('network').custom(network_validator_1.existsNetwork),
    check_fields_1.checkFields,
], slots_1.getBlocks);
router.get('/new-slot-notification', [
    (0, express_validator_1.query)('network').not().isEmpty(),
    (0, express_validator_1.query)('network').custom(network_validator_1.existsNetwork),
    check_fields_1.checkFields,
], slots_1.listenSlotNotification);
router.get('/:id', [
    (0, express_validator_1.check)('id').isInt({ min: 0, max: 2147483647 }),
    (0, express_validator_1.query)('network').not().isEmpty(),
    (0, express_validator_1.query)('network').custom(network_validator_1.existsNetwork),
    check_fields_1.checkFields,
], slots_1.getSlotById);
router.get('/graffiti/:search', [
    (0, express_validator_1.query)('network').not().isEmpty(),
    (0, express_validator_1.query)('network').custom(network_validator_1.existsNetwork),
    check_fields_1.checkFields,
], slots_1.getSlotsByGraffiti);
router.get('/:id/withdrawals', [
    (0, express_validator_1.check)('id').isInt({ min: 0, max: 2147483647 }),
    (0, express_validator_1.query)('network').not().isEmpty(),
    (0, express_validator_1.query)('network').custom(network_validator_1.existsNetwork),
    check_fields_1.checkFields,
], slots_1.getWithdrawalsBySlot);
exports.default = router;
//# sourceMappingURL=slots.js.map