import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas) // 一次性导入所有的图标，接下来就可以使用字符串了

export {default as Button} from './components/Button'
export {default as Menu} from './components/Menu'
export {default as Alert} from './components/Alert'
export {default as AutoComplete} from './components/AutoComplete'
export {default as Upload} from './components/Upload'
export {default as Input} from './components/Input'
export {default as Icon} from './components/Icon'
