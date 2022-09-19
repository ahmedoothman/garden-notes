import React, { useState, useRef, useImperativeHandle } from 'react';
import classes from './SearchBar.module.scss';
import searchIcon from '../../img/search.png';
const SearchBar = React.forwardRef((props, ref) => {
  const inputRef = useRef();
  const [inputConatinerClass, setInputConatinerClass] =
    useState('form-control');
  let iconSrc = searchIcon;
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
    <div className={classes['search-bar-container']}>
      <div className={classes[inputConatinerClass]}>
        <input
          type={props.config.type}
          placeholder={props.config.placeholder}
          onFocus={focusHandlerActive}
          onBlur={focusHandlerDisable}
          ref={inputRef}
        />
        <div className={classes['form-control__img']}>
          <img src={iconSrc} />
        </div>
      </div>
    </div>
  );
});
export default React.memo(SearchBar);
