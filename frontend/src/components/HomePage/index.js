import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import './HomePage.css';

function HomePage() {
    const sessionUser = useSelector(state => state.session.user);

    const h3ClassName = 'Section-3-title-3' + (sessionUser ? "" : ' unauthorized');

    return (
        <div className="Landing-wrapper">
            <div className='Section-1'>
                <div className="Section-1-text">
                    <h2 className="Section-1-title">The people platform--
                        Where interests
                        become friendships
                    </h2>
                    <p className="Section-1-paragraph">Your new community is waiting for you. For 20+ years, millions of people have chosen Meetup to make real connections over shared interests. Start a group today with a 30-day free trial.</p>
                </div>
                <div className="Section-1-images">
                    <img src='https://aaprojectbucket.s3.us-west-1.amazonaws.com/iStock-group.jpg' alt='group-bonding'></img>
                </div>
            </div>
            <div className="Section-2">
                <h2 className="Section-2-title">How Meetup works</h2>
                <p className="Section-2-paragraph">Spark new friendships. Start a group to meet people who are new in town or longtime locals. Enjoy nightlife, happy hours, game nights, music, and more.</p>
            </div>
            <div className="Section-3">
                <div className="Section-3-column-1">
                    <img src='https://aaprojectbucket.s3.us-west-1.amazonaws.com/uynx_zeag_150109.jpg' alt='group-activities'></img>
                    <h3 className="Section-3-title-1">
                        <a href='#'>See all groups</a>
                    </h3>
                </div>
                <div className="Section-3-column-2">
                    <img src='https://aaprojectbucket.s3.us-west-1.amazonaws.com/S_2858_110412.jpg' alt='event-flyer'></img>
                <h3 className="Section-3-title-2">
                        <a href='#'>Find an event</a>
                    </h3>
                </div>
                <div className="Section-3-column-3">
                    <h3 className={h3ClassName}>
                        <a href='#'>Start a new group</a>
                    </h3>
                </div>
            </div>
            <div className="Section-4">
                <button className="Section-4-button">Join Meetup</button>
            </div>
        </div>
    )
}

export default HomePage;
