import React, { Fragment } from 'react';
import SideNav from '../components/UI/SideNav';
import classes from './Layout.module.scss';
const Layout = (props) => {
  return (
    <Fragment>
      <div className={classes['layout-container']}>
        <SideNav user={props.user} />
        <main className={classes.main}>{props.children}</main>
      </div>
    </Fragment>
  );
};

export default React.memo(Layout);
