import RoutineCalendar from "../components/RoutineCalendar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Stack } from "react-bootstrap";
import useDecodingJwt from "../hook/useDecodingJwt";
import Menu from "../components/Offcanvas";
import homeIcon from "../images/home.png";
import menuIcon from "../images/menu.png";

function Statistics() {
  const { myName } = useDecodingJwt();

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
      <Stack gap={1}>
        <Container
          className="d-flex justify-content-center align-items-start"
          style={{ marginTop: 16, marginBottom: 16 }}
        >
          <div>
            <p style={{ padding: 0, margin: 0 }}>
              <span style={{ color: "#69973A" }}>{myName}</span>님의 루틴 기록🌱
            </p>
          </div>
          <img
            className="ms-auto"
            src={homeIcon}
            onClick={goToHome}
            alt="홈"
            style={{ width: 24, height: 24, marginRight: 12 }}
          ></img>
          <img
            src={menuIcon}
            onClick={() => {
              setMenuShow(true);
            }}
            alt="메뉴"
            style={{ width: 24, marginRight: 12 }}
          ></img>
        </Container>
        <Container className="d-flex flex-column justify-content-center align-items-center">
          <div>
            <RoutineCalendar />
          </div>
        </Container>
      </Stack>
    </>
  );
}

export default Statistics;
