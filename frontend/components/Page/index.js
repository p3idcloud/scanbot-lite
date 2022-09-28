import { useEffect } from "react";

import Head from "next/head";
import Router from "next/router";
import { withRouter, useRouter } from "next/router";
import { authConstants } from "constants/auth";
import { destroyCookie, parseCookies } from "nookies";

const whitelistedUrl = [
  "/scanners/register",
  "/_error"
];

const Page = (props) => {
  const router = useRouter()

  const isWhiteListed = whitelistedUrl.includes(props.router.pathname);

  const pageName = props.router.pathname.split("/").reverse()[0];

  useEffect(() => {
    if (!isWhiteListed) {
      if (props.router.asPath === '/signin') {
        if (props[authConstants.SESSION_TOKEN]) {
          Router.push('/dashboard');
        }
      } 
      else {
        if (!props[authConstants.SESSION_TOKEN] && !router.query?.token) {
          // Destroys cookie if not from register url
          if (parseCookies()[authConstants.REGISTRATION_TOKEN]) {
            destroyCookie({}, authConstants.REGISTRATION_TOKEN);
          }
          console.log('reached');
          Router.push('/api/auth/login/saml');
        }
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>
          {pageName ? pageName : process.env.siteTitle}
        </title>
      </Head>
      {props.children}
    </>
  );
};

export default withRouter(Page);
