import { StylesProvider } from '@mui/styles';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from 'config/mui/theme';

const ThemeProvider = ({ children }) => {
  return (
    <StylesProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </StylesProvider>
  );
};

export default ThemeProvider;
