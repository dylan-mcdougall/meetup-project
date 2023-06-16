const express = require('express');
const bcrypt = require('bcryptjs');
const { requireAuth } = require('../../utils/auth');

const { User, Event, Venue, Membership, Group, Image, Attendance } = require('../../db/models');

const router = express.Router();

router.post('/:eventId/images', requireAuth, async (req, res, next) => {
    const currEvent = await Event.findByPk(req.params.eventId);

    if (!currEvent) {
        return res.status(404).json({
            message: "Event couldn't be found"
        });
    }

    const user = await Attendance.findOne({
        where: { userId: req.user.id, eventId: req.params.eventId }
    });

    if (user.status !== 'Attending' && user.status !== 'Host' && user.status !== 'Co-host') {
        return res.status(403).json({
            message: "Forbidden"
        });
    } else {
        const { url, preview } = req.body;
        if (preview === 'true') preview = true;
        else if (preview === 'false') preview = false;

        await Image.create({
            url,
            preview,
            imageableId: req.params.eventId,
            imageableType: 'Event'
        });

        const payload = await Image.findOne({
            where: { url: url },
            attributes: ['id', 'url', 'preview']
        });
        return res.json(payload);
    }
});

router.put('/:eventId', requireAuth, async (req, res, next) => {
    const currEvent = await Event.findByPk(req.params.eventId);

    if (!currEvent) {
        return res.status(404).json({
            message: "Event couldn't be found"
        });
    }

    const group = await Group.findByPk(currEvent.groupId);

    const user = await Membership.findOne({
        where: { userId: req.user.id, groupId: currEvent.groupId }
    });

    if (user.userId !== group.organizerId && user.status !== 'co-host') {
        return res.status(403).json({
            message: "Forbidden"
        });
    }

    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body; 

    const venue = await Venue.findByPk(venueId);
    console.log(venue);
    if (!venue) {
        return res.status(404).json({
            message: "Venue couldn't be found"
        })
    }

    await Event.update({
        venueId: venueId,
        name: name,
        type: type,
        capacity: capacity,
        price: price,
        description: description,
        startDate: startDate,
        endDate: endDate
    }, {
        where: { id: req.params.eventId }
    });

    const payload = await Event.findOne({
        where: { id: req.params.eventId },
        attributes: ['id', 'groupId', 'venueId', 'name', 'type', 'capacity', 'price', 'description', 'startDate', 'endDate']
    });

    return res.json(payload)
});

router.delete('/:eventId', requireAuth, async (req, res ,next) => {
    const currEvent = await Event.findByPk(req.params.eventId);
    if (!currEvent) {
        return res.status(404).json({
            message: "Event couldn't be found"
        });
    }

    const group = await Group.findByPk(currEvent.groupId);
    const user = await Membership.findOne({
        where: { userId: req.user.id, groupId: currEvent.groupId }
    });
    if (user.userId !== group.organizerId && user.status !== 'co-host') {
        return res.status(403).json({
            message: "Forbidden"
        });
    }

    await Event.destroy({
        where: { id: req.params.eventId }
    });

    return res.json({
        message: "Successfully deleted"
    })
})

router.get('/:eventId', async (req, res, next) => {
    const event = await Event.findOne({
        where: { id: req.params.eventId },
        attributes: ['id', 'groupId', 'venueId', 'name', 'description', 'type', 'capacity', 'price', 'startDate', 'endDate'],
        include: { model: Image, as: 'EventImages', attributes: ['id', 'url', 'preview'] }
    });

    if (!event) {
        return res.status(404).json({
            message: "Event couldn't be found"
        })
    }

    const numAttending = await Attendance.findAll({
        where: { eventId: req.params.eventId, status: 'Attending' } 
    });

    event.dataValues.numAttending = numAttending.length;

    event.dataValues.Group = await Group.findOne({
        where: { id: event.groupId },
        attributes: ['id', 'name', 'private', 'city', 'state']
    });

    if (event.venueId === null) {
        event.dataValues.Venue = null;
    } else {
        event.dataValues.Venue = await Venue.findOne({ 
            where: { id: event.venueId },
            attributes: ['id', 'address', 'city', 'state', 'lat', 'lng'] 
        });
    }

    return res.json(event);
})


router.get('/', async (req, res, next) => {
    const events = await Event.findAll({
        attributes: ['id', 'groupId', 'venueId', 'name', 'type', 'startDate', 'endDate']
    });

    for (let i = 0; i < events.length; i++) {
        console.log(events[i]);
        const groupId = events[i].groupId;

        const numAttending = await Attendance.findAll({
                where: { eventId: events[i].id, status: 'Attending' }
            });

        events[i].dataValues.numAttending = numAttending.length;

        const previewUrl = await Image.findOne({
            where: { imageableId: events[i].id, imageableType: 'Event', preview: true }
        });

        events[i].dataValues.previewImage = previewUrl.url;

        events[i].dataValues.Group = await Group.findOne({
            where: { id: groupId },
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
    }

    console.log(events);
    return res.json(events);
})

module.exports = router;
