import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroupDetails } from '../../store/group';
import { fetchGroupMemberships } from '../../store/membership';

import { dateSort } from '../../helperFunctions/Helper';
import './GroupDetails.css';

export const groupPrivacy = (privacy) => {
    if (privacy) {
        return 'Private'
    } else {
        return 'Public'
    }
}

function GroupDetails() {
    const dispatch = useDispatch();
    const groups = useSelector((state) => (state.groups ? state.groups : {}));
    const sessionUser = useSelector((state) => (state.session.user));
    const groupMemberships = Object.values(useSelector((state) => (state.memberships ? state.memberships : {})));
    let user;

    if (groupMemberships) {
        user = groupMemberships.find((el) => el.id === sessionUser.id);
    }

    const { groupId } = useParams();
    const group = groups[groupId];

    const incomingFeature = (e) => {
        e.preventDefault();
        e.stopPropagation();
        alert('Feature Coming Soon!')
    }

    let groupFunctionality;
    if (group && user && group.organizerId === user.id) {
        groupFunctionality = (
            <div className='organizerFunctionality'>
                <button>Create event</button>
                <button>Update</button>
                <button>Delete</button>
            </div>
        )
    } else if (group && sessionUser && !user) {
        groupFunctionality = (
            <div className='visitorFunctionality'>
                <button onClick={incomingFeature}>Join this group</button>
            </div>
        )
    } else {
        groupFunctionality = null;
    }

    useEffect(() => {
        dispatch(fetchGroupDetails(groupId))
        dispatch(fetchGroupMemberships(groupId))
    }, [dispatch, sessionUser]);


    if (!group) {
        return null
    }
    let EventList;
    if (group.Events) {
        const eventsArray = dateSort(group.Events);
        EventList = eventsArray.map((event) => {
            const eventDate = new Date(event.startDate);
            const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
            const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    
            const newDate = new Intl.DateTimeFormat('en-US', dateOptions).format(eventDate);
            const newTime = new Intl.DateTimeFormat('en-US', timeOptions).format(eventDate);
    
            const previewImage = event.EventImages.find((el) => el.preview === true)
    
            return (
            <ul key={event.id}>
                <li>
                    <div className='Event-placard-flex'>
                        <div className='Event-placard-top-level'>
                        <a href='#'>
                            {/* <img src={previewImage.url} /> */}
                            </a>
                            <div className='Event-placard-text'>
                                <p className='Group-Event-Date-Time'>
                                    <a href='#'>{`${newDate} ${String.fromCharCode(0x00B7)} ${newTime}`}</a>
                                </p>
                                <h3>{event.name}</h3>
                                <h5>{event.Venue ? event.Venue.city : group.city} {event.Venue ? event.Venue.state : group.state}</h5>
                            </div>
                        </div>
                        <p>{event.description}</p>
                    </div>
                </li>
            </ul>
            );
        });
    }

    return (
        <div className='Page-wrapper'>
            <div className='Page-wrapper-flex'>
                <div className='Group-overview-flex'>
                    &gt; <a href='/groups'>Groups</a>
                    <div className='Group-overview'>
                        {/* <img src={group.GroupImages.find((el) => el.preview === true).url || "Loading..."}></img> */}
                    </div>
                </div>
                <div className='Group-highlights-flex'>
                    <div className='Group-highlights'>
                        <div className='Group-highlights-text'>
                            <h2>{group.name}</h2>
                            <p>{group.city} {group.state}</p>
                            <p>Events ({group.Events ? group.Events.length : 0}) &#xb7; {groupPrivacy(group.private)}</p>
                            <p>Organized by {group.Organizer ? group.Organizer.firstName : null} {group.Organizer ? group.Organizer.lastName : null}</p>
                        </div>
                        <div className='Group-highlights-button'>
                            {groupFunctionality}
                        </div>
                    </div>
                </div>
                <div className='Group-details-flex'>
                    <div className='Group-details'>
                        <h2>Organizer</h2>
                        <h4>{group.Organizer ? group.Organizer.firstName : null} {group.Organizer ? group.Organizer.lastName : null}</h4>
                        <h3>What we're about</h3>
                        <p>{group.about}</p>
                    </div>
                </div>
                <div className='Group-events-flex'>
                    <div className='Group-events'>
                        <h3>Events ({group.Events ? group.Events.length : 0})</h3>
                        {group.Events ? EventList : null}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroupDetails;
