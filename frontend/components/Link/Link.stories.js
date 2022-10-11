import LinkComp from '../Link';

const LinkCompStories = {
  title: "Components/Link",
  component: LinkComp,
}

export default LinkCompStories;
  
const Template = args => <LinkComp {...args} />

export const LinkComp1 = Template.bind({})
LinkComp1.args = {
  href: "google.com",
  linkAs: [{}, 'null'],
  locale: 'null',
  passHref: 'false',
  prefetch: 'false',
  replace: 'false',
  scroll: 'false',
  shallow: 'false',
  to: {}
}