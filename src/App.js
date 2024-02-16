import "../src/css/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import Enter from "./routes/Enter";
import Home from "./routes/Home";
import Managing from "./routes/Managing";
import Statistics from "./routes/Statistics";
import MyPage from "./routes/MyPage";
import Container from "react-bootstrap/esm/Container";
import PrivateRoute from "./components/PrivateRoute";
import PrivateAdminRoute from "./components/PrivateAdminRoute";
import Admin from "./routes/Admin";

function App() {
  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <Container fluid="sm" style={{ height: "100%", overflowY: "auto" }}>
        <Container style={{ height: "100%" }}>
          <Routes>
            <Route path={"/"} element={<Enter />} />
            <Route
              path={"/home"}
              element={<PrivateRoute component={<Home />} />}
            />
            <Route
              path={"/routines"}
              element={<PrivateRoute component={<Managing />} />}
            />
            <Route
              path={"/statistics"}
              element={<PrivateRoute component={<Statistics />} />}
            />
            <Route
              path={"/mypage"}
              element={<PrivateRoute component={<MyPage />} />}
            />
            <Route
              path={"/admin"}
              element={<PrivateAdminRoute component={<Admin />} />}
            />
          </Routes>
        </Container>
      </Container>
    </div>
  );
}

export default App;
