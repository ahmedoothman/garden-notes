import { Fragment } from 'react';
import { useState, useEffect, useCallback, useReducer } from 'react';
import Layout from '../layout/Layout';
import { Outlet } from 'react-router-dom';
import { NavLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import RoutingLoadSpin from '../components/UI/RoutingLoadSpin';

/*  */
const Dashboard = () => {
  const navigate = useNavigate();
  const [tokenExists, setTokenExists] = useState(Cookies.get('token'));
  const [nameCookie, setNameCookie] = useState(Cookies.get('name'));
  const [photoCookie, setPhotoCookie] = useState(Cookies.get('photo'));
  const [emailCookie, setEmailCookie] = useState(Cookies.get('email'));
  const userData = {
    name: nameCookie,
    photo: photoCookie,
    email: emailCookie,
  };
  const isLoggedIn = !!tokenExists;
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/authentication/sign-in', { replace: true });
    }
  }, [isLoggedIn]);

  return (
    <Fragment>
      <Layout user={userData}>
        <Outlet />
        <h1>main</h1>
      </Layout>
    </Fragment>
  );
};
export default Dashboard;
