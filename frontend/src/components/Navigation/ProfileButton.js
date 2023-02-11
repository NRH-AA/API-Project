import { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';

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
      <button onClick={openMenu}>
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} hidden={showMenu ? false : true} ref={ulRef}>
        {user ? (
          <>
            <li className="profile-dropdown-li">{user.username}</li>
            <li className="profile-dropdown-li">{user.firstName} {user.lastName}</li>
            <li className="profile-dropdown-li">{user.email}</li>
            <li className="profile-dropdown-li">
              <button onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
            <li className="profile-dropdown-li">
              <OpenModalButton
                buttonText="Log In"
                modalComponent={<LoginFormModal />}
                onButtonClick={() => setShowMenu(false)}
              />
            </li>
            <li className="profile-dropdown-li">
              <OpenModalButton
                buttonText="Sign Up"
                modalComponent={<SignupFormModal />}
                onButtonClick={() => setShowMenu(false)}
              />
            </li>
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
