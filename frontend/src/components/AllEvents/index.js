import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../../store/event';

import { dateSort } from '../../helperFunctions/Helper';
import './AllEvents.css';

function EventPage() {
    const dispatch = useDispatch();
    const events = Object.values(
        useSelector((state) => (state.events ? state.events : {}))
    );

    useEffect(() => {
        dispatch(fetchEvents())
    }, [dispatch]);

    const eventsArray = dateSort(events);
    let eventsList = null;
    if (events) {
        eventsList = eventsArray.map((event) => {
            const eventDate = new Date(event.startDate);
            const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
            const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };

            const newDate = new Intl.DateTimeFormat('en-US', dateOptions).format(eventDate);
            const newTime = new Intl.DateTimeFormat('en-US', timeOptions).format(eventDate);

            let previewImage;
            if (event.EventImages) {
                previewImage = event.EventImages.find((el) => el.preview === true);
            }

            return (
                <li className='Events-list-li' key={event.id}>
                    <div className='Events-content-flex'>
                        <a href={`/events/${event.id}`}>
                            <img src={previewImage ? previewImage.url : null}></img>
                        </a>
                        <div className='Events-text-flex'>
                            <p>
                                <a href={`/events/${event.id}`}>{`${newDate} ${String.fromCharCode(0x00B7)} ${newTime}`}</a>
                            </p>
                            <h2>
                                <a href={`/events/${event.id}`}>{event.name}</a>
                            </h2>
                            <p>
                                <a href={`/events/${event.id}`}>{event.Venue ? event.Venue.city : event.Group.city}, {event.Venue ? event.Venue.state : event.Group.state}</a>
                            </p>
                            <p>
                                <a href={`/events/${event.id}`}>{event.description || null}</a>
                            </p>
                        </div>
                    </div>
                </li>
            )
        });
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
                            <a href='/groups'>Groups</a>
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
