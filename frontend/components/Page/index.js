import { useEffect, useState } from "react";

import Head from "next/head";
import Router from "next/router";
import { withRouter } from "next/router";
import { useRouter } from "next/router";
import { authConstants } from "constants/auth";

const NonDashboardRoutes = [
  "/signin",
  "/_error"
];

const Page = (props) => {
  const router = useRouter()

  const isNotDashboard = NonDashboardRoutes.includes(props.router.pathname) || router.query?.token;

  const pageName = props.router.pathname.split("/").reverse()[0];

  useEffect(() => {
    if (props.router.asPath === '/signin') {
      if (props[authConstants.SESSION_TOKEN]) {
        Router.push('/admin/dashboard');
      }
    } 
    else {
      if (!props[authConstants.SESSION_TOKEN] && !router.query?.token) {
        Router.push('/api/auth/login/saml');
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
