import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {useDispatch, useSelector } from 'react-redux';
import { groupPrivacy } from '../GroupDetails';
import { fetchEventDetails } from '../../store/event';
import { fetchGroupDetails } from '../../store/group';
import { fetchGroupMemberships } from '../../store/membership';

import OpenModalButton from '../OpenModalButton';
import DeleteEventModal from '../DeleteEventModal';

import './EventDetails.css';

function EventDetails() {
    const dispatch = useDispatch();
    const events = useSelector((state) => (state.events ? state.events : {}));
    const groups = useSelector((state) => (state.groups ? state.groups : {}));
    const sessionUser = useSelector((state) => (state.session.user));
    const groupMemberships = Object.values(useSelector((state) => (state.memberships ? state.memberships : {})));
    let user;

    if (groupMemberships) {
        user = groupMemberships.find((el) => el.id === sessionUser.id);
    }
    
    const { eventId } = useParams();
    const event = events[eventId];
    let group;
    if (event) {
        group = groups[event.groupId];
    }

    let groupPreviewImage;
    if (group) {
        groupPreviewImage = group.GroupImages.find((el) => el.preview === true);
    }

    let host;
    if (event && groupMemberships) {
        host = groupMemberships.find((el) => el.Membership.status === 'host');
    }

    let hostFunctionality;
    if (event && user && user.Membership.status === 'host') {
        hostFunctionality = (
            <div className='hostFunctionality'>
                <button>Update</button>
                <OpenModalButton 
                buttonText="Delete"
                modalComponent={<DeleteEventModal groupId={event.groupId} eventId={eventId} />}/>
            </div>
        )
    }

    let previewImage;
    if (event && event.EventImages) {
        previewImage = event.EventImages.find((el) => el.preview === true)
    }

    const eventPrice = (price) => {
        if (price > 0) {
            return `$${price.toFixed(2)}`;
        } else {
            return "FREE";
        }
    }


    useEffect(() => {
        dispatch(fetchEventDetails(eventId));
    }, [dispatch, eventId]);

    useEffect(() => {
        if (event && event.groupId) {
            dispatch(fetchGroupMemberships(event.groupId))
            dispatch(fetchGroupDetails(event.groupId))
        }
    }, [dispatch, event]);

    if (!event) {
        return null;
    }

    const eventStartDate = new Date(event.startDate);
    const eventEndDate = new Date(event.endDate);

    const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };

    const newStartDate = new Intl.DateTimeFormat('en-US', dateOptions).format(eventStartDate);
    const newStartTime = new Intl.DateTimeFormat('en-US', timeOptions).format(eventStartDate);
    const newEndDate = new Intl.DateTimeFormat('en-US', dateOptions).format(eventEndDate);
    const newEndTime = new Intl.DateTimeFormat('en-US', timeOptions).format(eventEndDate);

    return (
        <div className='Page-wrapper'>
            <div className='Page-wrapper-flex'>
                <div className='Event-overview-flex'>
                    &gt; <a href='/events'>Events</a>
                    <div className='Event-overview'>
                        <div className='Event-header'>
                            <h2>{event ? event.name : null}</h2>
                            <h4>Hosted by {host ? host.firstName : null} {host ? host.lastName : null}</h4>
                        </div>
                        <div className='Event-highlights'>
                            {/* <img src={event ? previewImage.url : null}></img> */}
                            <div className='Event-highlight-details'>
                                <div className='Event-Group-details'>
                                    {/* <img src={group ? groupPreviewImage.url : null}></img> */}
                                    <div className='Event-Group-details-text'>
                                        <h4>{group ? group.name : null}</h4>
                                        <p>{group ? groupPrivacy(group.private) : null}</p>
                                    </div>
                                </div>
                                <div className='Event-infocard-flex'>
                                    <div className='Event-infocard'>
                                        <div className='Event-infocard-time'>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg>
                                            <div className='start-time'>
                                                <p>START</p>
                                                <p>{event ? `${newStartDate} ${String.fromCharCode(0x00B7)} ${newStartTime}` : null}</p>
                                            </div>
                                            <div className='end-time'>
                                                <p>END</p>
                                                <p>{event ? `${newEndDate} ${String.fromCharCode(0x00B7)} ${newEndTime}` : null}</p>
                                            </div>
                                        </div>
                                        <div className='Event-infocard-price'>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M64 64C28.7 64 0 92.7 0 128V384c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H64zM272 192H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H272c-8.8 0-16-7.2-16-16s7.2-16 16-16zM256 304c0-8.8 7.2-16 16-16H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H272c-8.8 0-16-7.2-16-16zM164 152v13.9c7.5 1.2 14.6 2.9 21.1 4.7c10.7 2.8 17 13.8 14.2 24.5s-13.8 17-24.5 14.2c-11-2.9-21.6-5-31.2-5.2c-7.9-.1-16 1.8-21.5 5c-4.8 2.8-6.2 5.6-6.2 9.3c0 1.8 .1 3.5 5.3 6.7c6.3 3.8 15.5 6.7 28.3 10.5l.7 .2c11.2 3.4 25.6 7.7 37.1 15c12.9 8.1 24.3 21.3 24.6 41.6c.3 20.9-10.5 36.1-24.8 45c-7.2 4.5-15.2 7.3-23.2 9V360c0 11-9 20-20 20s-20-9-20-20V345.4c-10.3-2.2-20-5.5-28.2-8.4l0 0 0 0c-2.1-.7-4.1-1.4-6.1-2.1c-10.5-3.5-16.1-14.8-12.6-25.3s14.8-16.1 25.3-12.6c2.5 .8 4.9 1.7 7.2 2.4c13.6 4.6 24 8.1 35.1 8.5c8.6 .3 16.5-1.6 21.4-4.7c4.1-2.5 6-5.5 5.9-10.5c0-2.9-.8-5-5.9-8.2c-6.3-4-15.4-6.9-28-10.7l-1.7-.5c-10.9-3.3-24.6-7.4-35.6-14c-12.7-7.7-24.6-20.5-24.7-40.7c-.1-21.1 11.8-35.7 25.8-43.9c6.9-4.1 14.5-6.8 22.2-8.5V152c0-11 9-20 20-20s20 9 20 20z"/></svg>
                                            <p>{event ? eventPrice(event.price) : null}</p>
                                        </div>
                                        <div className='Event-infocard-type'>
                                            <div className='Event-infocard-type-flex'>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><path d="M16 144a144 144 0 1 1 288 0A144 144 0 1 1 16 144zM160 80c8.8 0 16-7.2 16-16s-7.2-16-16-16c-53 0-96 43-96 96c0 8.8 7.2 16 16 16s16-7.2 16-16c0-35.3 28.7-64 64-64zM128 480V317.1c10.4 1.9 21.1 2.9 32 2.9s21.6-1 32-2.9V480c0 17.7-14.3 32-32 32s-32-14.3-32-32z"/></svg>
                                            <p>{event ? event.type : null}</p>
                                            {hostFunctionality}    
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='Event-details-section'>
                            <h2>Details</h2>
                            <p>{event ? event.description : null}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventDetails;
