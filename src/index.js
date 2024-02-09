import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
// import axios from "axios";

// 배포 환경에서 baseURL 설정 안됨 -> 문제 없는지 조사
// axios.defaults.baseURL = process.env.REACT_APP_API_URL;
// console.log(process.env.REACT_APP_API_URL);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
