// react
import { useRef, useState, useEffect } from 'react';
// react router
import { NavLink, useNavigate } from 'react-router-dom';
// react redux
import { useSelector, useDispatch } from 'react-redux';
import { authUiActions } from '../store/index';
// Cookies
import React from 'react';
import Cookies from 'js-cookie';
import useCookies from 'react-cookie/cjs/useCookies';
// Styles
import classes from './SideNav.module.scss';
// services
import { updateUserInfoService } from '../services/userServices';
// images
import logo from '../img/logo_white_side.png';
import logoMin from '../img/logo_white_side-min.png';
import garden from '../img/garden.png';
import inventory from '../img/checklists.png';
import note from '../img/writing.png';
import settings from '../img/setting.png';
import logout from '../img/logout.png';
import prev from '../img/prev.png';
import next from '../img/next.png';

const SideNav = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // styles
  const [sideNavClass, setSideNavClass] = useState('side-nav');
  const [windowState, setWindowState] = useState(window.innerWidth);
  const [logoSrc, setlogo] = useState(logo);
  // redux
  const sideNavISMin = useSelector((state) => state.authUi.sideNavISMin);
  const tabActive = useSelector((state) => state.authUi.activeTab);
  const url_api = useSelector((state) => state.authUi.url_api);
  // cookies
  const [cookies, setCookies, removeCookies] = useCookies(['user']);
  const [isNavMin, setIsNavMin] = useState(Cookies.get('navIsMin'));
  const [userImg, setUserImg] = useState(Cookies.get('photo'));
  useEffect(() => {
    setWindowState(window.innerWidth);
    (async () => {
      await updateUserInfoService(url_api);
      // take the new image from cookies
      setUserImg(Cookies.get('photo'));
    })();
    /* Toggle Nav Show */
    if (sideNavISMin) {
      setSideNavClass('side-nav-min');
      setlogo(logoMin);
    } else {
      setSideNavClass('side-nav');
      setlogo(logo);
    }
    /* Check Window Size */
    if (windowState < 900) {
      setlogo(logoMin);
      setSideNavClass('side-nav-min');
    }
  }, [sideNavISMin, windowState]);

  const logoutHandler = () => {
    Cookies.remove('photo');
    Cookies.remove('token');
    Cookies.remove('email');
    Cookies.remove('name');
    Cookies.remove('navIsMin');
    navigate('/authentication/sign-in', { replace: true });
  };
  const toogleMenu = () => {
    dispatch(authUiActions.toggleSideNav());
    setIsNavMin(Cookies.get('navIsMin'));
    Cookies.set('navIsMin', !isNavMin, {
      path: '/',
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    });
  };
  const navToSettings = () => {
    navigate('/dashboard/settings');
  };
  const navToGarden = () => {
    navigate('/dashboard/garden');
  };
  const navToInventory = () => {
    navigate('/dashboard/inventory');
  };
  const navToNotes = () => {
    navigate('/dashboard/notes');
  };
  return (
    <div className={classes[sideNavClass]}>
      <div className={classes[`${sideNavClass}__top`]}>
        <div className={classes[`${sideNavClass}__top__logo`]}>
          <img src={logoSrc} />
        </div>
        <div className={classes[`${sideNavClass}__top__menu`]}>
          <ul>
            <li
              className={tabActive === 'Garden' ? classes['tab-active'] : ''}
              onClick={navToGarden}
            >
              <img src={garden} onClick={navToGarden} />
              <NavLink to='garden'>Garden</NavLink>
            </li>
            <li
              className={tabActive === 'Inventory' ? classes['tab-active'] : ''}
              onClick={navToInventory}
            >
              <img src={inventory} onClick={navToInventory} />
              <NavLink to='inventory'>Inventory</NavLink>
            </li>
            <li
              className={tabActive === 'Notes' ? classes['tab-active'] : ''}
              onClick={navToNotes}
            >
              <img src={note} onClick={navToNotes} />
              <NavLink to='notes'>Notes</NavLink>
            </li>
          </ul>
        </div>
      </div>

      <div className={classes[`${sideNavClass}__bottom`]}>
        <div
          className={classes[`${sideNavClass}__bottom__tog`]}
          onClick={toogleMenu}
        >
          {sideNavISMin && (
            <div className={classes[`${sideNavClass}__bottom__toggle`]}>
              <img src={next} />
            </div>
          )}
          {!sideNavISMin && (
            <div className={classes[`${sideNavClass}__bottom__toggle`]}>
              <img src={prev} />
            </div>
          )}
        </div>
        <div className={classes[`${sideNavClass}__bottom__user`]}>
          {/* https://gardennotes.herokuapp.com/api/img/users/default.jpeg */}
          <img src={`${userImg}`} alt='user' />
          <h2>{props.user.name}</h2>
        </div>
        <hr />
        <div className={classes[`${sideNavClass}__bottom__menu`]}>
          <ul>
            <li
              className={tabActive === 'Settings' ? classes['tab-active'] : ''}
              onClick={navToSettings}
            >
              <img src={settings} onClick={navToSettings} />
              <NavLink to='settings'>Settings</NavLink>
            </li>
            <li onClick={logoutHandler}>
              <img src={logout} />
              <NavLink to=''>Logout</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SideNav);
