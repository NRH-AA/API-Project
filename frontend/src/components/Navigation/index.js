import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import Logo from './images/logo.png';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
      <div className="topbar-ul">
          <div className="topbar-home">
            <NavLink exact to="/">
            <img src={Logo} alt="logo">
            </img>
            </NavLink>
          </div>
          
          <div className="topbar-profile">
            {sessionUser && (
              <Link to="/spots/create" className="create-spot">Create a New Spot</Link>
            )}
            
            {isLoaded && (
                <ProfileButton user={sessionUser} />
            )}
          </div>
      </div>
  );
}

export default Navigation;
