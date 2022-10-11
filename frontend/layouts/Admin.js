import React from "react";
import { Wrapper } from "./style";
import Footer from "components/Footer/Footer";

export default function Admin({ children }) {
  return (
    <>
      <Wrapper>
        {children}
      </Wrapper>
      <Footer />
    </>
  );
}
