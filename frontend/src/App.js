import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";

import * as sessionActions from "./store/session";

import Navigation from "./components/Navigation";
import HomePage from './components/HomePage';
import GroupPage from "./components/AllGroups";
import GroupDetails from "./components/GroupDetails";
import CreateGroupForm from "./components/CreateGroupForm";
import UpdateGroupForm from "./components/UpdateGroupForm";
import EventPage from "./components/AllEvents";
import EventDetails from "./components/EventDetails";
import CreateEventForm from "./components/CreateEventForm";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path='/events/:eventId'>
            <EventDetails />
          </Route>
          <Route path='/events'>
            <EventPage />
          </Route>
          <Route path='/groups/:groupId/events/new'>
            <CreateEventForm />
          </Route>
          <Route path='/groups/:groupId/update'>
            <UpdateGroupForm />
          </Route>
          <Route exact path='/groups/new'>
            <CreateGroupForm />
          </Route>
          <Route path='/groups/:groupId'>
            <GroupDetails />
          </Route>
          <Route path='/groups'>
            <GroupPage />
          </Route>
          <Route exact path='/'>
            <HomePage />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
