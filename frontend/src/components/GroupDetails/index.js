import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './GroupDetails.css';

function GroupDetails() {
    const dispatch = useDispatch();
    const group = useSelector((state) => (state.group ? state.group : {}))

    return (
        <div className='Page-wrapper'>
            <div className='Page-wrapper-flex'>
                <div className='Group-overview-flex'>
                    <div className='Group-overview'>

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
