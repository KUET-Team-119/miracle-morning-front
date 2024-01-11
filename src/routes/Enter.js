import { useState } from "react";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import "../css/Enter.css";

function Enter() {
  const [isMember, setIsMember] = useState(true);

  // 로그인 상자와 회원가입 상자 switch
  const switchBox = () => {
    setIsMember((current) => !current);
  };

  return (
    <div className="enterBody">
      <div className="enterContainer">
        {isMember ? (
          <Login setIsMember={switchBox} />
        ) : (
          <SignUp setIsMember={switchBox} />
        )}
      </div>
    </div>
  );
}

export default Enter;
