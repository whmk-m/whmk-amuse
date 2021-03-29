import React from 'react'
import {CSSTransition} from 'react-transition-group'
import {CSSTransitionProps} from 'react-transition-group/CSSTransition'

export type AnimationName = 'zoom-in-top' | 'zoom-in-bottom' | 'zoom-in-left' | 'zoom-in-right'

export type ITransitionProps<Ref extends undefined | HTMLElement = undefined> = CSSTransitionProps<Ref> & {
  animation?: AnimationName,
}

const Transition: React.FC<ITransitionProps> = (props) => {
  const {
    classNames,
    animation,
    children,
    unmountOnExit = true,
    timeout = 200,
    ...restProps
  } = props
  return (
    <CSSTransition
      classNames={classNames || animation}
      unmountOnExit={unmountOnExit}
      timeout={timeout}
      {...restProps}
    >
      {children}
    </CSSTransition>
  )
}

export default Transition
