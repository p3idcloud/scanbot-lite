import React from "react";
import nookies, { parseCookies, destroyCookie } from "nookies";
import { authConstants } from "constants/auth";

export default function Index() {
  return <div />;
}


Index.getInitialProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  if (!cookies[authConstants.SESSION_TOKEN] && ctx?.res?.writeHead) {
    // Destroys cookie if not from register url
    if (parseCookies(ctx)[authConstants.REGISTRATION_TOKEN]) {
      destroyCookie(ctx, authConstants.REGISTRATION_TOKEN);
    }

    ctx.res.writeHead(302, {
      Location: "/signin",
    });

    return ctx.res.end();
  } else {
    ctx.res.writeHead(302, {
      Location: "/dashboard",
    });

    return ctx.res.end();
  }
};
