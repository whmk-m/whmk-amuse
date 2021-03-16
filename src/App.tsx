import React from "react";
import Button, {ButtonSize, ButtonType} from "./components/Button";
import Alert, { AlertType } from "./components/Alert";
function App() {
  return (
    <div className="App">
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
      <hr/>
      <div style={{width:'300px'}}>
        <Alert title='Hello world!'/>
        <Alert type='success' closable={true} title='Hello world!'/>
        <Alert type='danger' closable={true} onClose={()=>{
          alert('关闭')
        }} title='Hello world!'/>
        <Alert
          type='warning'
          description='这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述'
          title='这是一段标题'
          closable={true}
        />
      </div>
    </div>
  );
}

export default App;
