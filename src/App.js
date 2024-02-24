import "../src/css/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import Enter from "./routes/Enter";
import Forbidden from "./routes/Forbidden";
import Expired from "./routes/Expired";
import Home from "./routes/Home";
import Managing from "./routes/Managing";
import Statistics from "./routes/Statistics";
import Images from "./routes/Images";
import MyPage from "./routes/MyPage";
import AdminMemberManaging from "./routes/AdminMemberManaging";
import AdminImages from "./routes/AdminImages";
import AdminComplaints from "./routes/AdminComplaints";
import AdminStatistics from "./routes/AdminStatistics";
import AdminMyPage from "./routes/AdminMyPage";
import PrivateRoute from "./components/PrivateRoute";
import PrivateAdminRoute from "./components/PrivateAdminRoute";

function App() {
  return (
    <div className="window">
      <div className="body">
        <Routes>
          <Route path={"/"} element={<Enter />} />
          <Route path={"/forbidden"} element={<Forbidden />} />
          <Route path={"/expired"} element={<Expired />} />
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
            path={"/images"}
            element={<PrivateRoute component={<Images />} />}
          />
          <Route
            path={"/mypage"}
            element={<PrivateRoute component={<MyPage />} />}
          />
          <Route
            path={"/admin/membermanaging"}
            element={<PrivateAdminRoute component={<AdminMemberManaging />} />}
          />
          <Route
            path={"/admin/images"}
            element={<PrivateAdminRoute component={<AdminImages />} />}
          />
          <Route
            path={"/admin/statistics"}
            element={<PrivateAdminRoute component={<AdminStatistics />} />}
          />
          <Route
            path={"/admin/complaints"}
            element={<PrivateAdminRoute component={<AdminComplaints />} />}
          />
          <Route
            path={"/admin/mypage"}
            element={<PrivateAdminRoute component={<AdminMyPage />} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
