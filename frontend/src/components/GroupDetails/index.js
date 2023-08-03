import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroupDetails, fetchGroupEvents } from '../../store/group';
import './GroupDetails.css';

function GroupDetails() {
    const dispatch = useDispatch();
    const groups = useSelector((state) => (state.groups ? state.groups : {}));

    const { groupId } = useParams();

    const group = groups[groupId];

    console.log(group);

    useEffect(() => {
        dispatch(fetchGroupDetails(groupId))
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
                            <h5>{event.Venue.city} {event.Venue.state}</h5>
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

                            <p>Organized by {group.Organizer.firstName} {group.Organizer.lastName}</p>
                        </div>
                        <div className='Group-highlights-button'>
                            <button>Join this group</button>
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
