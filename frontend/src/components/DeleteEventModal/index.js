import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import { deleteEventAction } from '../../store/event';

import './DeleteEventModal.css';

function DeleteEventModal({ groupId, eventId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const history = useHistory();

    const handleClick = (e) => {
        e.preventDefault();
        return dispatch(deleteEventAction(eventId))
        .then(closeModal)
        .then(history.push(`/groups/${groupId}`))
    }

    return (
        <div className='Delete-modal'>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to remove this event?</p>
        <button className='Delete-yes' onClick={handleClick}>Yes (Delete Event)</button>
        <button className='Delete-no' onClick={closeModal}>No (Keep Event)</button>
        </div>
    )
}

export default DeleteEventModal;
