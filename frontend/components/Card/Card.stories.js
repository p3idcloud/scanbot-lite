import { ThemeProvider } from '@mui/material';
import theme from 'src/config/mui/theme';
import CardComp from '../Card';

const CardStories = {
  title: `components/Card`,
  component: CardComp,
  parameters: {
    docs: {
      description: {
        component: 'Card Component'
      }
    }
  }
};

export default CardStories;
const Component = props => {
  return <CardComp {...props}>Simple Card</CardComp>;
};

const Template = args => {
  return (
    <ThemeProvider theme={theme}>
      <Component {...args} />
    </ThemeProvider>
  );
};

export const Card = Template.bind({});
Card.args = {
  withpadding: true,
  boxShadow: true
};
