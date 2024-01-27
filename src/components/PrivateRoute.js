import { Navigate } from "react-router-dom";
import useDecodingJwt from "../hook/useDecodingJwt";

function PrivateRoute({ component: Component }) {
  const { myRoles, myExp } = useDecodingJwt();

  if (myRoles === null || myExp === null) {
    // JWT가 없으면 로그인 페이지로 이동
    console.log("미확인 사용자");
    return <Navigate to="/" />;
  } else {
    const currentTime = Date.now() / 1000;

    if (myExp < currentTime) {
      // JWT가 만료되었으면 로그인 페이지로 이동
      console.log("만료된 JWT");
      return <Navigate to="/" />;
    } else {
      if (myRoles === "USER") {
        console.log("인증된 사용자");
        return Component;
      } else if (myRoles === "TEMP_USER") {
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
