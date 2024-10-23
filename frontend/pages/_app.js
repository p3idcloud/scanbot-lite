import React, { useEffect } from "react";
import ReactDOMClient from "react-dom/client";
import App from "next/app";
import Head from "next/head";
import Router from "next/router";

import PageChange from "components/PageChange/PageChange.js";
import Page from "components/Page";
import nookies, { setCookie, destroyCookie } from "nookies";
import jwt from 'jsonwebtoken';

import "assets/css/global.css";

import { authConstants } from "constants/auth";
import { fetchData } from "lib/fetch";
import AccountProvider from "lib/contexts/accountContext";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ThemeProvider from "config/theme/ThemeProvider";
import TwoFactorAuth from "components/AppModals/TwoFactorAuth";

// Page Transition Effects
Router.events.on("routeChangeStart", (url) => {
  document.body.classList.add("body-page-transition");
  const container = document.getElementById("page-transition");
  const root = ReactDOMClient.createRoot(container)
  root.render(<PageChange path={url} />);
});

Router.events.on("routeChangeComplete", () => {
  const container = document.getElementById("page-transition");
  const root = ReactDOMClient.createRoot(container)
  root.unmount();
  document.body.classList.remove("body-page-transition");
});

Router.events.on("routeChangeError", () => {
  const container = document.getElementById("page-transition");
  const root = ReactDOMClient.createRoot(container)
  root.unmount();
  document.body.classList.remove("body-page-transition");
});

class MyApp extends App {
  // Server-Side Rendering (SSR)
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const cookies = nookies.get(ctx);
    const sessionToken = cookies[authConstants.SESSION_TOKEN];
    // JWT and session handling
    if (sessionToken) {
      try {
        const res = await fetchData(`${process.env.BACKEND_URL}api/auth/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: sessionToken })
        })
        const verified = res.verified
        if (!verified) {
          // Redirect to signin if verification fails
          if (ctx.res) {
            ctx.res.writeHead(302, { Location: '/signin' });
            ctx.res.end();
          }
          return;
        }

        const decoded = jwt.decode(sessionToken);
        const expiredInMS = decoded.exp * 1000;

        // If JWT is expired, clear cookies and redirect to signin
        if (Date.now() >= expiredInMS) {
          destroyCookie(ctx, authConstants.SESSION_TOKEN);
          destroyCookie(ctx, authConstants.CSRF_TOKEN);
          destroyCookie(ctx, authConstants.CALLBACK_URL);
          if (ctx.res) {
            ctx.res.writeHead(302, { Location: '/signin' });
            ctx.res.end();
          }
          return;
        }

        // Add user details to pageProps
        pageProps.user = {
          username: decoded.user?.attributes?.username?.[0],
          email: decoded.user?.attributes?.email?.[0],
          accountId: decoded.user?.attributes?.userid?.[0],
          firstName: decoded.user?.attributes?.firstname?.[0],
          lastName: decoded.user?.attributes?.lastname?.[0],
        };
        // Refresh cookie expiration
        setCookie(ctx, authConstants.SESSION_TOKEN, sessionToken);

        // Fetch account-related data
        try {
          const accountResult = await fetchData(`${process.env.BACKEND_URL}api/accounts/${decoded.user?.attributes?.userid?.[0]}`,{},sessionToken);
          pageProps.user.enabled2FA = accountResult.enabled2FA;
          pageProps.user.mobileNumber = accountResult.mobileNumber;
          pageProps.user.docsumoApiKey = accountResult.docsumoApiKey;
        } catch (err) {
          // Handle account creation if necessary
          if (err === "Couldn't find account") {
            await fetchData(`${process.env.BACKEND_URL}api/register/accounts`,
              {
                method: 'POST',
                body: {
                  id: decoded.user?.attributes?.userid?.[0],
                  email: decoded.user?.attributes?.email?.[0],
                  username: decoded.user?.name_id,
                  fullname: `${decoded.user?.attributes?.firstname?.[0]} ${decoded.user?.attributes?.lastname?.[0]}`,
              }},sessionToken
            );
          } else {
            console.log(err)
          }
        }
      } catch (error) {
        console.log('JWT Verification Error: ', error);
      }
    }
    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    const Layout = Component.layout || (({ children }) => <>{children}</>);

    return (
      <React.Fragment>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <title>Open Source Scanbot</title>
          {/* Favicons */}
          <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-icon-180x180.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="96x96" href="/favicons/favicon-96x96.png" />
          <meta name="theme-color" content="#ffffff" />
        </Head>
        <ThemeProvider>
          <AccountProvider {...pageProps}>
            <Layout>
              <Page {...pageProps}>
                {pageProps.user?.enabled2FA && (
                  <TwoFactorAuth mobileNumber={pageProps.user.mobileNumber} />
                )}
                <Component {...pageProps} />
                <ToastContainer position="top-right" autoClose={3000} />
              </Page>
            </Layout>
          </AccountProvider>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}

export default MyApp;