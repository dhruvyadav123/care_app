import React, { Fragment } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { adminRoutes, expertRoutes } from './Routes';
import AppLayout from '../Layout/Layout';
import { getDashboardPath, getStoredUserRole, USER_ROLES } from '../Utils/authRole';

const LayoutRoutes = () => {
  const storedRole = getStoredUserRole();
  const role = useSelector((state) => state.auth.role) || storedRole;
  const accessibleRoutes = role === USER_ROLES.EXPERT ? expertRoutes : adminRoutes;

  return (
    <>
      <Routes>
        {accessibleRoutes.map(({ path, Component }, i) => (
          <Fragment key={i}>
          <Route element={<AppLayout />} key={i}>
            <Route path={path} element={Component} />
          </Route>
          </Fragment>
        ))}
        <Route path="*" element={<Navigate to={getDashboardPath(role)} replace />} />
      </Routes>
    </>
  );
};

export default LayoutRoutes;
