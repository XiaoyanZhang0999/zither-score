import React from "react";
import { Redirect, Route } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      localStorage.getItem("auth") ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/Login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

export default PrivateRoute;
