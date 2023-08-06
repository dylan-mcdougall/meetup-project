import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import { deleteGroupAction } from '../../store/group';

import './DeleteGroupModal.css';

function DeleteGroupModal({ groupId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const history = useHistory();

    const handleClick = (e) => {
        e.preventDefault();
        return dispatch(deleteGroupAction(groupId))
        .then(closeModal)
        .then(history.push('/groups'))
    }

    return (
        <>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to remove this group?</p>
        <button onClick={handleClick}>Yes (Delete Group)</button>
        <button onClick={closeModal}>No (Keep Group)</button>
        </>
    )
}

export default DeleteGroupModal;
