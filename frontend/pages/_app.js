import React from "react";
import ReactDOMClient from "react-dom/client";
import App from "next/app";
import Head from "next/head";
import Router from "next/router";

import PageChange from "components/PageChange/PageChange.js";
import Page from "components/Page";
import nookies, { setCookie } from "nookies";
import jwt from 'jsonwebtoken';

import "assets/css/global.css";

import { authConstants } from "constants/auth";
import { serialize } from "cookie";
import { fetchApp } from "lib/fetch";
import AccountProvider from "lib/contexts/accountContext";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ThemeProvider from "config/theme/ThemeProvider";



Router.events.on("routeChangeStart", (url) => {
  document.body.classList.add("body-page-transition");
  const container = document.getElementById("page-transition");
  const root = ReactDOMClient.createRoot(container)
  root.render(<PageChange path={url} />);
});
Router.events.on("routeChangeComplete", () => {
  const container = document.getElementById("page-transition");
  const root = ReactDOMClient.createRoot(container)
  root.unmount()
  document.body.classList.remove("body-page-transition");
});
Router.events.on("routeChangeError", () => {
  const container = document.getElementById("page-transition");
  const root = ReactDOMClient.createRoot(container)
  root.unmount()
  document.body.classList.remove("body-page-transition");
});

class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const cookies = nookies.get(ctx);

    if (cookies && cookies[authConstants.SESSION_TOKEN] && pageProps) {
      pageProps[authConstants.SESSION_TOKEN] = cookies[authConstants.SESSION_TOKEN];
      
      //verify the jwt
      const { verified } = await fetch(`${process.env.backendUrl}api/auth/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({token: cookies[authConstants.SESSION_TOKEN]})
      }).then(res => res.json());

      if (!verified) {
        ctx.res.writeHead(302, {
          Location: '/signin',
        });
        return ctx.res.end();
      }
      
      const decoded = jwt.decode(pageProps[authConstants.SESSION_TOKEN]);
      if (decoded) {
        const expiredinMS = decoded.exp * 1000;
        
        if (Date.now().valueOf() >= expiredinMS) {
          ctx.res.clearCookie(authConstants.SESSION_TOKEN);
          ctx.res.clearCookie(authConstants.CSRF_TOKEN);
          ctx.res.clearCookie(authConstants.CALLBACK_URL);
          ctx.res.writeHead(302, {
            Location: '/signin',
          });
          return ctx.res.end();
        } else {
          
          pageProps.user = {
            username: decoded.user?.attributes?.username?.[0],
            email: decoded.user?.attributes?.email?.[0],
            accountId: decoded.user?.attributes?.userid?.[0],
            firstName: decoded.user?.attributes?.firstname?.[0],
            lastName: decoded.user?.attributes?.lastname?.[0]
          };

          setCookie(ctx, authConstants.SESSION_TOKEN, pageProps[authConstants.SESSION_TOKEN]);

          try {
            const accountResult = await fetchApp({
              url: `${process.env.backendUrl}api/accounts/${decoded.user?.attributes?.userid[0]}`,
              ctx: ctx,
            })
          } catch (err) {
            if (err.message === 'Couldn\'t find account') {
              // Create new user/account
              fetchApp({
                url: `${process.env.backendUrl}api/accounts`,
                ctx: ctx,
                requestOptions: {
                  method: 'POST',
                  body: JSON.stringify({
                    id: decoded.user?.attributes?.userid[0],
                    email: decoded.user?.attributes?.email[0],
                    username: decoded.user?.name_id,
                    fullname: `${decoded.user?.attributes?.firstname[0]} ${decoded.user?.attributes?.lastname[0]}`
                  })
                }
              })
                .then(result => {
                  console.log('Account created Successfully');
                })
                .catch(err => {
                  console.log('Error with account creation');
                })
            } else {
              console.log(err.message);
            }
          }
        }
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
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <title>Open Source Scanbot</title>
          <link rel="apple-touch-icon" sizes="57x57" href="/favicons/apple-icon-57x57.png"/>
          <link rel="apple-touch-icon" sizes="60x60" href="/favicons/apple-icon-60x60.png"/>
          <link rel="apple-touch-icon" sizes="72x72" href="/favicons/apple-icon-72x72.png"/>
          <link rel="apple-touch-icon" sizes="76x76" href="/favicons/apple-icon-76x76.png"/>
          <link rel="apple-touch-icon" sizes="114x114" href="/favicons/apple-icon-114x114.png"/>
          <link rel="apple-touch-icon" sizes="120x120" href="/favicons/apple-icon-120x120.png"/>
          <link rel="apple-touch-icon" sizes="144x144" href="/favicons/apple-icon-144x144.png"/>
          <link rel="apple-touch-icon" sizes="152x152" href="/favicons/apple-icon-152x152.png"/>
          <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-icon-180x180.png"/>
          <link rel="icon" type="image/png" sizes="192x192"  href="/favicons/android-icon-192x192.png"/>
          <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png"/>
          <link rel="icon" type="image/png" sizes="96x96" href="/favicons/favicon-96x96.png"/>
          <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png"/>
          <meta name="msapplication-TileColor" content="#ffffff"/>
          <meta name="msapplication-TileImage" content="/favicons/ms-icon-144x144.png"/>
          <meta name="theme-color" content="#ffffff"/>
        </Head>
        <ThemeProvider>
          <AccountProvider {...pageProps} >
            <Layout>
                <Page {...pageProps}>
                  <Component {...pageProps} />
                  <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    style={{
                      marginTop: 50
                    }}
                  />
                </Page>
            </Layout>
          </AccountProvider>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}

export default MyApp;