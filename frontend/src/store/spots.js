import { csrfFetch } from './csrf';

const SET_ALL_SPOTS = 'spots/SET';
const SET_SPOT = 'spot/SET';
const SET_USER_SPOTS = 'spots/SET_USER';
const CREATE_SPOT = 'spot/CREATE';
const UPDATE_SPOT = 'spot/UPDATE';
const DELETE_SPOT = 'spot/DELETE';

const setAllSpots = (spots) => ({
    type: SET_ALL_SPOTS,
    spots
});

const setSingleSpot = (spot) => ({
    type: SET_SPOT,
    spot
});

const createSpotAction = (spot) => ({
    type: CREATE_SPOT,
    spot
});

const setUserSpots = (spots) => ({
    type: SET_USER_SPOTS,
    spots
});

const deleteUserSpot = (spotId) => ({
    type: DELETE_SPOT,
    spotId
});



export const getAllSpots = () => async dispatch => {
    const res = await csrfFetch('/api/spots');
    
    if (res.ok) {
        const data = await res.json();
        dispatch(setAllSpots(data.Spots));  
    };
    return res;
};

export const getSpot = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}`);
    
    if (res.ok) {
        const data = await res.json();
        dispatch(setSingleSpot(data)); 
    };
    return res;
};

export const getUserSpots = () => async dispatch => {
  const res = await csrfFetch('/api/spots/current');
  
  if (res.ok) {
    const data = await res.json();
    dispatch(setUserSpots(data));
  }

  return res;
};

export const createSpot = (data, images) => async dispatch => {
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        body: JSON.stringify(data)
    });
    
    if (res.ok) {
        const spotData = await res.json();
        dispatch(createSpotAction(spotData));
        
        images.forEach(async image => {
            await csrfFetch(`/api/spots/${spotData.id}/images`, {
                method: 'POST',
                body: JSON.stringify({url: image.url, preview: image.preview})
            });
        });
    };
    
    return res;
};

export const updateSpot = (data, images) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
    
    if (res.ok) {
        images.forEach(async image => {
            await csrfFetch(`/api/spots/${data.id}/images`, {
                method: 'POST',
                body: JSON.stringify({url: image.url, preview: image.preview})
            });
        });

        dispatch(getSpot(data.id));
    };
    
    return res;
};

export const deleteSpot = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    });
    
    if (res.ok) {
        dispatch(deleteUserSpot(spotId));
        return true;
    }
    
    return false;
};






export const getSpotsState = (state) => state.spots;
export const getAllSpotsState = (state) => state.spots.allSpots;
export const getSingleSpotState = (state) => state.spots.singleSpot;
export const getSpotRedirect = (state) => state.spots.redirect;
export const getUserSpotsState = (state) => state.spots.userSpots;

const initialState = {}
const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ALL_SPOTS:
            return {...state, allSpots: [...action.spots], userSpots: null};
      
        case SET_SPOT:
            return {...state, singleSpot: {...action.spot}, redirect: null}
            
        case CREATE_SPOT:
            return {...state, singleSpot: null, redirect: action.spot.id};
            
        case SET_USER_SPOTS:
            return {...state, allSpots: null, userSpots: [...action.spots.Spots]};
            
        case UPDATE_SPOT:
            return {};
            
        case DELETE_SPOT:
            return {...state, userSpots: null};
            
        default:
            return state;
    }
}
  
export default spotsReducer;
