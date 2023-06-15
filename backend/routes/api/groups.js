const express = require('express');
const bcrypt = require('bcryptjs');
const { requireAuth } = require('../../utils/auth');

const { User, Event, Venue, Membership, Group, Image } = require('../../db/models');

const router = express.Router();

router.post('/:groupId/images', requireAuth, async (req, res, next) => {
    const { url, preview } = req.body;
    if (preview === 'true') preview = true;
    else if (preview === 'false') preview = false;

    const currGroup = await Group.findByPk(req.params.groupId);

    if (!currGroup) {
        return res.status(404).json({
            message: "Group couldn't be found"
        })
    }
    if (currGroup.organizerId !== req.user.id) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }
    await Image.create({
        url,
        preview,
        imageableId: currGroup.id,
        imageableType: 'Group'
    });
    const payload = await Image.findOne({
        where: { url: url },
        attributes: ['id', 'url', 'preview']
    });
    return res.json(payload);
})

router.get('/:groupId/venues', requireAuth, async (req, res, next) => {
    const currGroup = await Group.findByPk(req.params.groupId);

    const user = await Membership.findOne({
        where: { userId: req.user.id, groupId: req.params.groupId }
    })

    if (!currGroup) {
        return res.status(404).json({
            message: "Group couldn't be found"
        })
    }
    if (currGroup.organizerId !== req.user.id && user.status !== 'co-host') {
        return res.status(403).json({
            message: "Forbidden"
        })
    }
    const payload = await Venue.findAll({
        where: { groupId: req.params.groupId },
        attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
    });

    return res.json(payload);
});

router.post('/:groupId/venues', requireAuth, async (req, res, next) => {
    const { address, city, state, lat, lng } = req.body;

    const currGroup = await Group.findByPk(req.params.groupId);

    const user = await Membership.findOne({
        where: { userId: req.user.id, groupId: req.params.groupId }
    })

    if (!currGroup) {
        return res.status(404).json({
            message: "Group couldn't be found"
        })
    }
    if (currGroup.organizerId !== req.user.id && user.status !== 'co-host') {
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    await Venue.create({
        groupId: req.params.groupId,
        address,
        city,
        state,
        lat,
        lng
    });

    const payload = await Venue.findOne({
        where: { lat: lat, lng: lng }
    });

    res.json(payload);
})

router.put('/:groupId', requireAuth, async (req, res, next) => {
    let { name, about, type, private, city, state } = req.body;

    if (private === 'true') private = true;
    if (private === 'false') private = false;

    let currGroup = await Group.findByPk(req.params.groupId);

    if (!currGroup) {
        return res.status(404).json({
            message: "Group couldn't be found"
        })
    }
    if (currGroup.organizerId !== req.user.id) {
        return res.status(403).json({
            message: 'Forbidden'
        })
    }
    else {
        await currGroup.update({
            name,
            about,
            type,
            private,
            city,
            state
        });
        currGroup = await Group.findByPk(req.params.groupId);
        return res.json(currGroup);
    }
});

router.delete('/:groupId', requireAuth, async (req, res, next) => {
    let currGroup = await Group.findByPk(req.params.groupId);

    if (!currGroup) {
        return res.status(404).json({
            message: "Group couldn't be found"
        })
    }
    if (currGroup.organizerId !== req.user.id) {
        return res.status(403).json({
            message: 'Forbidden'
        })
    } else {
        await Group.destroy({
            where: { id: req.params.groupId }
        });
        return res.json({
            message: "Successfully deleted"
        })
    }
})

router.get('/:groupId', async (req, res, next) => {
    const payload = await Group.findOne({
        where: { id: req.params.groupId },
        include: [{
            model: Image, as: 'GroupImages', attributes: ['id', 'url', 'preview']
        },
        { 
            model: User, as: 'Organizer', attributes: ['id', 'firstName', 'lastName'] 
        },
        {
            model: Venue, attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
        }]
    })
    
    if (!payload) {
        res.status(404).json({
            message: "Group couldn't be found"
        })
    } else res.json(payload);
})

router.post('/', requireAuth, async (req, res, next) => {
    const { name, about, type, private, city, state } = req.body;
    Group.create({
        organizerId: req.user.id,
        name,
        about,
        type,
        private,
        city,
        state
    });

    const payload = await Group.findOne({
        where: { name: name, about: about }
    });

    res.status(201).json(payload);
})

router.get('/', async (req, res, next) => {
    const groups = await Group.findAll();

    for (let i = 0; i < groups.length; i++) {
        let currGroup = groups[i];
        let numMembers = await Membership.findAll({
            where: { groupId: currGroup.id, status: 'Member' }
        })
        groups[i].dataValues.numMembers = numMembers.length;
        let previewImage = await Image.findOne({ where: { imageableId: currGroup.id, imageableType: 'Group', preview: true } });
        groups[i].dataValues.previewImage = previewImage.url;
    }

    return res.json(groups);
})

module.exports = router;
