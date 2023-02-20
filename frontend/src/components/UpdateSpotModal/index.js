import * as spotActions from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import { useState } from "react";
import { useModal } from "../../context/Modal";
import './UpdateSpot.css';


const UpdateSpotModal = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const spotState = useSelector(spotActions.getUserSpotsState);
    const spotStateSingle = useSelector(spotActions.getSingleSpotState);
    const { closeModal, modalSpot } = useModal();
    
    let spot;
    if (spotState) {
        for (let i in spotState) {
            if (spotState[i].id === modalSpot) {
                spot = spotState[i];
            };
        };
    };
    
    
    if (!spot) spot = spotStateSingle;
    
    console.log(spot);
    
    const [country, setCountry] = useState(spot.country ? spot.country : '');
    const [address, setAddress] = useState(spot.address ? spot.address : '');
    const [city, setCity] = useState(spot.city ? spot.city : '');
    const [state, setState] = useState(spot.state ? spot.state : '');
    const [description, setDescription] = useState(spot.description ? spot.description : '');
    const [name, setName] = useState(spot.name ? spot.name : '');
    const [price, setPrice] = useState(spot.price ? spot.price : '');
    const [image1, setImage1] = useState('');
    const [image2, setImage2] = useState('');
    const [image3, setImage3] = useState('');
    const [image4, setImage4] = useState('');
    const [image5, setImage5] = useState('');
    const [errors, setErrors] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    
    const lat = '0.00';
    const lng = '0.00';
    
    const validateForm = () => {
        const err = {};
        
        if (!country) err.country = "Country is required";
        if (country.length < 5 || country.length > 20) err.country = "Country length must be 5-20 characters";
        if (!address) err.address = "Address is required";
        if (address.length < 5 || address.length > 20) err.address = "Address length must be 5-20 characters";
        if (!city) err.city = "City is required"
        if (city.length < 5 || city.length > 15) err.city = "City length must be 5-15 characters";
        if (!state) err.state = "State is required";
        if (state.length < 5 || state.length > 15) err.state = "State length must be 5-15 characters";
        if (description.length < 30) err.desc = "Description needs a minimum of 30 characters";
        if (description.length > 250) err.desc = "Description needs a maximum of 250 characters";
        if (!name) err.name = "Name is required";
        if (name.length < 5 || name.length > 20) err.name = "Title length must be 5-20 characters";
        if (!price) err.price = "Price is required";
        if (price === 0) err.price = "Price cannot be zero" 
        if (description.length < 30) err.desc = "Description needs a minimum of 30 characters";
        if (!name) err.name = "Name is required";
        if (!price) err.price = "Price is required";
        
        if (image1 && !image1.endsWith('.png') && !image1.endsWith('.jpg') && !image1.endsWith('.jpeg')) {
            err.image1 = "Image URL must end in .png, .jpg, or .jpeg"
        }
        if (image2 && !image2.endsWith('.png') && !image2.endsWith('.jpg') && !image2.endsWith('.jpeg')) {
            err.image2 = "Image URL must end in .png, .jpg, or .jpeg"
        }
        if (image3 && !image3.endsWith('.png') && !image3.endsWith('.jpg') && !image3.endsWith('.jpeg')) {
            err.image1 = "Image URL must end in .png, .jpg, or .jpeg"
        }
        if (image4 && !image4.endsWith('.png') && !image4.endsWith('.jpg') && !image4.endsWith('.jpeg')) {
            err.image1 = "Image URL must end in .png, .jpg, or .jpeg"
        }
        if (image5 && !image5.endsWith('.png') && !image5.endsWith('.jpg') && !image5.endsWith('.jpeg')) {
            err.image1 = "Image URL must end in .png, .jpg, or .jpeg"
        }
        
        return err;
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const validateErrors = validateForm();
        if (Object.values(validateErrors).length > 0) {
            setFormErrors(validateErrors);
            return;
        };
        
        setErrors([]);
        
        const spotData = {
            id: modalSpot,
            address,
            city,
            state,
            country,
            name,
            description,
            price,
            lat,
            lng
        };
        
        const imageData = [];
        imageData.push({url: image1, preview: true});
        if (image2) imageData.push({url: image2, preview: false});
        if (image3) imageData.push({url: image3, preview: false});
        if (image4) imageData.push({url: image4, preview: false});
        if (image5) imageData.push({url: image5, preview: false});
        
        dispatch(spotActions.updateSpot(spotData, imageData))
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
        });
        
        closeModal();
        return history.push(`/spots/${modalSpot}`);
    };
    
    return (
        <div className="create-spot-wrapper">
            <h2>Update your Spot</h2>
            
            <div>
                <ul>
                    {errors?.map(e => <li className="error-msg" key={e}>{e}</li>)}
                </ul>
            </div>
            
            <form onSubmit={handleSubmit}>
                <div id="create-spot-top">
                    <div className="create-spot-input-div">
                        <label>Country <span className="error-msg">{formErrors.country ? formErrors.country : ''}</span></label>
                        <input className="create-spot-input" type="text" placeholder='Country' value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        ></input>
                    </div>
                    
                    <div className="create-spot-input-div">
                        <label>Street Address <span className="error-msg">{formErrors.address ? formErrors.address : ''}</span></label>
                        <input className="create-spot-input" type="text" placeholder='Address' value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        ></input>
                    </div>
                    
                    <div id="city-state-div">
                        <div id="create-spot-input-city-div">
                            <label>City <span className="error-msg">{formErrors.city ? formErrors.city : ''}</span></label>
                            <input className="create-spot-input" type="text" placeholder='City' value={city}
                                onChange={(e) => setCity(e.target.value)}
                            ></input>
                        </div>
                        <div id="create-spot-input-state-div">
                            <label>State <span className="error-msg">{formErrors.state ? formErrors.state : ''}</span></label>
                            <input className="create-spot-input" type="text" placeholder='State' value={state}
                                onChange={(e) => setState(e.target.value)}
                            ></input>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h3>Description</h3>
                    
                    <div id="desc-div">
                        <textarea id="desc-textarea" name="description" value={description}
                            placeholder='Please write at least 30 characters'
                            onChange={(e) => setDescription(e.target.value)}
                        > 
                        </textarea>
                        <span className="error-msg">{formErrors.desc ? formErrors.desc : ''}</span>
                    </div>
                </div>
                
                <div id="title-div">
                    <h3>Title</h3>
                    
                    <div>
                        <input className="create-spot-input create-spot-input2" type='text' value={name}
                            placeholder='Name of your spot'
                            onChange={(e) => setName(e.target.value)}
                        ></input>
                        <span className="error-msg">{formErrors.name ? formErrors.name : ''}</span>
                    </div>
                </div>
                
                <div id="price-div">
                    <h3 id="price-h3">Price per night</h3>
                    <span>$ </span><input className="create-spot-input" id="price-input" type="text" value={price ? price : 0}
                        placeholder='price'
                        onChange={(e) => setPrice(e.target.value)}
                        ></input>
                    <span className="error-msg">{formErrors.price ? formErrors.price : ''}</span>
                </div>
                
                <div id="images-div">
                    <input className="create-spot-input imageUrl-input" type="text" placeholder='Preview Image URL' value={image1}
                        onChange={(e) => setImage1(e.target.value)}
                    ></input>
                    <span className="error-msg">{formErrors.image1 ? formErrors.image1 : ''}</span>
                    
                    <input className="create-spot-input imageUrl-input" type="text" placeholder='Image URL' value={image2}
                        onChange={(e) => setImage2(e.target.value)}
                    ></input>
                    <span className="error-msg">{formErrors.image2 ? formErrors.image2 : ''}</span>
                    
                    <input className="create-spot-input imageUrl-input" type="text" placeholder='Image URL' value={image3}
                        onChange={(e) => setImage3(e.target.value)}
                    ></input>
                    <span className="error-msg">{formErrors.image3 ? formErrors.image3 : ''}</span>
                    
                    <input className="create-spot-input imageUrl-input" type="text" placeholder='Image URL' value={image4}
                        onChange={(e) => setImage4(e.target.value)}
                    ></input>
                    <span className="error-msg">{formErrors.image4 ? formErrors.image4 : ''}</span>
                    
                    <input className="create-spot-input imageUrl-input" type="text" placeholder='Image URL' value={image5}
                        onChange={(e) => setImage5(e.target.value)}
                    ></input>
                    <span className="error-msg">{formErrors.image5 ? formErrors.image5 : ''}</span>
                    
                </div>
                
                <div id="update-spot-button-div">
                    <button className="update-spot-button" type="submit">Update</button>
                    <button type="button" className="update-spot-button" onClick={closeModal}>Cancel</button>
                </div>
                
            </form>
        </div>
    );
};

export default UpdateSpotModal;
