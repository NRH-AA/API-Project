import { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { Link, useHistory } from "react-router-dom";
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';
import ProfileMenu from './images/menu.png';
import ProfileImage from './images/profile_button.png';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    setShowMenu(false);
    dispatch(sessionActions.logout());
    return history.push("/");
  };

  const ulClassName = showMenu ? "profile-dropdown-flex" : "profile-dropdown";

  return (
    <>
        <button className="profile-button" onClick={openMenu}>
          <div className="profile-menu-div">
            <img className="profile-menu-img" src={ProfileMenu} alt="profile menu"></img>
            <img className="profile-button-img" src={ProfileImage} alt="profile menu"></img>
          </div>
        </button>
      <div className={ulClassName} hidden={showMenu ? false : true} ref={ulRef}>
        {user ? (
          <>
            <p>{`Hello, ${user.firstName}  ${user.lastName}`}</p>
            <p id="user-p">{user.email}</p>
            <div id="user-profile-link-div">
              <Link className="user-spots-link" to="/spots/current"
                onClick={() => setShowMenu(false)}
                >Manage Spots</Link><br></br>
            </div>
            <button className="user-logout-button" onClick={logout}>Log Out</button>
          </>
        ) : (
          <>
            <div>
              <OpenModalButton
                className="signup-button"
                buttonText="Sign Up"
                modalComponent={<SignupFormModal />}
                onButtonClick={() => setShowMenu(false)}
                />
              </div>
            <div>
              <OpenModalButton
                className="signup-button"
                buttonText="Log In"
                modalComponent={<LoginFormModal />}
                onButtonClick={() => setShowMenu(false)}
                />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default ProfileButton;
