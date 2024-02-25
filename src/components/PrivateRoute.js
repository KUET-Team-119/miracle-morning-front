import { Navigate } from "react-router-dom";
import useDecodingJwt from "../hook/useDecodingJwt";

function PrivateRoute({ component: Component }) {
  const { myRoles } = useDecodingJwt();

  if (myRoles === null) {
    return <Navigate to="/" />;
  } else if (myRoles === "USER") {
    return Component;
  } else if (myRoles === "ADMIN") {
    return <Navigate to="/admin/member-managing" />;
  } else if (myRoles === "TEMP_USER") {
    return <Navigate to="/" />;
  } else {
    return <Navigate to="/" />;
  }
}

export default PrivateRoute;
