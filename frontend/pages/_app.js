/*!

=========================================================
* NextJS Material Dashboard v1.1.0 based on Material Dashboard React v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-material-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/nextjs-material-dashboard/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import App from "next/app";
import Head from "next/head";
import Router from "next/router";

import PageChange from "components/PageChange/PageChange.js";
import Page from "components/Page";
import nookies from "nookies";
import jwt from 'jsonwebtoken';

import "assets/css/nextjs-material-dashboard.css?v=1.1.0";
import { authConstants } from "constants/auth";
import store from "redux/store";
import { createWrapper } from "next-redux-wrapper";
import { fetchApp } from "lib/fetch";
import AccountProvider from "lib/contexts/accountContext";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

Router.events.on("routeChangeStart", (url) => {
  document.body.classList.add("body-page-transition");
  ReactDOM.render(
    <PageChange path={url} />,
    document.getElementById("page-transition")
  );
});
Router.events.on("routeChangeComplete", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  document.body.classList.remove("body-page-transition");
});
Router.events.on("routeChangeError", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  document.body.classList.remove("body-page-transition");
});

class MyApp extends App {
  componentDidMount() {
    let comment = document.createComment(`

=========================================================
* * NextJS Material Dashboard v1.1.0 based on Material Dashboard React v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-material-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/nextjs-material-dashboard/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

`);
    document.insertBefore(comment, document.documentElement);
  }
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const cookies = nookies.get(ctx);

    if (cookies && cookies[authConstants.SESSION_TOKEN] && pageProps) {
      pageProps[authConstants.SESSION_TOKEN] = cookies[authConstants.SESSION_TOKEN];
      const decoded = jwt.decode(pageProps[authConstants.SESSION_TOKEN]);
      if (decoded) {
        const expiredinMS = decoded.exp * 1000;
        
        if (Date.now().valueOf() >= expiredinMS) {
          ctx.res.clearCookie(authConstants.SESSION_TOKEN);
          ctx.res.clearCookie(authConstants.CSRF_TOKEN);
          ctx.res.clearCookie(authConstants.CALLBACK_URL);
          ctx.res.writeHead(302, {
            Location: '/signin?error=Unauthorized. Please login again.&disabled=1',
          });
          return ctx.res.end();
        } else {
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
                  pageProps.user = result;
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

      // if (ctx.req.originalUrl === "/signin") {
      //   ctx.res.writeHead(302, {
      //     Location: "/signin",
      //   });
      //   return ctx.res.end();
      // }
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
          <link rel="shortcut icon" href={require("assets/img/favicon.png")} />
          <link
            rel="apple-touch-icon"
            sizes="76x76"
            href={require("assets/img/apple-icon.png")}
          />
        </Head>
        <Layout>
          <AccountProvider {...pageProps} >
            <Page {...pageProps}>
              <Component {...pageProps} />
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
              />
            </Page>
          </AccountProvider>
        </Layout>
      </React.Fragment>
    );
  }
}

const makeStore = () => store;
const wrapper = createWrapper(makeStore);

export default wrapper.withRedux(MyApp);