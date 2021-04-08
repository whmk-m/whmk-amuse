import React, {useState, useEffect} from 'react'

interface MutableRefObject<T> {
  current: T;
}

const useClickOutside = (wrapper: MutableRefObject<any>) => {
  let [isContains, setContains] = useState<boolean>(false)

  const clickOutside = (e: MouseEvent) => {
    // @ts-ignore
    const contains = (wrapper.current as unknown as HTMLElement).contains(e.target)
    setContains(contains)
  }

  useEffect(() => {
    document.addEventListener('click', clickOutside)
    return () => {
      document.removeEventListener('click', clickOutside)
    }
  }, [])

  return isContains
}


export default useClickOutside
