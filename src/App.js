import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import NavigationBar from "./Components/NavigationBar/NavigationBar";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Authentication/Login";
import Signup from "./Pages/Authentication/Signup";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Config/init-firebase";
import {
  getAuthData,
  REMOVE_USER,
  SET_USER,
} from "./Pages/Authentication/AuthenticationSlice";
import Toast from "./Components/UI/Toast/Toast";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import Profile from "./Pages/Profile/Profile";
import { ADD_TOAST } from "./Components/UI/Toast/ToastSlice";
import { DANGER, LOCALTALKS_USERS } from "./Constant/constant";
import { getAllPost } from "./Components/PostSlice/PostSlice";
import { getAllUserProfiles } from "./Components/UserSlice/UserSlice";

function App() {
  const { pathname } = useLocation();
  const { isAuthenticated } = useSelector(getAuthData);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(SET_USER(user));
      } else {
        dispatch(REMOVE_USER(null));
      }
    });

    return () => unsubscribe();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getAllPost())
        .unwrap()
        .then()
        .catch((error) => {
          dispatch(ADD_TOAST(DANGER, error.message));
        });

      dispatch(getAllUserProfiles())
        .unwrap()
        .then()
        .catch((error) => {
          dispatch(ADD_TOAST(DANGER, error.message));
        });
    }
  }, [isAuthenticated, dispatch]);

  return (
    <div className="App">
      <Toast position={"top-left"} autoDeleteInterval={3000} />
      {!(pathname === "/login" || pathname === "/signup") && <NavigationBar />}
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:profileId"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
