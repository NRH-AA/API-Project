import { Route, Switch } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { useEffect, useState } from 'react';

import * as sessionActions from "./store/session";

import LoginForm from './components/login';

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);
  
  return (
    <Switch>
      <Route exact path="/">
        <h2>Home page</h2>
      </Route>
      
      <Route path="/login">
        <LoginForm />
      </Route>
      
    </Switch>
  );
}

export default App;
