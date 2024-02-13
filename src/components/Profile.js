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
            style={{
              position: "relative",
              textAlign: "center",
              height: 48,
              cursor: "pointer",
            }}
            onClick={setMemberRoutines}
          >
            <div
              className={
                name === selected
                  ? styles.selectedProfile
                  : styles.initialProfile
              }
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              💚
            </div>
          </div>
          <p style={{ fontSize: 12 }}>{name}</p>
        </Row>
      </div>
    </>
  );
}

export default Profile;
