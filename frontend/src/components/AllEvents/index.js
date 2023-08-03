import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventDetails, fetchEvents } from '../../store/event';
import './AllEvents.css';

function EventPage() {
    const dispatch = useDispatch();
    const events = Object.values(
        useSelector((state) => (state.events ? state.events : {}))
    );

    useEffect(() => {
        dispatch(fetchEvents())
    }, [dispatch]);

    let eventsList = null;
    if (events) {
        eventsList = events.map((event) => (
                <li className='Events-list-li' key={event.id}>
                    <div className='Events-content-flex'>
                        <a href={`/events/${event.id}`}>
                            <img src={event.previewImage}></img>
                        </a>
                        <div className='Events-text-flex'>
                            <p>
                                <a href={`/events/${event.id}`}>{event.startDate}</a>
                            </p>
                            <h2>
                                <a href={`/events/${event.id}`}>{event.name}</a>
                            </h2>
                            <p>
                                <a href={`/events/${event.id}`}>{event.Group.city}, {event.Group.state}</a>
                            </p>
                            <p>
                                <a href={`/events/${event.id}`}>{event.description || null}</a>
                            </p>
                        </div>
                    </div>
                </li>
            )
        );
    }


    return (
        <div className='Event-wrapper'>
            <div className='Event-wrapper-flex'>
                <div className='Event-navigation'>
                    <div className='Groups-Events-links'>
                        <h2 className='Events-Page-Events-link'>
                            <a href='#'>Events</a>
                        </h2>
                        <h2 className='Events-Page-Groups-link'>
                            <a href='#'>Groups</a>
                        </h2>
                    </div>
                    <div className='List-header'>
                        <h3>Events in Meetup</h3>
                    </div>
                </div>
                <div className='Events-list-wrapper'>
                    <ul className='Events-list-ul'>
                        {eventsList}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default EventPage;
