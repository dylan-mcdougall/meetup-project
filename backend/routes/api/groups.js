const express = require('express');
const bcrypt = require('bcryptjs');
const { requireAuth } = require('../../utils/auth');
const { Op } = require('sequelize');
const { handleValidationErrors, validateGroupBody, validateEventBody, validateVenueBody } = require('../../utils/validation');


const { User, Event, Venue, Membership, Group, Image, Attendance } = require('../../db/models');

const router = express.Router();

router.delete('/:groupId/images/:imageId', requireAuth, async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId);
    const membership = await Membership.findOne({
        where: { memberId: req.user.id, groupId: req.params.groupId }
    });
    if (req.user.id !== group.organizerId && membership.status !== 'co-host' || !membership) {
        return res.status(403).json({
            message: "Forbidden"
        });
    }

    const image = await Image.findOne({
        where: { id: req.params.imageId, imageableId: req.params.groupId, imageableType: 'Group'}
    });
    if (!image) {
        return res.status(404).json({
            message: "Group Image  couldn't be found"
        });
    }

    await Image.destroy({
        where: { id: req.params.imageId, imageableType: 'Group' }
    });

    return res.json({
        message: "Successfully deleted"
    });
});

router.delete('/:groupId/members/:memberId', requireAuth, async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId);
    if (!group) {
        return res.status(404).json({
            message: "Group couldn't be found"
        });
    }
    
    const user = await User.findByPk(req.body.memberId);
    if (!user) {
        return res.status(400).json({
            message: "Validation error",
            errors: {
                memberId: "User couldn't be found"
            }
        })
    }

    const membership = await Membership.findOne({
        where: { memberId: req.body.memberId, groupId: req.params.groupId }
    });
    if (!membership) {
        return res.status(404).json({
            message: "Membership between the user and the group does not exist"
        })
    }

    if (req.user.id !== group.organizerId && req.user.id !== req.body.memberId) {
        return res.status(403).json({
            message: "Forbidden"
        });
    }

    await Membership.destroy({
        where: { memberId: req.body.memberId, groupId: req.params.groupId }
    });

    return res.json({
        message: "Successfully deleted membership from group"
    })
})

router.patch('/:groupId/members/:memberId', requireAuth, async (req, res, next) => {
    const { memberId, status } = req.body;
    
    const group = await Group.findByPk(req.params.groupId);
    if (!group) {
        return res.status(404).json({
            message: "Group couldn't be found"
        });
    }
    
    const user = await User.findByPk(req.body.memberId);
    if (!user) {
        return res.status(400).json({
            message: "Validation error",
            errors: {
                memberId: "User couldn't be found"
            }
        })
    }

    const membership = await Membership.findOne({
        where: { memberId: req.body.memberId, groupId: req.params.groupId }
    });
    if (!membership) {
        return res.status(404).json({
            message: "Membership between the user and the group does not exist"
        })
    }

    if (req.body.status === "pending") {
        return res.status(400).json({
            message: "Validations Error",
            errors: {
                status: "Cannot change a membership status to pending"
            }
        })
    }

    if (req.body.status === "co-host" && group.organizerId !== req.user.id) {
        return res.status(403).json({
            message: "Forbidden"
        });
    }

    if (group.organizerId !== req.user.id && membership.status !== "co-host") {
        return res.status(403).json({
            message: "Forbidden"
        });
    }

    await Membership.update({
        memberId: memberId,
        status: status
    }, {
        where: { memberId: req.params.memberId, groupId: req.params.groupId }
    });

    const payload = await Membership.findOne({
        where: { memberId: req.params.memberId, groupId: req.params.groupId },
        attributes: ['id', 'groupId', 'userId', 'status']
    });

    return res.json(payload);
})

router.post('/:groupId/members', requireAuth, async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId);
    if (!group) {
        return res.status(404).json({
            message: "Group couldn't be found"
        });
    }

    const membership = await Membership.findOne({
        where: { memberId: req.user.id, groupId: req.params.groupId }
    });
    if (membership) {
        if (membership.status === 'member' || membership.status === 'host' || membership.status === 'co-host') {
            return res.status(400).json({
                message: "User is already a member of this group"
            });
        }
        if (membership.status === 'pending') {
            return res.status(400).json({
                message: "Membership has already been requested"
            });
        }
    }
    await Membership.create({
        memberId: req.user.id,
        groupId: req.params.groupId,
        status: 'pending'
    });

    const payload = await Membership.findOne({
        where: { memberId: req.user.id, groupId: req.params.groupId },
        attributes: ['memberId', 'status']
    });

    return res.json(payload);
})

