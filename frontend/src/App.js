import { Route, Switch } from 'react-router-dom';

import User from './components/login';

function App() {
  return (
    <Switch>
      <Route exact path="/">
        <h2>Home page</h2>
      </Route>
      
      <Route path="/login">
        <User />
      </Route>
      
    </Switch>
  );
}

export default App;
