import TitleModalComp from '../Modal';

const TitleModalCompStories = {
  title: "Components/TitleModal",
  component: TitleModalComp,
//   argTypes: { handleClick: { action: "handleClick" } },
}

export default TitleModalCompStories;

const Template = args => <TitleModalComp {...args} />
export const TitleModal1 = Template.bind({})
TitleModal1.args = {
  titleType: 'primary',
  onClose: () => null,
  onOpen: () => null
}