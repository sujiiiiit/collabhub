import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import Login from "@/pages/components/Login";

interface AuthRouteProps {
  component: React.ComponentType;
  redirectPath?: string; // Optional redirect path
}

const AuthRoute: React.FC<AuthRouteProps> = ({ component: Component }) => {
  const isAuthenticated = useSelector((state: RootState) => !!state.user.user);

  return isAuthenticated ? <Component /> : <Login />;
};

export default AuthRoute;