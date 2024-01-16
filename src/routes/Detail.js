import { Link, useParams } from "react-router-dom";
import styles from "../css/Detail.module.css";
import moment from "moment";

function Detail() {
  const { memberName } = useParams();
  return (
    <div>
      <div className={styles.detailBody}>
        <div className={styles.detailContainer}>
          <div className={styles.header}>
            <Link to={`/statistics/${memberName}`}>뒤로 가기</Link>
            <h2>{moment(new Date()).format("YYYY년 MM월 루틴별 현황")}</h2>
          </div>
          <div className={styles.content}></div>
          <div className={styles.navContainer}>
            <div className="navItem">
              <Link to={`/home/${memberName}`}>홈</Link>
            </div>
            <div className={styles.navContainer}>
              <Link to={`/routines/${memberName}`}>루틴관리</Link>
            </div>
            <div className={styles.navContainer}>
              <Link to={`/statistics/${memberName}`}>루틴현황</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
