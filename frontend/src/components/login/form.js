import { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import './form.css';

const Form = () => {
    const dispatch = useDispatch();
    
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);
    
    const submitForm = (e) => {
        e.preventDefault();
        
        const user = {credential, password};
        
        return dispatch(sessionActions.login(user))
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
        });
    };
    
    return (
        <div>
            <div>
                <ul>
                    {errors.map(e => <li key={e}>{e}</li>)}
                </ul>
            </div>
            
            <form className="loginForm" onSubmit={submitForm}>
                
                <label htmlFor='credential'>Username or Email</label>
                <input type='text' name='credential' value={credential} 
                    onChange={(e) => setCredential(e.target.value)} 
                />
                
                <label htmlFor='credential'>Password</label>
                <input type='password' value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                
                <br></br>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Form;
