import React from "react";

// core components
import CustomLoader from "components/Loader";
import { getRouteTitle } from "routes";

export default function PageChange(props) {
  const pageTitle = getRouteTitle(props.path);

  return (
    <CustomLoader message={`Loading ${pageTitle}`} overlay />
  );
}
