import { useModal } from '../../context/Modal';
import './ModalButton.css';

function OpenModalButton({
  className,
  spotId,
  modalComponent, // component to render inside the modal
  buttonText, // text of the button that opens the modal
  onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose // optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose, setModalSpot } = useModal();

  const onClick = () => {
    if (typeof onButtonClick === 'function') onButtonClick();
    if (typeof onModalClose === 'function') setOnModalClose(onModalClose);
    if (spotId) setModalSpot(spotId);
    setModalContent(modalComponent);
  };

  return (
    <button className={className} onClick={onClick}>{buttonText}</button>
  );
}

export default OpenModalButton;
