/* eslint-disable no-unused-vars */
import React from "react";
import { useSelector } from "react-redux";
import { Route, Link } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  return (
    <>
      {!loading && (
        <Route
          {...rest}
          render={(props) => {
            if (!isAuthenticated) {
              return <Link to="/login" />;
            }
            return <Component {...props} />;
          }}
        />
      )}
    </>
  );
};

export default ProtectedRoute;
