import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroupDetails } from '../../store/group';
import './GroupDetails.css';

function GroupDetails() {
    const dispatch = useDispatch();
    const group = useSelector((state) => (state.groups ? state.groups : {}));

    const { groupId } = useParams();

    useEffect(() => {
        dispatch(fetchGroupDetails(groupId))
    }, [dispatch]);

    return (
        <div className='Page-wrapper'>
            <div className='Page-wrapper-flex'>
                <div className='Group-overview-flex'>
                    <div className='Group-overview'>
                        <a href='#'>Groups</a>
                        {/* <img src={previewImage.url}></img> */}
                    </div>
                </div>
                <div className='Group-details-flex'>
                    <div className='Group-details'>

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
