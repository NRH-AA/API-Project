
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as reviewActions from '../../store/reviews'
import { getSingleSpotState } from '../../store/spots'
import { getUserState } from '../../store/session';
import './Reviews.css';

const ReviewsComponent = ({ spotId }) => {
    const dispatch = useDispatch();
    const reviewData = useSelector(reviewActions.getSpotReviewsState);
    const spotData = useSelector(getSingleSpotState);
    const userData = useSelector(getUserState);
    
    useEffect(() => {
        dispatch(reviewActions.getSpotReviews(spotId))
    }, [dispatch])
    
    if (!spotId) return null;
    
    const formatDate = (date) => date.slice(0, 9).split('-').reverse().join('-');
    
    const getStarReviewsText = () => {
        if (!spotData) return ('');
        if (spotData.numReviews === 1) return `${spotData?.avgStarRating + ' *'}  ${spotData?.numReviews} Review`;
        if (spotData.numReviews === 0) return ` New`;
        return `${spotData?.avgStarRating + ' *'}  ${spotData?.numReviews} Reviews`
    }
    
    return (
        <div id="reviews-wrapper">
            <h3>⭐
            {getStarReviewsText()}
            <div><button>Post your review</button></div>
            {spotData?.numReviews === 0 ? 
            <p>Be the first to post a review</p>
            : ''}
            
            </h3>
            
            {reviewData?.map(el => {
            return (
                <div>
                    <p className="reviews-name-p">
                        {el.User?.firstName + ' ' + el.User?.lastName}
                    </p>
                    <p className="reviews-date-p">
                        {formatDate(el.updatedAt)}
                    </p>
                
                    <p className="reviews-review-p" key={el.id}>{el.review}</p>
                    
                    {el?.userId === userData?.id ?
                    <div className="reviews-button-div">
                        <button className="reviews-button">Update</button>
                        <button className="reviews-button">Delete</button>
                    </div>
                    : ''}
                </div>
            )})}
        </div>
    );
}


export default ReviewsComponent;
