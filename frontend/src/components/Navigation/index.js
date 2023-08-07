import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li className='profile'>
        <NavLink to='/events'>View Events</NavLink>
        <NavLink to='/groups'>View Groups</NavLink>
        <NavLink to='/groups/new'>Start a new group</NavLink>
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    sessionLinks = (
      <li className='session'>
        <NavLink to='/events'>View Events</NavLink>
        <NavLink to='/groups'>View Groups</NavLink>
        <OpenModalButton
        buttonText="Log In"
        modalComponent={<LoginFormModal />}
        />
        <OpenModalButton
        buttonText="Sign Up"
        modalComponent={<SignupFormModal />}
        />
      </li>
    );
  }

  return (
    <ul>
      <li className='Meetup'>
        <NavLink exact to="/">Meetup</NavLink>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;
