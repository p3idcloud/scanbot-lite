import React from "react";
import nookies from "nookies";
import { authConstants } from "constants/auth";

export default function Index() {
  return <div />;
}


Index.getInitialProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  if (!cookies[authConstants.SESSION_TOKEN] && ctx?.res?.writeHead) {
    ctx.res.writeHead(302, {
      Location: "/signin",
    });

    return ctx.res.end();
  } else {
    ctx.res.writeHead(302, {
      Location: "/admin/dashboard",
    });

    return ctx.res.end();
  }
};
