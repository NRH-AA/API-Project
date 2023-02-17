
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as reviewActions from '../../store/reviews'
import { getSingleSpotState } from '../../store/spots'
import { getUserState } from '../../store/session';
import OpenModalButton from "../OpenModalButton";
import CreateReviewModal from "./CreateReview";
import DeleteReviewModal from "./DeleteReview";
import UpdateReviewModal from "./UpdateReview";
import './Reviews.css';
import Star from './images/star.png';

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
        if (spotData.numReviews === 1) return `${spotData?.avgStarRating + ' ·'}  ${spotData?.numReviews} Review`;
        if (spotData.numReviews === 0) return ` New`;
        return `${spotData?.avgStarRating + ' ·'}  ${spotData?.numReviews} Reviews`
    }
    
    function getStars(num) {
        const starImgs = [];
        for (let i = 1; i <= num; i++) {
            starImgs.push(<img key={i} src={Star}/>)
        }
        return starImgs;
    };
    
    const showPostReview = () => {
        if (reviewData) {
            for (let i in reviewData) {
                if (reviewData[i].userId === userData.id) return false;
            }
        }
        return true;
    }
    
    return (
        <div id="reviews-wrapper">
            <h3>⭐
            {getStarReviewsText()}
            
            {spotData?.ownerId !== userData?.id ? 
                <>  
                    {userData ?
                        <>
                        {showPostReview() ?
                            <div>
                                <OpenModalButton
                                    spotId={spotId}
                                    className="create-review-button"
                                    buttonText="Post Your Review"
                                    modalComponent={<CreateReviewModal />}
                                />
                            </div> 
                        : ''}
                        
                        {spotData?.numReviews === 0 ? 
                            <p>Be the first to post a review</p>
                        : ''}
                        </>
                    : <p>Log in to post a review</p>}
                </>
            :<p>Your spot has no reviews yet</p>}
            
            </h3>
            
            {reviewData?.map(el => {
            return (
                <div key={el.id}>
                    <div id="reviews-stars-div">
                        <p className="reviews-name-p">
                            {el.User?.firstName}
                        </p>
                        
                        {el.stars ? 
                            getStars(el.stars)
                        : ''}
                    </div>
                    
                    <p className="reviews-date-p">
                        {formatDate(el.updatedAt)}
                    </p>
                
                    <p className="reviews-review-p" key={el.id}>{el.review}</p>
                    
                    {el?.userId === userData?.id ?
                    <div className="reviews-button-div">
                        <OpenModalButton
                            spotId={el.id}
                            className="reviews-button"
                            buttonText="Update"
                            modalComponent={<UpdateReviewModal spotId={spotId}/>}
                        />
                        <OpenModalButton
                            spotId={el.id}
                            className="reviews-button"
                            buttonText="Delete"
                            modalComponent={<DeleteReviewModal spotId={spotId}/>}
                        />
                    </div>
                    : ''}
                </div>
            )})}
        </div>
    );
}


export default ReviewsComponent;
