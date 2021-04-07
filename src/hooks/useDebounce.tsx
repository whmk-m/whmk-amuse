import React, {useState, useEffect} from 'react'
import {debounce} from "../utils";

const useDebounce = (fun: (...args: any[]) => any, wait: number = 0) => {
  let [debounceFun, setDebounceFun] = useState<any>('')
  useEffect(() => {
    setDebounceFun(debounce(fun, wait))
  }, [])
  return debounceFun
}

useDebounce.defaultProps = {
  wait: 300
}

export default useDebounce
