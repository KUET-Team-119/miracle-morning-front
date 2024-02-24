import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useDecodingJwt from "../hook/useDecodingJwt";
import Menu from "../components/Offcanvas";
import styles from "../css/Forbidden.module.css";
import homeIcon from "../images/home.png";
import menuIcon from "../images/menu.png";

function Forbidden() {
  const { myName } = useDecodingJwt();
  const [menuShow, setMenuShow] = useState(false);
  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/home");
  };

  return (
    <div className={styles.container}>
      <Menu
        show={menuShow}
        onHide={() => {
          setMenuShow(false);
        }}
      />
      <div className={styles.header}>
        <div className={styles.intro}>
          <p>
            <span>{myName}</span>님이 접근할 수 없는 페이지입니다⛔
          </p>
        </div>
        <div className={styles.headerIcon}>
          <img src={homeIcon} onClick={goToHome} alt="홈" />
          <img
            src={menuIcon}
            onClick={() => {
              setMenuShow(true);
            }}
            alt="메뉴"
          />
        </div>
      </div>
    </div>
  );
}

export default Forbidden;
