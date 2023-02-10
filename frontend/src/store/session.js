import { csrfFetch } from './csrf';


const SESSION_LOGIN = 'session/LOGIN';
const SESSION_LOGOUT = 'session/LOGOUT';


// Actions
const sessionLogin = (user) => ({
    type: SESSION_LOGIN,
    user
});

export const sessionLogout = () => ({
    type: SESSION_LOGOUT
});

// Thunk Actions
export const login = (user) => async dispatch => {
    const res = await csrfFetch('/api/session', {
        method: 'POST',
        body: JSON.stringify(user)
    });
    
    if (res.ok) {
        const data = await res.json();
        dispatch(sessionLogin(data.user));
    };
    return res;
};

export const restoreUser = () => async dispatch => {
    const res = await csrfFetch('/api/session');
    const data = await res.json();
    dispatch(sessionLogin(data.user));
    return res;
};


// Selectors
const initialState = { user: null }
const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
    case SESSION_LOGIN:
        return {...state, user: {...action.user}};
        
    case SESSION_LOGOUT:
        return {...initialState};
      
    default:
        return state;
    }
}
  
export default sessionReducer;
  