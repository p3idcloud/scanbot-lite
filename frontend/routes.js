export const getRouteTitle = (path) => {
  switch(path) {
    case '/setting':
      return 'Scanner Settings';
    case '/dashboard':
      return 'Scanbot Dashboard';
    case '/api/auth/login/saml':
      return 'Scanbot Login';
    case '/api/auth/logout/saml':
      return 'Scanbot Logout';
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