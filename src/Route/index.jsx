import React from "react";
import { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../Layout/Loader";
import { authRoutes } from "./AuthRoutes";
import LayoutRoutes from "../Route/LayoutRoutes";
import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoute";
import { classes } from "../Data/Layouts";
import { getDashboardPath, getStoredUserRole } from "../Utils/authRole";

// setup fake backend

const Routers = () => {
  const { isAuthenticated, role: authRole } = useSelector((state) => state.auth);
  const defaultLayoutObj = classes.find((item) => Object.values(item).pop(1) === "compact-wrapper");
  const safeLayout = (value) => value && value !== "undefined" ? value : null;
  const defaultLayout = defaultLayoutObj ? Object.keys(defaultLayoutObj).pop() : "Admin";
  const routerBaseName = process.env.PUBLIC_URL || "/";
  const [layout, setLayout] = useState(() => {
    const stored = safeLayout(localStorage.getItem("layout"));
    return stored || defaultLayout;
  });
  const role = authRole || getStoredUserRole();

  useEffect(() => {
    let abortController = new AbortController();
    const storedLayout = safeLayout(localStorage.getItem("layout")) || defaultLayout;
    setLayout(storedLayout);
    const currentPath = window.location.pathname;
    if (currentPath.endsWith("/undefined")) {
      const normalizedPath = currentPath.replace(/\/undefined$/, `/${storedLayout}`);
      window.history.replaceState({}, "", normalizedPath);
    }
    console.ignoredYellowBox = ["Warning: Each", "Warning: Failed"];
    console.disableYellowBox = true;
    return () => {
      abortController.abort();
    };
  }, [defaultLayout]);

  return (
    <BrowserRouter basename={routerBaseName}>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path={"/"} element={<PrivateRoute />}>
            {isAuthenticated && layout ? (
              <>
                <Route exact path={`/`} element={<Navigate to={getDashboardPath(role, layout)} />} />
              </>
            ) : (
              ""
            )}
            <Route path={`/*`} element={<LayoutRoutes />} />
          </Route>

          <Route exact path={`${process.env.PUBLIC_URL}/login`} element={<Login />} />
          {authRoutes.map(({ path, Component }, i) => (
            <Route path={path} element={Component} key={i} />
          ))}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Routers;
