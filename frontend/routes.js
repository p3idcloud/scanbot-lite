/*!

=========================================================
* * NextJS Material Dashboard v1.1.0 based on Material Dashboard React v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-material-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/nextjs-material-dashboard/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import Print from "@material-ui/icons/Print";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
  },
  {
    path: "/scanner",
    name: "Scanners",
    icon: Print,
  },
  {
    path: "/profile",
    name: "User Profile",
    icon: Person,
  },
];

export const getRouteTitle = (path) => {
  switch(path) {
    case '/dashboard':
      return 'Scanbot Dashboard';
    case '/scanner':
      return 'Scanner Dashboard';
    case '/profile':
      return 'User Profile';
    case '/api/auth/login/saml':
    case '/api/auth/bypass/saml':
      return 'Scanbot Login';
    case '/scanners/register':
      return 'Scanner Registration';
    default:
      // Scanner detail page
      if (new RegExp(/^\/scanners\/.*$/).test(path)) {
        return 'Scanner Detail';
      }
      // Not logged
      return path;
  }
}

export default dashboardRoutes;
