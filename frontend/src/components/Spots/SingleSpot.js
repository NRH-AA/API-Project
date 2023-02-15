import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getSpotsState, getSpot } from "../../store/spots";
import ReviewsComponent from "../Reviews";
import './Spots.css';

const SingleSpot = () => {
    const { spotId } = useParams();
    const spotsState = useSelector(getSpotsState);
    
    const spot = spotsState.singleSpot ? spotsState.singleSpot : null;
    const spotImages = spot ? [...spotsState.singleSpot.SpotImages] : null;
    const spotOwner = spot ? spotsState.singleSpot.Owner : null;
    
    const dispatch = useDispatch();
    
    useEffect(() => {
      dispatch(getSpot(spotId));
    }, [dispatch])
    
    function getSpotLocation() {
      return (
        <p>{spot ? spot.city + ", " + spot.state + ", " + spot.country : ''}</p>
      );
    };
    
    function getSpotOwner() {
      return (
        <h2>{spotOwner ? 'Hosted by ' + spotOwner.firstName + ' ' + spotOwner.lastName : ''}</h2>
      );
    };
    
    function getSpotDescription() {
      return (
      <p>{spot ? spot.description : ''}</p>
      );
    };
    
    function getPreviewImage() {
      if (spotImages) {
        for (let img of spotImages) {
          if (img.preview) {
            return img.url
          }
        }
      }
    }
    
    return (
        <div id="singleSpot-wrapper">
          <div id="singleSpot-inner-div">
            
            <div>
              <h2 className="singleSpot-h2">{spot ? spot.name : ''}</h2>
              {getSpotLocation()}
            </div>
            
            
            <div className="spot-images-div">
              <div className="previewImg-div">
                <img className="previewImg" src={getPreviewImage()}></img>
              </div>
              
              <div className="images-div">
                {spotImages?.map(img => {
                  if (!img.preview) return <img className="images" key={img.id} src={img.url}></img>
                })}
              </div>
            </div>
            
            <div className="spot-desc-div">
              <div>
                {getSpotOwner()}
                {getSpotDescription()}
              </div>
              
              <div className="spot-reserve">
                <div id="spot-reserve-div">
                  <p><span id="spot-reserve-span">{spot ? "$" + spot.price : ''}</span> {spot ? ' night' : ''}</p>
                  <button id="spot-reserve-button" onClick={() => alert('Feature not implimented.')}>Reserve</button>
                </div>
              </div>
            </div>
            
            <div>
              <ReviewsComponent spotId={spotId} />
            </div>
            
          </div>
        </div>
    );
};

export default SingleSpot;
