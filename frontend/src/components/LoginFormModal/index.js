import { useState } from 'react';
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };
  
  function demoLogin(e) {
    e.preventDefault();
    
    dispatch(sessionActions.login({ credential: "Demo", password: "password" }));
    return closeModal();
  }
  
  const buttonDisabled = () => credential.length < 4 ||
                               password.length <= 6;
                        
  return (
    <>
    <div className='login-wrapper'>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <ul className='error-ul'>
          {errors.map((error, idx) => (
            <li className="error-li" key={idx}>{error}</li>
            ))}
        </ul>
          <input
            className='login-input'
            type="text"
            placeholder='Username or Email'
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            />
          <input
            className='login-input'
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
        <button disabled={buttonDisabled()} className="login-button" type="submit">Log In</button>
      </form>
      
      <form className="demoForm" onSubmit={demoLogin}>
        <button className='demoLogin'>Demo User</button>
      </form>
      
      </div>
    </>
  );
}

export default LoginFormModal;
