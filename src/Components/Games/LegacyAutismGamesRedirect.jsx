import React from "react";
import { Navigate, useParams } from "react-router-dom";

const LegacyAutismGamesRedirect = () => {
  const { layout } = useParams();
  const target = `${process.env.PUBLIC_URL}/autizm-game${layout ? `/${layout}` : ""}`;

  return <Navigate to={target} replace />;
};

export default LegacyAutismGamesRedirect;
