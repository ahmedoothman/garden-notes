import { Fragment, useState, useEffect } from 'react';
import classes from './AuthPage.module.scss';
import wideLogo from '../img/wide-logo-web.png';
import { useSelector } from 'react-redux';
import { Link, Outlet, NavLink } from 'react-router-dom';
const AuthPage = () => {
  const activeClass = classes['auth-content__nav__sign-nav-btn-active'];
  const normalClass = classes['auth-content__nav__sign-nav-btn'];
  const [sign, setSign] = useState(true);
  const navIsShown = useSelector((state) => state.authUi.navIsShown);

  useEffect(() => {
    updateActiveClass();
  }, []);

  const updateActiveClass = () => {
    if (location.pathname === '/authentication/sign-in') {
      setSign(true);
    } else if (location.pathname === '/authentication/sign-up') {
      setSign(false);
    }
  };

  return (
    <Fragment>
      <section className={classes['auth-section']}>
        <div className={classes['auth-section__wrapper']}>
          <div className={classes['auth-header']}>
            <div className={classes['auth-header__img']}>
              <img src={wideLogo} />
            </div>
          </div>
          <div className={classes['auth-content']}>
            <div className={classes['auth-content__wrapper']}>
              {navIsShown && (
                <div
                  className={classes['auth-content__nav']}
                  onClick={updateActiveClass}
                >
                  <NavLink
                    className={(isActive) =>
                      isActive && sign ? activeClass : normalClass
                    }
                    to='sign-in'
                  >
                    Sign in
                  </NavLink>
                  <NavLink
                    to='sign-up'
                    className={(isActive) =>
                      isActive && !sign ? activeClass : normalClass
                    }
                  >
                    Sign up
                  </NavLink>
                </div>
              )}
              <div
                className={classes['auth-content__form']}
                onClick={updateActiveClass}
              >
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};
export default AuthPage;
