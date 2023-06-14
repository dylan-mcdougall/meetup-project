const express = require('express');
const bcrypt = require('bcryptjs');

const { User, Event, Venue, Membership, Group } = require('../../db/models');

const router = express.Router();

router.get('/', async (req, res, next) => {
    const groups = await Group.findAll();

    res.json(groups);
})

module.exports = router;
