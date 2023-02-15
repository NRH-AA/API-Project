import * as spotActions from "../../store/spots";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import './DeleteSpot.css';

const DeleteSpotModal = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal, modalSpot } = useModal();
    
    const handleDelete = (e) => {
        e.preventDefault();
        
        if (modalSpot) dispatch(spotActions.deleteSpot(modalSpot));
        closeModal();
        return history.push('/spots/current');
    };
    
    return (
        <>
         <div id="delete-spot-div">
            <h3>Are you sure you want to delete this spot?</h3>
            <div id="delete-spot-button-div">
                <button className="delete-spot-button" onClick={handleDelete}>Delete</button>
                <button className="delete-spot-button" onClick={closeModal}>Cancel</button>
            </div>
         </div>
        </>
    );
};

export default DeleteSpotModal;
