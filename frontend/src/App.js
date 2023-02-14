import { Route, Switch } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { useEffect, useState } from 'react';

import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotComponent from './components/Spots';
import SingleSpot from './components/Spots/SingleSpot';
import CreateSpot from './components/Spots/SpotCreate';

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
            <SpotComponent current="true" />
          </Route>
          
          <Route path="/spots/:spotId">
            <SingleSpot />
          </Route>
          
          
        </Switch>
      )}
    </>
  );
}

export default App;
