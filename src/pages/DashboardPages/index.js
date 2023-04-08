import { Fragment, useEffect, useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import classes from './Dashboard.module.scss';
// components
import Layout from '../../layout/Layout';
// libraries
import Cookies from 'js-cookie';
// react redux
import { useSelector } from 'react-redux';
// material ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
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
  const activeTab = useSelector((state) => state.authUi.activeTab);
  const isLoggedIn = !!tokenExists;
  useEffect(() => {
    if (isLoggedIn) {
      navigate(`/dashboard/${activeTab.toLowerCase()}`, { replace: true });
    } else {
      navigate('/authentication/sign-in', { replace: true });
    }
  }, [isLoggedIn]);
  // Breadcrumb
  const breadcrumbs = [
    <Link underline='hover' key='1' color='inherit' href='/'>
      Home
    </Link>,
    <Link underline='hover' key='1' color='inherit' href='/dashboard'>
      Dashboard
    </Link>,
    <Typography key='3' color='text.primary'>
      {titleContent}
    </Typography>,
  ];
  return (
    <Fragment>
      <Layout user={userData} isMin={isMin}>
        <div className={classes['top-dash-nav']}>
          <Stack spacing={2}>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize='small' />}
              aria-label='breadcrumb'
            >
              {breadcrumbs}
            </Breadcrumbs>
          </Stack>
        </div>

        {/* Search Bar */}

        <Outlet />
      </Layout>
    </Fragment>
  );
};
export default Dashboard;
