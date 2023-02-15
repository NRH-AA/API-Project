import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { useModal } from "../../context/Modal";
import { deleteReview } from "../../store/reviews";

const DeleteReviewModal = ({ spotId }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal, modalSpot } = useModal();
    
    
    const handleClick = (e) => {
        e.preventDefault();
        
        dispatch(deleteReview(spotId, modalSpot));
        closeModal();
        return history.push(`/spots/${spotId}`);
    };
    
    return (
        <div id="delete-reviews-wrapper">
            <h2>Confirm Delete</h2>
            <p id="delete-reviews-p">Are you sure you want to delete this review?</p>
            <div id="delete-reviews-button-div">
                <button className="delete-reviews-button"
                    onClick={handleClick}
                >Yes (Delete Review)</button>
                    
                <button className="delete-reviews-button"
                    onClick={closeModal}
                >No (Keep Review)</button>
            </div>
        </div>
    );
};

export default DeleteReviewModal;
