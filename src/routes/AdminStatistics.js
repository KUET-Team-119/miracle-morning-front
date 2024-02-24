import { useState } from "react";
import useDecodingJwt from "../hook/useDecodingJwt";
import AdminMenu from "../components/AdminMenu";
import styles from "../css/AdminStatistics.module.css";
import homeIcon from "../images/home.png";
import menuIcon from "../images/menu.png";
import { useNavigate } from "react-router-dom";

function AdminStatistics() {
  const { myName } = useDecodingJwt();
  const [menuShow, setMenuShow] = useState(false);
  const navigate = useNavigate();

  const goToMemberManaging = () => {
    navigate("/admin/membermanaging");
  };

  return (
    <div className={styles.container}>
      <AdminMenu
        show={menuShow}
        onHide={() => {
          setMenuShow(false);
        }}
      />
      <div className={styles.header}>
        <div className={styles.intro}>
          <p>
            관리자 <span>{myName}</span>님 환영합니다.
          </p>
          <p>통계 관리 페이지입니다🔧</p>
        </div>
        <div className={styles.headerIcon}>
          <img src={homeIcon} onClick={goToMemberManaging} alt="홈" />
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

export default AdminStatistics;
