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

Router.events.on("routeChangeStart", (url) => {
  console.log(`Loading: ${url}`);
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

export default class MyApp extends App {
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

    if (cookies && cookies[authConstants.SESSION_TOKEN]) {
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
          <title>NextJS Material Dashboard by Creative Tim</title>
        </Head>
        <Layout>
          <Page {...pageProps}>
            <Component {...pageProps} />
          </Page>
        </Layout>
      </React.Fragment>
    );
  }
}
