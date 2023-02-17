import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    }
    return setErrors(['Confirm Password field must be the same as the Password field']);
  };
  
  const buttonDisabled = () => email.length === 0 ||
  username.length < 4 || firstName.length === 0 || lastName.length === 0 ||
  password.length < 6 || confirmPassword.length < 6 || password !== confirmPassword;

  return (
    <>
      <div id="signup-wrapper">
        <h2>Sign Up</h2>
        <form id="signup-form" onSubmit={handleSubmit}>
          
          <div id="form-wrapper">
            <ul>
              {errors.map((error, idx) => <li key={idx} className="error-li">{error}</li>)}
            </ul>
            <label>
              <input
                className="form-input"
                type="text"
                value={firstName}
                placeholder="First Name"
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </label>
            <label>
              <input
                className="form-input"
                type="text"
                value={lastName}
                placeholder="Last Name"
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </label>
            <label>
              <input
                className="form-input"
                type="text"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              <input
                className="form-input"
                type="text"
                value={username}
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
            <label>
              <input
                className="form-input"
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <label>
              <input
                className="form-input"
                type="password"
                value={confirmPassword}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
            <button id="signup-button" type="submit" disabled={buttonDisabled()}>Sign Up</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default SignupFormModal;
