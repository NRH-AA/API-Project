import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUserSpots, getUserSpotsState } from '../../store/spots';
import OpenModalButton from "../OpenModalButton";
import DeleteSpotModal from "../DeleteSpotModal";
import UpdateSpotModal from "../UpdateSpotModal";
import './Spots.css';

const UserSpotsComponent = () => {
    const userSpots = useSelector(getUserSpotsState);
    
    const spots = userSpots ? userSpots : null;
    
    const dispatch = useDispatch();
    
    if (!spots) dispatch(getUserSpots());
    
    useEffect(() => {
        dispatch(getUserSpots());
    }, [dispatch])
    
    return (
        <div id="allSpots-wrapper">
            {spots?.map(spot => 
            <div key={spot.id} className="spot-div">
                    <Link to={"/spots/" + spot.id}>
                    <img className="allSpots-img" src={spot.previewImage} alt={spot.name}></img>
                    </Link>
                    <div className="allSpots-info-div">
                        <p>{spot.city + ", " + spot.state}</p>
                        <p>{'⭐' + spot.avgRating}</p>
                    </div>
                    
                    <div className="allSpots-price-div">   
                        <p><b>{"$" + spot.price}</b> 
                        {" " + "night"}
                        </p>
                        
                        <OpenModalButton
                            spotId={spot.id}
                            className="allSpots-button allSpots-update-button"
                            buttonText="Update"
                            modalComponent={<UpdateSpotModal />}
                        />
                        
                        <OpenModalButton
                            spotId={spot.id}
                            className="allSpots-button"
                            buttonText="Delete"
                            modalComponent={<DeleteSpotModal />}
                        />
                    </div>
            </div>
            )}
        </div>
    );
};

export default UserSpotsComponent;
