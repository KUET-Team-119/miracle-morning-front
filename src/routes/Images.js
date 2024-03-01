import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import useAxiosGet from "../hook/useAxiosGet";
import Menu from "../components/Menu";
import { Card, Col, Row, Spinner } from "react-bootstrap";
import styles from "../css/Images.module.css";
import homeIcon from "../images/home.png";
import menuIcon from "../images/menu.png";

function Images() {
  const [responseProof, setResponseProof] = useState([]);
  const [menuShow, setMenuShow] = useState(false);
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/home");
  };

  // 인증 사진 조회
  const { responseData, error, isLoading } = useAxiosGet({
    url: `/api/results/today`,
  });
  useEffect(() => {
    if (!isLoading) {
      if (responseData !== null) {
        setResponseProof(responseData);
      } else {
        const status = error.response.status;
        if (status === 401) {
          navigate("/unauthorized");
        } else if (status === 403) {
          navigate("/forbidden");
        } else if (status === 404) {
          navigate("/not-found");
        } else {
          navigate("/server-error");
        }
      }
    }
  }, [responseData, error, isLoading]);

  return (
    <div className={styles.container}>
      <Menu
        show={menuShow}
        onHide={() => {
          setMenuShow(false);
        }}
      />
      <div className={styles.headerContainer}>
        <div className={styles.header}>
          <div className={styles.intro}>
            <p>{moment().format("M월 D일")} 인증 피드입니다🌱</p>
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
      {isLoading ? (
        <div className={styles.spinner}>
          <Spinner animation="border" />
        </div>
      ) : (
        <div className={styles.content}>
          {responseProof.length !== 0 ? (
            <Row xs={1} sm={2} md={3} lg={4} className="g-3">
              {responseProof.map((result) => (
                <Col key={result.resultId}>
                  <Card className={styles.card}>
                    <Card.Img
                      variant="top"
                      src={`data:image;base64,${result.fileBase64}`}
                    />
                    <Card.Body>
                      <Card.Title>{result.routineName}</Card.Title>
                      <Card.Subtitle>{result.memberName}</Card.Subtitle>
                      <Card.Text>
                        {moment(result.doneAt).format("YYYY년 M일 D일 H시 m분")}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className={styles.noProof}>
              <p>아직 아무도 루틴을 인증하지 않았어요😯</p>
              <p>가장 먼저 하루를 열어볼까요?</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Images;
