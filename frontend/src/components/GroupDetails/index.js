import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroupDetails } from '../../store/group';
import './GroupDetails.css';

function GroupDetails() {
    const dispatch = useDispatch();
    const groups = useSelector((state) => (state.groups ? state.groups : {}));

    const { groupId } = useParams();

    const group = groups[groupId];
    const previewImage = group.GroupImages.find((el) => el.preview === true);

    useEffect(() => {
        dispatch(fetchGroupDetails(groupId));
    }, [dispatch]);

    return (
        <div className='Page-wrapper'>
            <div className='Page-wrapper-flex'>
                <div className='Group-overview-flex'>
                    &gt; <a href='/api/groups'>Groups</a>
                    <div className='Group-overview'>
                        <img src={previewImage.url}></img>
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
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroupDetails;
