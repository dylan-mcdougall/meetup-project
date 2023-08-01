import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroups, fetchGroupEvents } from '../../store/group';
import './AllGroups.css';

function GroupPage() {
    const dispatch = useDispatch();
    const groups = Object.values(
        useSelector((state) => (state.groups ? state.groups : {}))
    )
    
    useEffect(() => {
        dispatch(fetchGroups())
    }, [dispatch]);

    const groupsList = (
        <ul className='Groups-list-ul'>
            {groups.map((group) => (
                <li className='Groups-list-li' key={group.id}>
                    <div className='Groups-content-flex'>
                        <a href={`/groups/${group.id}`}>
                            <img src={group.previewImage}></img>
                        </a>
                        <div className='Groups-text-flex'>
                            <h2>
                                <a href={`/groups/${group.id}`}>{group.name}</a>
                                </h2>
                            <p>
                                <a href={`/groups/${group.id}`}>{group.city}, {group.state}</a>
                                </p>
                            <p>
                                <a href={`/groups/${group.id}`}>{group.about}</a>
                                </p>
                            <p>
                                <a href={`/groups/${group.id}`}>Number of Events: {group.Events ? group.Events.length : 0}</a>
                            </p>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );

    return (
        <div className='Group-wrapper'>
            <div className='Group-wrapper-flex'>
                <div className='Group-navigation'>
                    <div className='Groups-Events-links'>
                        <h2 className='Groups-Page-Events-link'>
                            <a href='#'>Events</a>
                        </h2>
                        <h2 className='Groups-Page-Groups-link'>
                            <a href='#'>Groups</a>
                        </h2>
                    </div>
                    <div className='List-header'>
                        <h3>Groups in Meetup</h3>
                    </div>
                </div>
                <div className='Groups-list-wrapper'>
                    {groupsList}
                </div>
            </div>
        </div>
    );
}

export default GroupPage;
