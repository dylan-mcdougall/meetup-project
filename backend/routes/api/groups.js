const express = require('express');
const bcrypt = require('bcryptjs');

const { User, Event, Venue, Membership, Group, Image } = require('../../db/models');

const router = express.Router();

router.get('/', async (req, res, next) => {
    const groups = await Group.findAll();

    for (let i = 0; i < groups.length; i++) {
        let currGroup = groups[i];
        let numMembers = await Membership.findAll({
            where: { groupId: currGroup.id, status: 'Member' }
        })
        groups[i].dataValues.numMembers = numMembers.length;
        let previewImage = await Image.findOne({ where: { imageableId: currGroup.id, imageableType: 'Group', preview: true } });
        groups[i].dataValues.previewImage = previewImage.imageUrl;
    }

    res.json(groups);
})

module.exports = router;
