import React, {useState, useEffect} from 'react'

interface MutableRefObject<T> {
  current: T;
}

const useClickOutside = (wrapper: MutableRefObject<HTMLElement | null>) => {
  let [isContains, setContains] = useState<boolean>(false)

  const clickOutside = (e: MouseEvent) => {
    if (!wrapper.current) return;
    const contains = wrapper.current.contains(e.target as HTMLElement)
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
