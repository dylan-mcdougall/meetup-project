const express = require('express');
const bcrypt = require('bcryptjs');
const { requireAuth } = require('../../utils/auth');
const { validateVenueBody } = require('../../utils/validation');

const { User, Event, Venue, Membership, Group, Image, Attendance } = require('../../db/models');

const router = express.Router();

router.put('/:venueId', requireAuth, validateVenueBody, async (req, res, next) => {
    const { address, city, state, lat, lng } = req.body;

    let currVenue = await Venue.findOne({
        where: { id: req.params.venueId }
    });
    if (!currVenue) {
        return res.status(404).json({
            message: "Venue couldn't be found"
        })
    }

    const currGroup = await Group.findOne({
        where: { id: currVenue.groupId }
    });

    const user = await Membership.findOne({
        where: { memberId: req.user.id, groupId: currGroup.id }
    });
    if (!user) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }
    if (user && (currGroup.organizerId !== req.user.id && (user.status !== 'co-host' && user.status !== 'host'))) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    await Venue.update({
        address,
        city,
        state,
        lat,
        lng,
    }, {
        where: { id: req.params.venueId }
    });

    currVenue = await Venue.findOne({
        where: { id: req.params.venueId },
        attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
    });

    return res.json(currVenue);
})

module.exports = router;
