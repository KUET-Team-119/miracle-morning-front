import { Navigate } from "react-router-dom";
import base64 from "base-64";
import utf8 from "utf8";

function PrivateRoute({ component: Component }) {
  // sessionStorage에서 "access-token" 키로 저장된 JWT 가져오기
  const jwt = sessionStorage.getItem("access-token");

  if (!jwt) {
    // JWT가 없으면 로그인 페이지로 이동
    console.log("미확인 사용자");
    return <Navigate to="/" />;
  } else {
    // Jwt 디코딩
    const payload = jwt.split(".")[1];
    const decodingInfo = base64.decode(payload);
    const decodingInfoUtf8 = utf8.decode(decodingInfo);
    const decodingInfoJson = JSON.parse(decodingInfoUtf8);
    const roles = decodingInfoJson.roles;
    const exp = decodingInfoJson.exp;

    const currentTime = Date.now() / 1000;

    if (exp < currentTime) {
      // JWT가 만료되었으면 로그인 페이지로 이동
      console.log("만료된 JWT");
      return <Navigate to="/" />;
    } else {
      if (roles === "USER") {
        console.log("인증된 사용자");
        return Component;
      } else if (roles === "TEMP_USER") {
        console.log("승인 대기 중인 사용자");
        return <Navigate to="/" />;
      } else {
        console.log("미확인 사용자");
        return <Navigate to="/" />;
      }
    }
  }
}

export default PrivateRoute;
