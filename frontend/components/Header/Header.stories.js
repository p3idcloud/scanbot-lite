import HeaderComp from "."

const HeaderStories = {
  title: "Components/Header",
  component: HeaderComp,
}

export default HeaderStories;

const Template = args => <HeaderComp {...args} />
export const Header = Template.bind({})
Header.args = {
  onSearch: '',
  onAdd: '',
  titleForAdd: '',
  titleHeader: '',
  menuList: ''
}