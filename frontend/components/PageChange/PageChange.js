import React from "react";

// core components
import CustomLoader from "components/Loader";

export default function PageChange(props) {
  return (
    <CustomLoader message={`Loading ${props.path}`} />
  );
}
