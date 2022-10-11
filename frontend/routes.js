const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard"
  },
  {
    path: "/scanner",
    name: "Scanners"
  },
];

export const getRouteTitle = (path) => {
  switch(path) {
    case '/dashboard':
      return 'Scanbot Dashboard';
    case '/scanner':
      return 'Scanner Dashboard';
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
