"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const check_fields_1 = require("../middlewares/check-fields");
const network_validator_1 = require("../helpers/network-validator");
const networks_1 = require("../controllers/networks");
const router = (0, express_1.Router)();
router.get('/block/genesis', [
    (0, express_validator_1.query)('network').not().isEmpty(),
    (0, express_validator_1.query)('network').custom(network_validator_1.existsNetwork),
    check_fields_1.checkFields,
], networks_1.getBlockGenesis);
router.get('/', [
    check_fields_1.checkFields,
], networks_1.getNetworks);
exports.default = router;
//# sourceMappingURL=networks.js.map