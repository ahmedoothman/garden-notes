import React, { useState, useRef, useImperativeHandle } from 'react';
import classes from './InputField.module.scss';
import userIcon from '../../../img/user.png';
import emailIcon from '../../../img/email.png';
import lockIcon from '../../../img/lock.png';
const InputField = React.forwardRef((props, ref) => {
  const inputRef = useRef();
  const [inputConatinerClass, setInputConatinerClass] =
    useState('form-control');
  let iconSrc;
  switch (props.config.type) {
    case 'text':
      iconSrc = userIcon;
      break;
    case 'email':
      iconSrc = emailIcon;
      break;
    case 'password':
      iconSrc = lockIcon;
      break;
    default:
      break;
  }
  const focusHandlerActive = () => {
    setInputConatinerClass('form-control--active');
  };
  const focusHandlerDisable = () => {
    setInputConatinerClass('form-control');
  };
  const errorActive = () => {
    setInputConatinerClass('form-control--error');
  };
  useImperativeHandle(ref, () => {
    return { activeError: errorActive, inputValue: inputRef.current.value };
  });
  return (
    <div className={classes[inputConatinerClass]}>
      <div className={classes['form-control__img']}>
        <img src={iconSrc} />
      </div>
      <input
        type={props.config.type}
        placeholder={props.config.placeholder}
        onFocus={focusHandlerActive}
        onBlur={focusHandlerDisable}
        ref={inputRef}
      />
    </div>
  );
});
export default React.memo(InputField);
