import { csrfFetch } from './csrf';

const SET_ALL_SPOTS = 'spots/SET';
const SET_SPOT = 'spot/SET';


const setAllSpots = (spots) => ({
    type: SET_ALL_SPOTS,
    spots
});

const setSingleSpot = (spot) => ({
    type: SET_SPOT,
    spot
});


export const getAllSpots = () => async dispatch => {
    const res = await csrfFetch('/api/spots', {
        method: 'GET',
    });
    
    if (res.ok) {
        const data = await res.json();
        dispatch(setAllSpots(data.Spots));  
    };
    return res;
};

export const getSpot = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'GET',
    });
    
    if (res.ok) {
        const data = await res.json();
        dispatch(setSingleSpot(data)); 
    };
    return res;
};


export const getSpotsState = (state) => state.spots;

const initialState = {}
const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ALL_SPOTS:
            return {...state, allSpots: [...action.spots]};
      
        case SET_SPOT:
            return {...state, singleSpot: {...action.spot}}
            
        default:
            return state;
    }
}
  
export default spotsReducer;
