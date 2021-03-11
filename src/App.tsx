import React from "react";
import Button, {ButtonSize, ButtonTypeEnum} from "./components/Button";

function App() {
  return (
    <div className="App">
      <Button>
        默认
      </Button>
      <Button type={ButtonTypeEnum.primary}>
        primary
      </Button>
      <Button size={ButtonSize.middle}>
        middle
      </Button>
      <Button disabled>
        disabled
      </Button>
      <Button
        className="App-link"
        type = {ButtonTypeEnum.link}
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
