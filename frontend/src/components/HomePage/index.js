import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

function HomePage() {


    return (
        <>
            <div className="Section-1">
                <h2 className="Section-1-title">The people platform-
                    Where interests 
                    become friendships
                </h2>
                <p className="Section-1-paragraph"></p>
            </div>
            <div className="Section-2">
                <h2 className="Section-2-title">beep</h2>
                <p className="Section-2-paragraph"></p>
            </div>
            <div className="Section-3">
                <div className="Section-3-column-1">

                </div>
                <div className="Section-3-column-2">

                </div>
                <div className="Section-3-column-3">

                </div>
            </div>
            <div className="Section-4">
                <button className="Section-4-button">Join Meetup</button>
            </div>
        </>
    )
}

export default HomePage;
