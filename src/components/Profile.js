import { Row } from "react-bootstrap";
import styles from "../css/Profile.module.css";

function Profile({ name, selected, setMemberRoutines }) {
  return (
    <>
      <div
        className="d-flex flex-row justify-content-start"
        style={{ marginLeft: 16, marginRight: 24 }}
      >
        <Row className="d-flex flex-column align-items-center">
          <div
            className={
              name === selected ? styles.selectedProfile : styles.initialProfile
            }
            onClick={setMemberRoutines}
          >
            💚
          </div>
          <p style={{ fontSize: 12 }}>{name}</p>
        </Row>
      </div>
    </>
  );
}

export default Profile;
