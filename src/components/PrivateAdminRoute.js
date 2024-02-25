import { Navigate } from "react-router-dom";
import useDecodingJwt from "../hook/useDecodingJwt";

function PrivateRoute({ component: Component }) {
  const { myRoles } = useDecodingJwt();

  if (myRoles === null) {
    return <Navigate to="/" />;
  } else if (myRoles === "ADMIN") {
    return Component;
  } else if (myRoles === "USER" || myRoles === "TEMP_USER") {
    return <Navigate to="/forbidden" />;
  } else {
    return <Navigate to="/" />;
  }
}

export default PrivateRoute;
