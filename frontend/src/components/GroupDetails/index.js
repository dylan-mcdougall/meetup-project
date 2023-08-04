import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroupDetails } from '../../store/group';
import { fetchGroupMemberships } from '../../store/membership';
import './GroupDetails.css';

function GroupDetails() {
    const dispatch = useDispatch();
    const groups = useSelector((state) => (state.groups ? state.groups : {}));
    const sessionUser = useSelector((state) => (state.session.user));
    const groupMemberships = Object.values(useSelector((state) => (state.memberships ? state.memberships : {})));
    let user;
    if (groupMemberships) {
        user = groupMemberships.find((el) => el.id === sessionUser.id);
    } else {
        user = 'Visitor'
    }
    const { groupId } = useParams();
    const group = groups[groupId];

    console.log(group);
    console.log(sessionUser);
    console.log(groupMemberships);
    console.log(user);

    const groupPrivacy = (privacy) => {
        if (privacy) {
            return 'Private'
        } else {
            return 'Public'
        }
    }

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
    }, [dispatch]);


    if (!group) {
        return null
    }
    const EventList = group.Events.Events.map((event) => (
        <ul>
            <li>
                <div className='Event-placard-flex'>
                    <div className='Event-placard-top-level'>
                        <img src={event.previewImage}></img>
                        <div className='Event-placard-text'>
                            <p className='Group-Event-Date-Time'>
                                <a href='#'>{event.startDate}</a>
                            </p>
                            <h3>{event.name}</h3>
                            <h5>{event.Venue ? event.Venue.city : group.city} {event.Venue ? event.Venue.state : group.state}</h5>
                        </div>
                    </div>
                    <p>{event.about}</p>
                </div>
            </li>
        </ul>
    ));

    return (
        <div className='Page-wrapper'>
            <div className='Page-wrapper-flex'>
                <div className='Group-overview-flex'>
                    &gt; <a href='/api/groups'>Groups</a>
                    <div className='Group-overview'>
                        <img src={group.GroupImages.find((el) => el.preview === true).url || "Loading..."}></img>
                    </div>
                </div>
                <div className='Group-highlights-flex'>
                    <div className='Group-highlights'>
                        <div className='Group-highlights-text'>
                            <h2>{group.name}</h2>
                            <p>{group.city} {group.state}</p>
                            <p>Events(#) {group.Events.Events.length} &#xb7; {groupPrivacy(group.private)}</p>
                            <p>Organized by {group.Organizer.firstName} {group.Organizer.lastName}</p>
                        </div>
                        <div className='Group-highlights-button'>
                            {groupFunctionality}
                        </div>
                    </div>
                </div>
                <div className='Group-details-flex'>
                    <div className='Group-details'>
                        <h2>Organizer</h2>
                        <h4>{group.Organizer.firstName} {group.Organizer.lastName}</h4>
                        <h3>What we're about</h3>
                        <p>{group.about}</p>
                    </div>
                </div>
                <div className='Group-events-flex'>
                    <div className='Group-events'>
                        <h3>Upcoming Events ({group.Events.Events.length})</h3>
                        {EventList}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroupDetails;
