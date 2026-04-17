const express = require('express');
const router = express.Router();
const { runMigration } = require('../controllers/migrateController');

router.get('/', runMigration);

module.exports = router;
