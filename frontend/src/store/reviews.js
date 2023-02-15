import { csrfFetch } from './csrf';


const GET_REVIEWS = 'reviews/GET';


const getSpotsReviewsAction = (data) => ({
    type: GET_REVIEWS,
    data
});


export const getSpotReviews = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
    
    if (res.ok) {
        const data = await res.json();
        dispatch(getSpotsReviewsAction(data.Reviews));  
    };
    return res;
};




export const getSpotReviewsState = (state) => state.reviews.spot;

const initialState = { spot: null }
const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_REVIEWS:
        return {...state, spot: [...action.data]};
            
        default:
            return state;
    }
}
  
export default reviewsReducer;
