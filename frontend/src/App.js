import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import HomePage from './components/HomePage';
import GroupPage from "./components/AllGroups";
import GroupDetails from "./components/GroupDetails";
import EventPage from "./components/AllEvents";

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
          <Route path="/login">
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route path='/events'>
            <EventPage />
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
