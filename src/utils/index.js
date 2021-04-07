/**
 * @author asus
 * @date 2021/4/7 8:56
 */

export const debounce = function (callback, wait = 0) {
    let timer = null
    return function (...args) {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            callback && callback.call(this, ...args)
            timer = null
        },wait)
    }
}
