import React from "react";
import { Meta} from '@storybook/react/types-6-0';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons' // 一次性导入Icon
import Menu from "./index";
library.add(fas)
export default {
  title: "whmk-amuse/Menu",
  component: Menu,
  argTypes: {},
} as Meta

export const DefaultMenu = () => {
  return (
    <Menu>
      <Menu.Item>
        1
      </Menu.Item>
      <Menu.Item>
        2
      </Menu.Item>
      <Menu.Item>
        3
      </Menu.Item>
      <Menu.Item>
        4
      </Menu.Item>
    </Menu>
  )
}

DefaultMenu.storyName = "Default Menu"

export const DefaultIndexMenu = () => {
  return (
    <Menu defaultIndex='1'>
      <Menu.Item>
        1
      </Menu.Item>
      <Menu.Item>
        2
      </Menu.Item>
      <Menu.Item>
        3
      </Menu.Item>
      <Menu.Item>
        4
      </Menu.Item>
    </Menu>
  )
}

DefaultIndexMenu.storyName = "DefaultIndex Menu"

export const SubMenu = () => {
  return (
    <Menu defaultIndex={'4-0'} className={'custom-menu'} onSelect={ (activeIndex) => {
      console.log('选中的索引：',activeIndex)
    }}>
      <Menu.Item className={'custom-item'}>
        1
      </Menu.Item>
      <Menu.Item disabled={true}>
        2
      </Menu.Item>
      <Menu.Item style={{color: '#ff0000'}}>
        3
      </Menu.Item>
      <Menu.Item>
        4
      </Menu.Item>
      <Menu.SubMenu title={'子菜单'}>
        <Menu.Item className={'submenu-5'}>
          5-1
        </Menu.Item>
        <Menu.Item disabled={true}>
          5-2
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  )
}
SubMenu.storyName = "SubMenu Menu"

export const VerticalMenu = () => {
  return (
    <Menu mode={"vertical"}>
      <Menu.Item>
        1
      </Menu.Item>
      <Menu.Item>
        2
      </Menu.Item>
      <Menu.Item>
        3
      </Menu.Item>
      <Menu.Item>
        4
      </Menu.Item>
    </Menu>
  )
}
VerticalMenu.storyName = "Vertical Menu"

export const DefaultOpenSubMenus = () => {
  return (
    <Menu defaultOpenSubMenus={['4']} mode={'vertical'}>
      <Menu.Item >
        1
      </Menu.Item>
      <Menu.Item>
        2
      </Menu.Item>
      <Menu.Item>
        3
      </Menu.Item>
      <Menu.Item>
        4
      </Menu.Item>
      <Menu.SubMenu title={'子菜单'}>
        <Menu.Item>
          5-1
        </Menu.Item>
        <Menu.Item>
          5-2
        </Menu.Item>
        <Menu.Item>
          5-3
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  )
}
DefaultOpenSubMenus.storyName = "DefaultOpenSubMenus"
