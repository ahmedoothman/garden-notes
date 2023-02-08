import React, { Fragment } from 'react';
import SideNav from './SideNav';
import classes from './Layout.module.scss';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
const Layout = (props) => {
  const [mainClass, setMainClass] = useState('');
  const { isMin } = props;
  useEffect(() => {
    if (isMin) {
      setMainClass(classes['main-max']);
    } else {
      setMainClass(classes['main']);
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
