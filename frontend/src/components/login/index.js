import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Form from './form';

const User = () => {
    const sessionUser = useSelector(state => state.session.user);
    
    if (sessionUser) return <Redirect to="/" />
    
    return (
        <Form />
    );
};

export default User;
