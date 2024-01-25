import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function SingleBtnModal({ title, content, btnContent, show, onHide }) {
  return (
    <Modal show={show} centered>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{content}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>
          {btnContent}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SingleBtnModal;
