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
        <>
        <h2 style={{marginLeft: 20}}>Manage Spots</h2>
        <p style={{marginLeft: 20, fontSize: 18}}>{spots?.length === 0 ? 'You have no spots yet' : ''}</p>
        <div id="allSpots-wrapper">
            {spots?.map(spot => 
                <Link key={spot.id} className="spotLink" to={"/spots/" + spot.id}>
                    <img className="allSpots-img" src={spot.previewImage} alt={spot.name}></img>
                    
                    <div className="allSpots-info-div">
                        <p className="allSpots-p">{spot.city + ", " + spot.state}</p>
                        <p className="allSpots-p-2">{'⭐' + spot.avgRating}</p>
                    </div>
                    
                    <div className="allSpots-price-div">   
                        <p className="allSpots-p"><b>{"$" + spot.price}</b> 
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
            </Link>
            )}
        </div>
        </>
    );
};

export default UserSpotsComponent;
