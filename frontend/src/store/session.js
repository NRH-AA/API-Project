import { csrfFetch } from './csrf';


const SESSION_LOGIN = 'session/LOGIN';
const SESSION_LOGOUT = 'session/LOGOUT';


// Actions
const sessionLogin = (user) => ({
    type: SESSION_LOGIN,
    user
});

const sessionLogout = () => ({
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
        dispatch(sessionLogin(data));
    };
    return res;
};

export const logout = () => async dispatch => {
   const res = await csrfFetch('/api/session', {
        method: 'DELETE'
   });
   
   if (res.ok) {
        dispatch(sessionLogout());
   };
};


// Selectors

const initialState = {}
const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
    case SESSION_LOGIN:
        return {...state, ...action.user};
        
    case SESSION_LOGOUT:
        return {...initialState};
      
    default:
        return state;
    }
}
  
export default sessionReducer;
  