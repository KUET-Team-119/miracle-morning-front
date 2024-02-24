import { Navigate } from "react-router-dom";
import useDecodingJwt from "../hook/useDecodingJwt";

function PrivateRoute({ component: Component }) {
  const { myRoles, myExp } = useDecodingJwt();

  if (myRoles === null || myExp === null) {
    // JWT가 없으면 로그인 페이지로 이동
    return <Navigate to="/" />;
  } else {
    const currentTime = Date.now() / 1000;

    if (myExp < currentTime) {
      // JWT가 만료되었으면 로그인 페이지로 이동
      return <Navigate to="/expired" />;
    } else {
      if (myRoles === "ADMIN") {
        return Component;
      } else if (myRoles === "USER" || myRoles === "TEMP_USER") {
        return <Navigate to="/forbidden" />;
      } else {
        return <Navigate to="/" />;
      }
    }
  }
}

export default PrivateRoute;
