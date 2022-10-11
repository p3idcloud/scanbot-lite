import { ThemeProvider } from '@mui/material';
import theme from 'src/config/mui/theme';
import ButtonComp from '../Button';


const ButtonStories = {
  title: `components/Button`,
  component: ButtonComp,
  parameters: {
    docs: {
      description: {
        component: 'Button Component'
      }
    }
  }
};

export default ButtonStories;
const Component = (props) => {
  return <ButtonComp {...props}>Click Me</ButtonComp>;
};

const Template = args => {
  return (
    <ThemeProvider theme={theme}>
      <Component {...args} />
    </ThemeProvider>
  );
};

export const Button = Template.bind({});