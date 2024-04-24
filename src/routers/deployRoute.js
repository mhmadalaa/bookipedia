const express = require('express');
const { getDeploy, postDeploy } = require('../config/serverAutoDeploy');
const router = express.Router();

router.route('/').get(getDeploy).post(postDeploy);

module.exports = router; 