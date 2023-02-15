import { csrfFetch } from './csrf';
import { getSpot } from './spots';

const GET_REVIEWS = 'reviews/GET';
const UPDATE_REVIEWS = 'reviews/UPDATE';

const getSpotsReviewsAction = (data) => ({
    type: GET_REVIEWS,
    data
});

const updateUserReviews = (data) => ({
    type: UPDATE_REVIEWS,
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

export const createReview = (spotId, data) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(data)
    });
    
    if (res.ok) {
        dispatch(getSpotReviews(spotId));
        dispatch(getSpot(spotId));
    };
    return res;
}

export const deleteReview = (spotId, reviewId) => async dispatch => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    });
    
    if (res.ok) {
        dispatch(getSpotReviews(spotId));
        dispatch(getSpot(spotId));
    }
    
    return res;
}

export const getUserReviews = () => async dispatch => {
    const res = await csrfFetch('/api/reviews/current');
    
    if (res.ok) {
        const data = await res.json();
        dispatch(updateUserReviews(data.Reviews));
    }
    
    return res;
}

export const updateReview = (spotId, reviewId, data) => async dispatch => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
    
    if (res.ok) {
        dispatch(getUserReviews());
        dispatch(getSpotReviews(spotId));
        dispatch(getSpot(spotId));
    }
    
    return res;
}


export const getSpotReviewsState = (state) => state.reviews.spot;

const initialState = { spot: null }
const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_REVIEWS:
            return {...state, spot: [...action.data]};
        
        case UPDATE_REVIEWS:
            return {...state, userReviews: [...action.data]}
            
        default:
            return state;
    }
}
  
export default reviewsReducer;
