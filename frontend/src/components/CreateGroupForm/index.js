import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { createGroupAction, fetchGroups } from '../../store/group';
import './CreateGroupForm.css';

function CreateGroupForm() {
    const dispatch = useDispatch();
    const groups = Object.values(
        useSelector((state) => (state.groups ? state.groups : {}))
    );

    const [location, setLocation] = useState('');
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [type, setType] = useState('');
    const [privacy, setPrivacy] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [errors, setErrors] = useState({});
    
    const history = useHistory();

    useEffect(() => {
        dispatch(fetchGroups());
    }, []);

    useEffect(() => {
        const errors = {};

        if (!location) {
            errors.location = "Location is required.";
        }

        if (location.split(',').length !== 2) {
            errors.location = "Please enter location in the format of City, STATE";
        }

        if (!name) {
            errors.name = "Group name is required."
        }

        if (!about) {
            errors.about = "Description for your group is required."
        }

        if (about.length < 30) {
            errors.about = "Description must be at least 30 characters long."
        }

        if (!type || type === "") {
            errors.type = "Please specify whether your group is online or in person."
        }

        if (!privacy || privacy === "") {
            errors.privacy = "Please specify whether your group is private or public."
        }

        if (!imageUrl) {
            errors.image = "Please include a valid image URL."
        }

        setErrors(errors);
    }, [location, name, about, type, privacy, imageUrl]);

    const onSubmit = async (e) => {
        e.preventDefault();

        const [city, state] = location.split(',')

        try {
            const res = await dispatch(createGroupAction({
                name: name,
                about: about,
                type: type,
                private: privacy,
                city: city,
                state: state
            }));
            if (res) {
                console.log(res);
                history.push(`/groups/${res.id}`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form
            className='Create-group-form'
            onSubmit={onSubmit}
        >
            <div className='Create-group-form-wrapper'>
                <div className='Create-group-form-title'>
                    <h2>Start a New Group</h2>
                </div>
                <div className='Section'>
                    <div className='Create-group-form-location'>
                        <h3>First, set your group's location.</h3>
                        <p>Meetup groups meet locally, in person and online. We'll connect you with people
                            in your area, and more can join you online.</p>
                        <input type='text'
                            name='location'
                            placeholder='City, STATE'
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <p className='errors.location'>{errors.location}</p>
                    </div>
                </div>
                <div className='Section'>
                    <div className='Create-group-form-name'>
                        <h3>What will your group's name be?</h3>
                        <p>Choose a name that will give people a clear idea of what the group is about.
                            Feel free to get creative! You can edit this later if you change your mind.
                        </p>
                        <input type='text'
                            name='name'
                            placeholder="What is your group name?"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <p className='errors.name'>{errors.name}</p>
                    </div>
                </div>
                <div className='Section'>
                    <div className='Create-group-form-description'>
                        <h3>Now describe what your group will be about</h3>
                        <p>People will see this when we promote your group, but you'll be able to add to it later, too.</p>
                        <ol>
                            <li>1. What's the purpose of the group?</li>
                            <li>2. Who should join?</li>
                            <li>3. What will you do at your events?</li>
                        </ol>
                        <textarea
                            name='about'
                            placeholder='Please include at least 30 characters'
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            />
                        <p className='errors.about'>{errors.about}</p>
                    </div>
                </div>
                <div className='Section'>
                    <div className='Create-group-form-selects-flex'>
                        <h3>Final steps...</h3>
                        <div className='Create-group-form-selects'>
                            <label>
                                Is this an in person group or online?
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
                            <label>
                                Is this group private or public?
                                <select
                                    name='private'
                                    value={privacy}
                                    onChange={(e) => setPrivacy(e.target.value)}
                                >
                                    <option value={""} disabled>(Select one)</option>
                                    <option value={true}>Private</option>
                                    <option value={false}>Public</option>
                                </select>
                            </label>
                            <label>
                                Please add an image URL for your group below.
                                <input type='text'
                                    placeholder='Image Url'
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                />
                            </label>
                            <p className='errors.type'>{errors.type}</p>
                            <p className='errors.privacy'>{errors.privacy}</p>
                            <p className='errors.image'>{errors.image}</p>
                        </div>
                    </div>
                </div>
                <button
                type='submit'
                >Create Group</button>
            </div>
        </form>
    )
}

export default CreateGroupForm;
