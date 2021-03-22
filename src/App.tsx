import React from "react";
import Button, {ButtonSize, ButtonType} from "./components/Button";
import Alert from "./components/Alert";
import Menu from "./components/Menu";
import MenuItem from "./components/Menu/MenuItem";
import SubMenu1 from "./components/Menu/SubMenu1";

function App() {
  return (
    <div className="App" style={{padding:'50px'}}>
      <div>
        <Button>
          默认
        </Button>
        <br/>
        <Button btnType={ButtonType.danger} autoFocus={true}>
          primary
        </Button>
        <Button
          btnType={ButtonType.text}
          onClick={(e) => {
            e.preventDefault();
            alert(e.currentTarget.tagName)
          }}>
          Text Button
        </Button>
        <br/>
        <Button size={ButtonSize.large}>
          middle
        </Button>
        <br/>
        <Button disabled>
          disabled
        </Button>
        <Button
          className="App-link"
          btnType={ButtonType.link}
          href="http://www.baidu.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          百度一下
        </Button>
      </div>
      <hr/>
      <div style={{width: '300px'}}>
        <Alert title='Hello world!'/>
        <Alert type='success' closable={true} title='Hello world!'/>
        <Alert type='danger' closable={true} onClose={() => {
          alert('关闭')
        }} title='Hello world!'/>
        <Alert
          type='warning'
          description='这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述'
          title='这是一段标题'
          closable={true}
        />
      </div>
      <hr/>
      <div>
        <Menu className={'custom-menu'} onSelect={ (activeIndex) => {
          console.log('选中的索引：',activeIndex)
        }}>
          <MenuItem className={'custom-item'}>
            1
          </MenuItem>
          <MenuItem disabled={true}>
            2
          </MenuItem>
          <MenuItem style={{color: '#ff0000'}}>
            3
          </MenuItem>
          <MenuItem>
            4
          </MenuItem>
          <li>hello world</li>
        </Menu>
      </div>
      <hr/>
      <div style={{width:200,margin:20}}>
        <Menu mode={'vertical'} className={'custom-menu'} onSelect={ (activeIndex) => {
          console.log('选中的索引：',activeIndex)
        }}>
          <MenuItem className={'custom-item'}>
            1
          </MenuItem>
          <MenuItem disabled={true}>
            2
          </MenuItem>
          <MenuItem style={{color: '#ff0000'}}>
            3
          </MenuItem>
          <MenuItem>
            4
          </MenuItem>
          <p>这是一段</p>
        </Menu>
      </div>
      <div>
        <Menu className={'custom-menu'} onSelect={ (activeIndex) => {
          console.log('选中的索引：',activeIndex)
        }}>
          <MenuItem className={'custom-item'}>
            1
          </MenuItem>
          <MenuItem disabled={true}>
            2
          </MenuItem>
          <MenuItem style={{color: '#ff0000'}}>
            3
          </MenuItem>
          <MenuItem>
            4
          </MenuItem>
          <SubMenu1 title={'子菜单'}>
            <MenuItem className={'submenu-5'}>
              5-1
            </MenuItem>
            <MenuItem disabled={true}>
              5-2
            </MenuItem>
          </SubMenu1>
        </Menu>
      </div>
      <div style={{width:200,margin:20}}>
        <Menu mode={'vertical'} className={'custom-menu'} onSelect={ (activeIndex) => {
          console.log('选中的索引：',activeIndex)
        }}>
          <MenuItem className={'custom-item'}>
            1
          </MenuItem>
          <MenuItem disabled={true}>
            2
          </MenuItem>
          <MenuItem style={{color: '#ff0000'}}>
            3
          </MenuItem>
          <MenuItem>
            4
          </MenuItem>
          <SubMenu1 title={'子菜单'}>
            <MenuItem className={'submenu-5'}>
              5-1
            </MenuItem>
            <MenuItem disabled={true}>
              5-2
            </MenuItem>
          </SubMenu1>
        </Menu>
      </div>
    </div>
  );
}

export default App;
