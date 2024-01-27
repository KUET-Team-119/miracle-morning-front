import { Link } from "react-router-dom";
import styles from "../css/Detail.module.css";
import moment from "moment";
import NavigationBar from "../components/NavigationBar";
import useDecodingJwt from "../hook/useDecodingJwt";

function Detail() {
  const { myName } = useDecodingJwt();
  return (
    <div>
      <div className={styles.detailBody}>
        <div className={styles.detailContainer}>
          <div className={styles.header}>
            <Link to={`/statistics/${myName}`}>뒤로 가기</Link>
            <h2>{moment(new Date()).format("YYYY년 MM월 루틴별 현황")}</h2>
          </div>
          <div className={styles.content}></div>
          <NavigationBar memberName={myName} />
        </div>
      </div>
    </div>
  );
}

export default Detail;
