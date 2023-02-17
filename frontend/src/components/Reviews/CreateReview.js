import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { useState } from "react";
import { useModal } from "../../context/Modal";
import { createReview } from '../../store/reviews';
import Star from './images/star.png';

const CreateReviewModal = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal, modalSpot } = useModal();
    const [stars, setStars] = useState([]);
    const [hoverStars, setHoverStars] = useState([]);
    const [review, setReview] = useState('');
    const [errors, setErrors] = useState([]);
    
    function activateStars(num) {
        if (stars[num]) {
            let cont = true;
            for (let i = num + 1; i <= 5; i++) {
                if (stars[i]) cont = false; break;
            }
            
            if (cont) return setStars([]);
        }
        
        const newValues = [];
        for (let i = 0; i <= num; i++) newValues.push(true);
        for (let i = num + 1; i <= 5; i++) newValues.push(false);
        setStars(newValues);
    };
    
    function hoverStarsCapture(num) {
        const newValues = [];
        for (let i = 0; i <= num; i++) newValues.push(true);
        for (let i = num + 1; i <= 5; i++) newValues.push(false);
        setHoverStars(newValues);
    }
    
    const validateForm = () => {
        const errorHandler = [];
        if (review.length < 30) errorHandler.push("Review must be 30 characters or more");
        return errorHandler;
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        setErrors([]);
        const err = validateForm();
        if (err.length > 0) return setErrors(err);
        
        let starRating = 0;
        for (let i = 0; i <= 5; i++) if (stars[i]) starRating++;
        
        if (starRating === 0) starRating = 1;
        
        dispatch(createReview(modalSpot, {review, stars: starRating}))
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
        });
        
        closeModal();
        return history.push(`/spots/${modalSpot}`);
    }
    
    return (
        <div id="create-review-wrapper">
            <form onSubmit={handleSubmit}>
                <h2>How was your stay?</h2>
                
                <ul>
                    {errors?.map(el => <li key={el} className="error-li">{el}</li>)}
                </ul>
                
                <textarea className="create-review-textarea"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Leave your review here..."
                ></textarea>
                
                <div id="create-review-stars-div">
                    <div>
                        <img 
                            className={`create-review-star 
                            ${stars[0] ? 'create-review-star_active' : 
                                hoverStars[0] ? 'create-review-star_hover' : ''
                            }`}  
                            src={Star}
                            alt="One Star"
                            onMouseEnter={() => hoverStarsCapture(0)}
                            onMouseLeave={() => setHoverStars([])}
                            onClick={() => activateStars(0)}
                        />
                        <img 
                            className={`create-review-star 
                            ${stars[1] ? 'create-review-star_active' : 
                                hoverStars[1] ? 'create-review-star_hover' : ''
                            }`} 
                            src={Star}
                            alt="Two Stars"
                            onMouseEnter={() => hoverStarsCapture(1)}
                            onMouseLeave={() => setHoverStars([])}
                            onClick={() => activateStars(1)}
                        />
                        <img 
                            className={`create-review-star 
                            ${stars[2] ? 'create-review-star_active' : 
                                hoverStars[2] ? 'create-review-star_hover' : ''
                            }`}
                            src={Star}
                            alt="Three Stars"
                            onMouseEnter={() => hoverStarsCapture(2)}
                            onMouseLeave={() => setHoverStars([])}
                            onClick={() => activateStars(2)}
                        />
                        <img 
                            className={`create-review-star 
                            ${stars[3] ? 'create-review-star_active' : 
                                hoverStars[3] ? 'create-review-star_hover' : ''
                            }`} 
                            src={Star}
                            alt="Four Stars"
                            onMouseEnter={() => hoverStarsCapture(3)}
                            onMouseLeave={() => setHoverStars([])}
                            onClick={() => activateStars(3)}
                        />
                        <img 
                            className={`create-review-star 
                            ${stars[4] ? 'create-review-star_active' : 
                                hoverStars[4] ? 'create-review-star_hover' : ''
                            }`} 
                            src={Star}
                            alt="Five Stars"
                            onMouseEnter={() => hoverStarsCapture(4)}
                            onMouseLeave={() => setHoverStars([])}
                            onClick={() => activateStars(4)}
                        />
                    </div>
                    <p>Stars</p>
                </div>
                
                <div id="create-review-buttons-div">   
                    <button className="create-review-button-2"
                        type="submit"
                        disabled={review.length < 10 ? true : false}
                    >Submit Your Review</button>
                    <button className="create-review-button-2"
                        type="button"
                        onClick={closeModal}
                    >Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default CreateReviewModal;
