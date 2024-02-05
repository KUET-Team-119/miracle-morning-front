import { Link } from "react-router-dom";
import styles from "../css/Detail.module.css";
import moment from "moment";
import useDecodingJwt from "../hook/useDecodingJwt";
import Header from "../components/Header";

function Detail() {
  const { myName } = useDecodingJwt();
  return (
    <>
      <Header />
      <div className={styles.detailBody}>
        <div className={styles.detailContainer}>
          <div className={styles.header}>
            <Link to={`/statistics/${myName}`}>뒤로 가기</Link>
            <h2>{moment(new Date()).format("YYYY년 MM월 루틴별 현황")}</h2>
          </div>
          <div className={styles.content}></div>
        </div>
      </div>
    </>
  );
}

export default Detail;
