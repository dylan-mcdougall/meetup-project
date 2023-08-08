import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroups } from '../../store/group';
import './AllGroups.css';

function GroupPage() {
    const dispatch = useDispatch();
    const groups = Object.values(
        useSelector((state) => (state.groups ? state.groups : {}))
    )
    
    useEffect(() => {
        dispatch(fetchGroups())
    }, []);

    const groupPrivacy = (privacy) => {
        if (privacy) {
            return 'Private'
        } else {
            return 'Public'
        }
    }

    if (groups) {
        const groupsList = (
            <ul className='Groups-list-ul'>
                {groups.map((group) => (
                    <li className='Groups-list-li' key={group.id}>
                        <a href={`/groups/${group.id}`}>
                            <div className='Groups-content-flex'>
                                <img src={group.previewImage}></img>
                                <div className='Groups-text-flex'>
                                    <h2>
                                        {group.name}
                                    </h2>
                                    <p>
                                        {group.city}, {group.state}
                                    </p>
                                    <p>
                                        {group.about}
                                    </p>
                                    <p>
                                        Events({group.Events.Events ? group.Events.Events.length : null})  &#xb7; {groupPrivacy(group.private)}
                                    </p>
                                </div>
                            </div>
                        </a>
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
                                <a href='/events'>Events</a>
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
    } else {
        return null;
    }


    
}

export default GroupPage;
