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
                <div>
                    <img className="spotImg" src={spot.previewImage} alt={spot.name}></img>
                    
                    <div className="spots-desc-div">
                        <p className="spots-desc-div-p1">{spot.city + ", " + spot.state}</p>
                        <p className="spots-desc-div-p1">{'⭐' + spot.avgRating}</p>
                    </div>
                    <p className="spots-desc-div-p2"><b>{"$" + spot.price}</b> 
                    {" " + "night"}
                    </p>
                </div>
            </Link>
            )}
        </div>
    );
};

export default SpotComponent;
