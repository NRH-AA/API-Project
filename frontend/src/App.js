import { Route, Switch } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { useEffect, useState } from 'react';

import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotComponent from './components/Spots';
import SingleSpot from './components/Spots/SingleSpot';
import CreateSpot from './components/Spots/SpotCreate';
import UserSpotsComponent from './components/Spots/UserSpots';
import UserReviews from './components/Reviews/UserReviews';

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
          <Route exact path="/">
            <SpotComponent />
          </Route>
          
          <Route path="/spots/new">
            <CreateSpot />
          </Route>
          
          <Route path="/spots/current">
            <UserSpotsComponent />
          </Route>
          
          <Route path="/spots/:spotId">
            <SingleSpot />
          </Route>
          
          <Route path="/reviews/current">
            <UserReviews />
          </Route>
          
          
        </Switch>
      )}
    </>
  );
}

export default App;
