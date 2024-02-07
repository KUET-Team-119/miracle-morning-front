import RoutineCalendar from "../components/RoutineCalendar";
import { Link } from "react-router-dom";
import useDecodingJwt from "../hook/useDecodingJwt";
import { Container, Image, Stack } from "react-bootstrap";
import useQuote from "../hook/useQuote";
import { useState } from "react";
import Menu from "../components/Offcanvas";
import homeIcon from "../images/home.png";
import menuIcon from "../images/menu.png";
import { useNavigate } from "react-router-dom";

function Statistics() {
  const { myName } = useDecodingJwt();
  const { quote, author } = useQuote();
  const [menuShow, setMenuShow] = useState(false);

  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/home");
  };

  return (
    <>
      <Menu
        show={menuShow}
        onHide={() => {
          setMenuShow(false);
        }}
      />
      <Container>
        <Stack direction="horizontal">
          <p style={{ marginLeft: 12 }}>
            <span style={{ color: "#69973A" }}>{myName}</span>님의 루틴 기록🌱
          </p>
          <Image
            className="ms-auto"
            src={homeIcon}
            onClick={goToHome}
            alt="홈"
            style={{ width: 24, marginRight: 12 }}
          ></Image>
          <Image
            src={menuIcon}
            onClick={() => {
              setMenuShow(true);
            }}
            alt="메뉴"
            style={{ width: 24, marginRight: 12 }}
          ></Image>
        </Stack>
        <div>{quote}</div>
        <div>{" - " + author}</div>
        <div>
          <Link to={`/statistics/detail`}>자세히 보기</Link>
          <RoutineCalendar />
        </div>
      </Container>
    </>
  );
}

export default Statistics;
