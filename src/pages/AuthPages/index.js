import { Fragment, useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
// react redux
import { useSelector } from 'react-redux';
// styles
import classes from './index.module.scss';
// images
import wideLogo from '../../img/wide-logo-web.png';

// react component
const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeClass = classes['auth-content__nav__sign-nav-btn-active'];
  const normalClass = classes['auth-content__nav__sign-nav-btn'];
  const [sign, setSign] = useState(true);
  const navIsShown = useSelector((state) => state.authUi.navIsShown);

  // redirect to sign in
  useEffect(() => {
    updateActiveClass();
    if (location.pathname === '/authentication') {
      navigate('/authentication/sign-in', { replace: true });
    }
  }, []);

  // update active class
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
