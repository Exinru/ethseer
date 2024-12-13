"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const entitiesList_1 = require("../controllers/entitiesList");
const network_validator_1 = require("../helpers/network-validator");
const router = (0, express_1.Router)();
router.get('/', [
    (0, express_validator_1.query)('network').not().isEmpty(),
    (0, express_validator_1.query)('network').custom(network_validator_1.existsNetwork),
], entitiesList_1.getEntityList);
exports.default = router;
//# sourceMappingURL=entitiesList.js.map