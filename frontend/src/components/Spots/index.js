import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getSpotsState, getAllSpots, getUserSpots } from '../../store/spots';
import './Spots.css';

const SpotComponent = ({ current }) => {
    const spotsState = useSelector(getSpotsState);
    
    let spots = spotsState.allSpots ? spotsState.allSpots : null;
    if (current !== "true") spots = spotsState.allSpots ? spotsState.allSpots : null;
    else spots = spotsState.userSpots ? spotsState.userSpots : null;
    
    const dispatch = useDispatch();
    
    useEffect(() => {
        if (!spots) {
            dispatch(getAllSpots());
            if (current === "true") dispatch(getUserSpots());
        }
    }, [dispatch])
    
    const userButtons = (spotId) => {
        return (
            <>
                <Link className="allSpots-update-button allSpots-button"
                    to={`/spots/${spotId}/update`}
                >Update</Link>
                
                <Link className="allSpots-button"
                    to={`/spots/${spotId}/delete`}
                >Delete</Link>
            </>
        );
    };
    
    return (
        <div id="allSpots-wrapper">
            {spots?.map(spot => 
            <Link key={spot.id} className="spotLink" to={"/spots/" + spot.id}>
                    <img className="allSpots-img" src={spot.previewImage} alt={spot.name}></img>
                    
                    <div className="allSpots-info-div">
                        <p>{spot.city + ", " + spot.state}</p>
                        <p>{'⭐' + spot.avgRating}</p>
                    </div>
                    
                    <div className="allSpots-price-div">   
                        <p><b>{"$" + spot.price}</b> 
                        {" " + "night"}
                        </p>
                        
                        {current === "true" ? userButtons(spot.id) : ''}
                    </div>
            </Link>
            )}
        </div>
    );
};

export default SpotComponent;
