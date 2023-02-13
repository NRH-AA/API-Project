import { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
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
  };

  const ulClassName = "profile-dropdown";

  return (
    <>
        <button className="profile-button" onClick={openMenu}>
          <div className="profile-menu-div">
            <img className="profile-menu-img" src={ProfileMenu} alt="profile menu"></img>
            <img className="profile-button-img" src={ProfileImage} alt="profile menu"></img>
          </div>
        </button>
      <ul className={ulClassName} hidden={showMenu ? false : true} ref={ulRef}>
        {user ? (
          <>
            <li>{user.username}</li>
            <li>{user.firstName} {user.lastName}</li>
            <li>{user.email}</li>
            <li>
              <button onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
            <div className="signup-div">
              <OpenModalButton
                buttonText="Sign Up"
                modalComponent={<SignupFormModal />}
                onButtonClick={() => setShowMenu(false)}
                />
              <OpenModalButton
                buttonText="Log In"
                modalComponent={<LoginFormModal />}
                onButtonClick={() => setShowMenu(false)}
                />
            </div>
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
