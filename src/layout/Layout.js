import React, { Fragment } from 'react';
import SideNav from '../components/UI/SideNav';
import classes from './Layout.module.scss';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
const Layout = (props) => {
  const [mainClass, setMainClass] = useState('');
  const { isMin } = props;
  useEffect(() => {
    if (isMin) {
      setMainClass(classes['main-max']);
      console.log('min');
    } else {
      setMainClass(classes['main']);
      console.log('max');
    }
  }, [isMin]);
  return (
    <Fragment>
      <div className={classes['layout-container']}>
        <SideNav user={props.user} />
        <div className={mainClass}>{props.children}</div>
      </div>
    </Fragment>
  );
};

export default React.memo(Layout);
