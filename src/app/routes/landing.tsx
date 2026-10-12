import { Navigate } from "react-router";

import { paths } from "@/config/paths";

const LandingRoute = () => {
  return <Navigate to={paths.leads.path} replace />;
};

export default LandingRoute;
