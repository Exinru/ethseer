"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const slashedValidators_1 = require("../controllers/slashedValidators");
const network_validator_1 = require("../helpers/network-validator");
const router = (0, express_1.Router)();
router.get('/', [
    (0, express_validator_1.query)('network').not().isEmpty(),
    (0, express_validator_1.query)('network').custom(network_validator_1.existsNetwork),
], slashedValidators_1.getSlashedVals);
exports.default = router;
//# sourceMappingURL=slashedValidators.js.map