import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpotsState, getAllSpots } from '../../store/spots';
import './Spots.css';
import { Link } from "react-router-dom";

const SpotComponent = () => {
    const spotsState = useSelector(getSpotsState);
    const spots = spotsState.allSpots ? spotsState.allSpots : null;
    
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(getAllSpots());
    }, [dispatch])
    
    return (
        <div className="spots-div">
            {spots?.map(spot => 
            <Link className="spotLink" to={"/spots/" + spot.id} props={spot.id}>
                <div className="spots-div-wrap">
                    <img className="spotImg" src={spot.previewImage} alt={spot.name}></img>
                    
                    <div>
                        <span>{spot.city + ", " + spot.state}</span>
                        <span className="spotSpan"><b>{"$" + spot.price}</b> 
                        {" " + "night"}
                        </span>
                    </div>
                </div>
            </Link>
            )}
        </div>
    );
};

export default SpotComponent;
