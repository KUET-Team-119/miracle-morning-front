import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function CancelOkModal({
  title,
  content,
  btnContent1,
  btnContent2,
  show,
  onAction,
  onHide,
}) {
  return (
    <Modal show={show} centered>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{content}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {btnContent1}
        </Button>
        <Button variant="primary" onClick={onAction}>
          {btnContent2}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CancelOkModal;
