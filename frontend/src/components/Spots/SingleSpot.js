import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getSpotsState, getSpot } from "../../store/spots";
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
        <h2>{spotOwner ? 'Hosted by ' + spotOwner.firstname + ' ' + spotOwner.lastName : ''}</h2>
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
        <>
          <div className="singleSpot-wrapper">
            <div>
                <h2>{spot ? spot.name : ''}</h2>
                {getSpotLocation()}
            </div>
            
            <div className="spot-images-div">
              <div className="previewImg-div">
                <img className="previewImg" src={getPreviewImage()}></img>
              </div>
              
              <div className="images-div">
                {spotImages?.map(img => <img className="images" src={img.url}></img>)}
              </div>
            </div>
            
            <div className="spot-desc-div">
              <div className="spot-desc">
                {getSpotOwner()}
                {getSpotDescription()}
              </div>
              
              <div className="spot-reserve">
                <p>{spot ? "$" + spot.price + ' night' : ''}</p>
              </div>
            </div>
            
          </div>
        </>
    );
};

export default SingleSpot;