router.get('/:groupId/members', async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId);
    if (!group) {
        return res.status(404).json({
            message: "Group couldn't be found"
        });
    }

    const payload = {};
    payload.Members = [];

    if (req.user.id === group.organizerId) {
        const memberships = await Membership.findAll({
            where: { groupId: req.params.groupId }
        });

        for (let i = 0; i < memberships.length; i++) {
            let user = await User.findOne({
                where: { id: memberships[i].memberId },
                attributes: ['id', 'firstName', 'lastName']
            });
            user.dataValues.Membership = { status: memberships[i].status };
            payload.Members.push(user);
        }
        
        return res.json(payload);
    } else {
        const memberships = await Membership.findAll({
            where: { groupId: req.params.groupId, status: { [Op.in]: ['member', 'host', 'co-host'] } }
        });

        for (let i = 0; i < memberships.length; i++) {
            let user = await User.findOne({
                where: { id: memberships[i].memberId },
                attributes: ['id', 'firstName', 'lastName']
            });
            user.dataValues.Membership = { status: memberships[i].status };
            payload.Members.push(user);
        }
        
        return res.json(payload);
    }
});

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
});

router.post('/:groupId/events', requireAuth, validateEventBody, async (req, res, next) => {
    const currGroup = await Group.findByPk(req.params.groupId);

    const user = await Membership.findOne({
        where: { memberId: req.user.id, groupId: req.params.groupId }
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

    let { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
    
    await Event.create({
        groupId: req.params.groupId,
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate
    });

    const payload = await Event.findOne({
        where: { name: name, description: description, startDate: startDate, endDate: endDate },
        attributes: ['id', 'groupId', 'venueId', 'name', 'type', 'capacity', 'price', 'description', 'startDate', 'endDate']
    });

    return res.json(payload);
})

router.get('/:groupId/events', async (req, res, next) => {
    let group = await Group.findByPk(req.params.groupId);

    const payload = {
        Events: []
    }

    if (!group) {
        return res.status(404).json({
            message: "Group couldn't be found"
        })
    }

    const events = await Event.findAll({
        where: { groupId: req.params.groupId },
        attributes: ['id', 'groupId', 'venueId', 'name', 'type', 'startDate', 'endDate']
    });
    for (let i = 0; i < events.length; i++) {
        const numAttending = await Attendance.findAll({
                where: { eventId: events[i].id, status: { [Op.in]: ['attending', 'host', 'co-host'] } }
            });

        events[i].dataValues.numAttending = numAttending.length;

        const previewUrl = await Image.findOne({
            where: { imageableId: events[i].id, imageableType: 'Event', preview: true }
        });

        if (previewUrl) {
            events[i].dataValues.previewImage = previewUrl.url;
        }

        events[i].dataValues.Group = await Group.findOne({
            where: { id: req.params.groupId },
            attributes: ['id', 'name', 'city', 'state']
        });

        if (events[i].venueId === null) {
            events[i].dataValues.Venue = null;
        } else {
            let venue = await Venue.findOne({ 
                where: { id: events[i].venueId },
                attributes: ['id', 'city', 'state'] 
            });
            events[i].dataValues.Venue = venue;
        }
        payload.Events.push(events[i])
    }

    return res.json(payload);
});

router.get('/:groupId/venues', requireAuth, async (req, res, next) => {
    const currGroup = await Group.findByPk(req.params.groupId);

    const payload = {
        Venues: []
    }

    const user = await Membership.findOne({
        where: { memberId: req.user.id, groupId: req.params.groupId }
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
    let data = await Venue.findAll({
        where: { groupId: req.params.groupId },
        attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
    });

    for (let i = 0; i < data.length; i++) {
        payload.Venues.push(data[i])
    }

    return res.json(payload);
});

router.post('/:groupId/venues', requireAuth, validateVenueBody, async (req, res, next) => {
    const { address, city, state, lat, lng } = req.body;

    const currGroup = await Group.findByPk(req.params.groupId);

    const user = await Membership.findOne({
        where: { memberId: req.user.id, groupId: req.params.groupId }
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

    return res.json(payload);
})

router.put('/:groupId', requireAuth, validateGroupBody, async (req, res, next) => {
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
    });

    if (!payload) {
        return res.status(404).json({
            message: "Group couldn't be found"
        })
    } 

    let numMembers = await Membership.findAll({
        where: { groupId: payload.id, status: { [Op.in]: ['member', 'host', 'co-host'] } }
    })
    payload.dataValues.numMembers = numMembers.length;
    
    return res.json(payload);
})

router.post('/', requireAuth, validateGroupBody, async (req, res, next) => {
    const { name, about, type, private, city, state } = req.body;
    await Group.create({
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

    return res.status(201).json(payload);
});

router.get('/', async (req, res, next) => {
    const groups = await Group.findAll();
    const payload = {
        Groups: []
    }

    for (let i = 0; i < groups.length; i++) {
        let currGroup = groups[i];
        let numMembers = await Membership.findAll({
            where: { groupId: currGroup.id, status: { [Op.in]: ['member', 'host', 'co-host'] } }
        })
        groups[i].dataValues.numMembers = numMembers.length;
        let previewImage = await Image.findOne({ where: { imageableId: currGroup.id, imageableType: 'Group', preview: true } });
        groups[i].dataValues.previewImage = previewImage.url;
        payload.Groups.push(groups[i]);
    }

    return res.json(payload);
})

module.exports = router;
