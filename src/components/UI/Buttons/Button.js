import React from 'react';
import classes from './Button.module.scss';
const Button = (props) => {
  return <button className={classes['btn']}>{props.title}</button>;
};

export default React.memo(Button);
