// 引入组件样式文件
import './../src/styles/index.scss';

// 引入图标文件
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas) // 一次性导入所有的图标，接下来就可以使用字符串了

// 全局的配置
export const parameters = {
    actions: {argTypesRegex: "^on[A-Z].*"},
    controls: {expanded: true},
}
