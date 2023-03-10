import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllSpotsState, getAllSpots } from '../../store/spots';
import './Spots.css';

const SpotComponent = () => {
    const spotsState = useSelector(getAllSpotsState);
    
    const spots = spotsState ? spotsState : null;
    
    const dispatch = useDispatch();
    
    if (!spots) dispatch(getAllSpots());
    
    useEffect(() => {
        dispatch(getAllSpots());
    }, [dispatch])
    
    return (
        <div id="allSpots-wrapper">
            {spots?.map(spot => 
            <Link key={spot.id} className="spotLink" to={"/spots/" + spot.id}>
                    <img className="allSpots-img" src={spot.previewImage} alt={spot.name}></img>
                    
                    <div className="allSpots-info-div">
                        <p className="allSpots-p">{spot.city + ", " + spot.state}</p>
                        <p className="allSpots-p-2">⭐ {spot?.avgRating > 0 ? spot.avgRating : 'New'}</p>
                    </div>
                    
                    <div className="allSpots-price-div">   
                        <p className="allSpots-p"><b>{"$" + spot.price}</b> 
                        {" " + "night"}
                        </p>
                    </div>
            </Link>
            )}
        </div>
    );
};

export default SpotComponent;
