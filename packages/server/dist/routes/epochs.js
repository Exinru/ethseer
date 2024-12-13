"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const epochs_1 = require("../controllers/epochs");
const check_fields_1 = require("../middlewares/check-fields");
const network_validator_1 = require("../helpers/network-validator");
const router = (0, express_1.Router)();
router.get('/', [
    (0, express_validator_1.query)('network').not().isEmpty(),
    (0, express_validator_1.query)('network').custom(network_validator_1.existsNetwork),
    check_fields_1.checkFields,
], epochs_1.getEpochsStatistics);
router.get('/new-epoch-notification', [
    (0, express_validator_1.query)('network').not().isEmpty(),
    (0, express_validator_1.query)('network').custom(network_validator_1.existsNetwork),
    check_fields_1.checkFields,
], epochs_1.listenEpochNotification);
router.get('/:id', [
    (0, express_validator_1.check)('id').isInt({ min: 0, max: 2147483647 }),
    (0, express_validator_1.query)('network').not().isEmpty(),
    (0, express_validator_1.query)('network').custom(network_validator_1.existsNetwork),
    check_fields_1.checkFields,
], epochs_1.getEpochById);
router.get('/:id/slots', [
    (0, express_validator_1.check)('id').isInt({ min: 0, max: 2147483647 }),
    (0, express_validator_1.query)('network').not().isEmpty(),
    (0, express_validator_1.query)('network').custom(network_validator_1.existsNetwork),
    check_fields_1.checkFields,
], epochs_1.getSlotsByEpoch);
exports.default = router;
//# sourceMappingURL=epochs.js.map