import Cookies from 'js-cookie';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import classes from './Dashboard.module.scss';

/*  */
const Dashboard = () => {
  const navigate = useNavigate();
  const [tokenExists, setTokenExists] = useState(Cookies.get('token'));
  const [nameCookie, setNameCookie] = useState(Cookies.get('name'));
  const [photoCookie, setPhotoCookie] = useState(Cookies.get('photo'));
  const [emailCookie, setEmailCookie] = useState(Cookies.get('email'));
  let titleContent = useSelector((state) => state.authUi.activeTab);
  const userData = {
    name: nameCookie,
    photo: photoCookie,
    email: emailCookie,
  };
  const isMin = useSelector((state) => state.authUi.sideNavISMin);
  const isLoggedIn = !!tokenExists;
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/authentication/sign-in', { replace: true });
      return;
    }
  }, [isLoggedIn]);

  return (
    <Fragment>
      <Layout user={userData} isMin={isMin}>
        <div className={classes['top-dash-nav']}>
          <h1>{titleContent}</h1>
        </div>

        {/* Search Bar */}

        <Outlet />
      </Layout>
    </Fragment>
  );
};
export default Dashboard;
