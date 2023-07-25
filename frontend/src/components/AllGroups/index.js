import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroups } from '../../store/group';
import './AllGroups.css';

function GroupPage() {
    const dispatch = useDispatch();
    const groups = Object.values(
        useSelector((state) => (state.groups ? state.groups : []))
    )

    useEffect(() => {
        dispatch(fetchGroups());
    }, [dispatch]);

    const groupsList = (
        <ul className='Groups-list-ul'>
            {groups.map((group) => (
                <li className='Groups-list-li' key={group.id}>
                    <div className='Groups-content-flex'>
                        <p href='#'>placeholder image</p>
                        <div className='Groups-text-flex'>
                            <h2 href='#'>{group.name}</h2>
                            <p href='#'>{group.city}, {group.state}</p>
                            <p href='#'>{group.about}</p>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );

    return (
        <div className='Group-wrapper'>
            <div className='Group-navigation'>
                <div className='Groups-Events-links'>
                    <h2 className='Events-link'>
                        <a href='#'>Events</a>
                    </h2>
                    <h2 className='Groups-link'>
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
    );
}

export default GroupPage;
