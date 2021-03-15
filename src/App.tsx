import React from "react";
import Button, {ButtonSize, ButtonType} from "./components/Button";

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
    </div>
  );
}

export default App;
