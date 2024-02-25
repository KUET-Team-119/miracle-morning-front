import PropTypes from "prop-types";
import styles from "../css/Profile.module.css";

function Profile({ name, selected, setMemberRoutines }) {
  return (
    <div className={styles.container}>
      <div className={styles.circle} onClick={setMemberRoutines}>
        <div
          className={
            name === selected ? styles.selectedProfile : styles.initialProfile
          }
        />
        <div className={styles.icon}>{name === selected ? "💚" : "💛"}</div>
      </div>
      <p className={styles.name}>{name}</p>
    </div>
  );
}

Profile.propTypes = {
  name: PropTypes.string.isRequired,
  selected: PropTypes.string.isRequired,
  setMemberRoutines: PropTypes.func.isRequired,
};

export default Profile;
