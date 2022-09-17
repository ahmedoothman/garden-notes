import useCookies from 'react-cookie/cjs/useCookies';
import { useRef, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import classes from './SideNav.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { authUiActions } from '../../store/index';
import logo from '../../img/logo_white_side.png';
import logoMin from '../../img/logo_white_side-min.png';
import garden from '../../img/garden.png';
import inventory from '../../img/checklists.png';
import note from '../../img/writing.png';
import user from '../../img/user-account.png';
import settings from '../../img/setting.png';
import logout from '../../img/logout.png';
import prev from '../../img/prev.png';
import next from '../../img/next.png';
import React from 'react';
const SideNav = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies, setCookies, removeCookie] = useCookies(['token']);
  const sideNavISMin = useSelector((state) => state.authUi.sideNavISMin);
  const tabActive = useSelector((state) => state.authUi.activeTab);
  const [sideNavClass, setSideNavClass] = useState('side-nav');
  const [windowState, setWindowState] = useState(window.innerWidth);
  console.log(windowState);
  const [logoSrc, setlogo] = useState(logo);
  useEffect(() => {
    setWindowState(window.innerWidth);
    /* Toggle Nav Show */
    if (sideNavISMin) {
      setSideNavClass('side-nav-min');
      setlogo(logoMin);
    } else {
      setSideNavClass('side-nav');
      setlogo(logo);
    }
    /* Check Window Size */
    if (windowState < 600) {
      setlogo(logoMin);
    }
  }, [sideNavISMin, windowState]);

  const logoutHandler = () => {
    // removeCookie('token');
    setCookies('token', '', {
      path: '/',
    });
    navigate('/authentication/sign-in', { replace: true });
  };
  const toogleMenu = () => {
    dispatch(authUiActions.toggleSideNav());
  };
  return (
    <div className={classes[sideNavClass]}>
      <div className={classes[`${sideNavClass}__top`]}>
        <div className={classes[`${sideNavClass}__top__logo`]}>
          <img src={logoSrc} />
        </div>
        <div className={classes[`${sideNavClass}__top__menu`]}>
          <ul>
            <li className={tabActive === 'garden' ? classes['tab-active'] : ''}>
              <img src={garden} />
              <NavLink to='garden'>Garden</NavLink>
            </li>
            <li
              className={tabActive === 'inventory' ? classes['tab-active'] : ''}
            >
              <img src={inventory} />
              <NavLink to='inventory'>Inventory</NavLink>
            </li>
            <li className={tabActive === 'notes' ? classes['tab-active'] : ''}>
              <img src={note} />
              <NavLink to='notes'>Notes</NavLink>
            </li>
          </ul>
        </div>
      </div>

      <div className={classes[`${sideNavClass}__bottom`]} onClick={toogleMenu}>
        {!sideNavISMin && (
          <div className={classes[`${sideNavClass}__bottom__toggle`]}>
            <img src={next} />
          </div>
        )}
        {sideNavISMin && (
          <div className={classes[`${sideNavClass}__bottom__toggle`]}>
            <img src={prev} />
          </div>
        )}
        <div className={classes[`${sideNavClass}__bottom__user`]}>
          {/* https://gardennotes.herokuapp.com/api/img/users/default.jpeg */}
          <img src={user} alt='user' />
          <h2>{props.user.name}</h2>
        </div>
        <hr />
        <div className={classes[`${sideNavClass}__bottom__menu`]}>
          <ul>
            <li>
              <img src={settings} />
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
