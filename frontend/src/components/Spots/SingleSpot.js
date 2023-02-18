import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getSpotsState, getSpot } from "../../store/spots";
import { getUserState } from "../../store/session";
import ReviewsComponent from "../Reviews";
import OpenModalButton from "../OpenModalButton";
import DeleteSpotModal from "../DeleteSpotModal";
import UpdateSpotModal from "../UpdateSpotModal";
import './Spots.css';

const SingleSpot = () => {
    const { spotId } = useParams();
    const spotsState = useSelector(getSpotsState);
    const userState = useSelector(getUserState);
    
    const spot = spotsState.singleSpot ? spotsState.singleSpot : null;
    const spotImages = spot ? [...spotsState.singleSpot.SpotImages] : null;
    const spotOwner = spot ? spotsState.singleSpot.Owner : null;
    
    const dispatch = useDispatch();
    
    useEffect(() => {
      dispatch(getSpot(spotId));
    }, [dispatch])
    
    function getSpotLocation() {
      return (
        <p>{spot ? spot.city.toUpperCase() + ", " + spot.state.toUpperCase() + ", " + spot.country.toUpperCase() : ''}</p>
      );
    };
    
    function getSpotOwner() {
      return (
        <h2 id="singleSpot-owner-h2">{spotOwner ? 'Hosted by ' + spotOwner.firstName + ' ' + spotOwner.lastName : ''}</h2>
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
          if (img.preview) return img.url
        }
      }
    }
    
    const getStarReviewsText = () => {
      if (!spot) return ('');
      if (spot.numReviews === 1) return `${spot?.avgStarRating + ' ·'}  ${spot?.numReviews} Review`;
      if (spot.numReviews === 0) return ` New`;
      return `${spot?.avgStarRating + ' ·'}  ${spot?.numReviews} Reviews`
  }
    
    const displayEditButtons = () => {
      if (spot && userState && userState.id === spot.ownerId) {
        return (
          <>
            <OpenModalButton
                spotId={spot.id}
                className="allSpots-button singleSpots-edit-button"
                buttonText="Update"
                modalComponent={<UpdateSpotModal />}
            />
                          
            <OpenModalButton
                spotId={spot.id}
                className="allSpots-button singleSpots-delete-button singleSpots-edit-button"
                buttonText="Delete"
                modalComponent={<DeleteSpotModal />}
            />
          </>
        );
      };
    };
    
    return (
        <div id="singleSpot-wrapper">
          <div id="singleSpot-inner-div">
            
            <div id="singleSpot-title-div">
              <div>
                <h2 className="singleSpot-h2">{spot ? spot.name.toUpperCase() : ''}</h2>
                {getSpotLocation()}
              </div>
              
            </div>
            
            
            <div className="spot-images-div">
              <div className="previewImg-div">
                  <a href={getPreviewImage()} target="_blank">
                    <img className="previewImg" src={getPreviewImage()} />
                  </a>
              </div>
              
              <div className="images-div">
                {spotImages?.map(img => {
                  if (!img.preview) return <a className="images-a" href={img.url} target="_blank"><img className="images" key={img.id} src={img.url}></img></a>
                })}
              </div>
            </div>
            
            
            <div id="singleSpot-edit-buttons-div">
                {displayEditButtons()}
            </div>
            
            <div className="spot-desc-div">
              <div>
                {getSpotOwner()}
                {getSpotDescription()}
              </div>
              
              {spot?.ownerId !== userState?.id ?
                <div className="spot-reserve">
                  <div id="spot-reserve-div">
                    
                    <div id="spot-reserve-text">
                      <p><span id="spot-reserve-span">{spot ? "$" + spot.price : ''}</span> {spot ? ' night' : ''}</p>
                      <b>⭐{getStarReviewsText()}</b>
                    </div>
                    
                    <button id="spot-reserve-button" onClick={() => alert('Feature not implimented.')}>Reserve</button>
                  </div>
                </div>
              : ''}
            </div>
            
            <div>
              <ReviewsComponent spotId={spotId} />
            </div>
            
          </div>
        </div>
    );
};

export default SingleSpot;
