
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
    
    return (
        <div id="reviews-wrapper">
            <h3>⭐ {spotData?.avgStarRating} * 
            {spotData?.numReviews === 1 ? ` ${spotData?.numReviews} Review` : 
            `${spotData?.numReviews} Reviews`}
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
