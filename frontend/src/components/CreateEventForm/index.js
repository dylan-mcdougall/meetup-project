import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { dateTimeAmPm } from '../../helperFunctions/Helper';
import { fetchGroupDetails } from '../../store/group';
import { createEventAction } from '../../store/event';
import './CreateEventForm.css';

function CreateEventForm() {
    const dispatch = useDispatch();
    const groups = useSelector((state) => (state.groups ? state.groups : {}));

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [price, setPrice] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState({});

    const history = useHistory();
    const { groupId } = useParams();
    const group = groups[groupId];

    useEffect(() => {
        dispatch(fetchGroupDetails(groupId))
    }, []);

    useEffect(() => {
        const errors = {};

        if (!name) {
            errors.name = "Event name is required."
        }

        if (!type) {
            errors.type = "Please specify whether your group is online or in person."
        }

        if (!price) {
            errors.price = "Please specify your event's price. If no price, enter a 0."
        }

        if (!startDate) {
            errors.startDate = "Start Date and time is required."
        }

        if (!endDate) {
            errors.endDate = "End Date and time is required."
        }

        if (!imageUrl) {
            errors.imageUrl = "Please include a valid image URL."
        }

        if (description.length < 30) {
            errors.description = "Description must be at least 30 characters long."
        }

        setErrors(errors);
    }, [name, type, startDate, endDate, imageUrl, description]);

    const onSubmit = async (e) => {
        e.preventDefault();

        const updatedStartDate = dateTimeAmPm(startDate);
        const updatedEndDate = dateTimeAmPm(endDate);

        try {
            const res = await dispatch(createEventAction(groupId, {
                name: name,
                type: type,
                price: price,
                capacity: 1,
                startDate: updatedStartDate,
                endDate: updatedEndDate,
                description: description
            }));
            if (res) {
                console.log(res);
                history.push(`/events/${res.id}`)
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <form
        className='Create-event-form'
        onSubmit={onSubmit}
        >
            <div className='Create-event-form-wrapper'>
                <div className='Create-event-form-title'>
                    <h2>Create an event for {group ? group.name : null}</h2>
                </div>
                <div className='Section'>
                    <div className='Create-event-form-name'>
                        <label>
                            What is the name of your event?
                            <input type='text'
                            name='name'
                            placeholder='Event Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        </label>
                    </div>
                </div>
                <div className='Section'>
                    <div className='Create-event-form-type'>
                        <label>
                            Is this an in-person or online group?
                            <select
                                    name='type'
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    <option value={""} disabled>(Select one)</option>
                                    <option value={"In person"}>In Person</option>
                                    <option value={"Online"}>Online</option>
                                </select>
                        </label>
                    </div>
                    <div className='Create-event-form-price'>
                        <input type='number'
                        name='price'
                        placeholder={0}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                </div>
                <div className='Section'>
                    <div className='Create-event-form-startDate'>
                        <label>
                            When does your event start?
                            <input type='text'
                                name='startDate'
                                placeholder='MM/DD/YYYY, HH/mm AM'
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </label>
                    </div>
                    <div className='Create-event-form-endDate'>
                        <label>
                            When does your event end?
                            <input type='text'
                            name='endDate'
                            placeholder='MM/DD/YYYY, HH/mm PM'
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            />
                        </label>
                    </div>
                </div>
                <div className='Section'>
                    <div className='Create-event-form-image'>
                        <label>
                            Please add an image url for your event below.
                            <input type='text'
                            name='imageUrl'
                            placeholder='Image URL'
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            />
                        </label>
                    </div>
                </div>
                <div className='Section'>
                    <div className='Create-event-form-description'>
                        <label>
                            Please describe your event
                            <textarea
                            name='description'
                            placeholder='Please include at least 30 characters'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            />
                        </label>
                    </div>
                </div>
                <button type='submit'>Create Event</button>
            </div>
        </form>
    )
}

export default CreateEventForm;
