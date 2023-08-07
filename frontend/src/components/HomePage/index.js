import React from "react";
import { useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from "../SignupFormModal";
import './HomePage.css';

function HomePage() {
    const sessionUser = useSelector(state => state.session.user);

    const h3ClassName = 'Section-3-title-3' + (sessionUser ? "" : ' unauthorized');

    let selectiveJoin;
    if (!sessionUser) {
        selectiveJoin = (<OpenModalButton
            buttonText="Join Meetup"
            modalComponent={<SignupFormModal />}
        />)
    } else {
        selectiveJoin = null;
    }

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
                        <a href='/groups'>See all groups</a>
                    </h3>
                </div>
                <div className="Section-3-column-2">
                    <img src='https://aaprojectbucket.s3.us-west-1.amazonaws.com/S_2858_110412.jpg' alt='event-flyer'></img>
                <h3 className="Section-3-title-2">
                        <a href='/events'>Find an event</a>
                    </h3>
                </div>
                <div className="Section-3-column-3">
                    <img src='https://aaprojectbucket.s3.us-west-1.amazonaws.com/2000_SkVNQSBHRVIgMTA0Ni0wNQ.jpg' alt='start a group'></img>
                    <h3 className={h3ClassName}>
                        <a href='/groups/new'>Start a new group</a>
                    </h3>
                </div>
            </div>
            <div className="Section-4">
                {selectiveJoin}
            </div>
        </div>
    )
}

export default HomePage;
