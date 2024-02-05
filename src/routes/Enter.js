import { useState } from "react";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import { Container, Row } from "react-bootstrap";

function Enter() {
  const [isMember, setIsMember] = useState(true);

  // 로그인 상자와 회원가입 상자 switch
  const switchBox = () => {
    setIsMember((current) => !current);
  };

  return (
    <Container style={{ height: "100%" }}>
      {isMember ? (
        <Login setIsMember={switchBox} />
      ) : (
        <SignUp setIsMember={switchBox} />
      )}
    </Container>
  );
}

export default Enter;
