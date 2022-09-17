import { Fragment } from 'react';
import classes from './LandingPage.module.scss';
import LogoBlack from '../img/logo_black_main.png';
import LogoIcon from '../img/logo_black_icon.png';
import androidIcon from '../img/android.png';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <Fragment>
      <header className={classes.header}>
        <div className={classes['header__top-head']}>
          <div className={classes['logo']}>
            <div className={classes['logo__logo-container']}>
              <img src={LogoBlack} />
            </div>
          </div>
          {/* <div className={classes['incomming-feature']}>feature</div> */}
        </div>

        <div className={classes['header__mid-head']}>
          <div className={classes['content']}>
            <div className={classes['content__quote']}>
              <p>
                <span>
                  Take Notes about your Garden,
                  <br />{' '}
                </span>
                save info about your inventory
              </p>
              <div className={classes['auth-actions']}>
                <Link
                  className={classes['sign-in-btn']}
                  to='/authentication/sign-in'
                >
                  Sign In
                </Link>
                <Link
                  className={classes['sign-up-btn']}
                  to='/authentication/sign-up'
                >
                  Sign Up
                </Link>
              </div>
            </div>
            <div className={classes['content__img']}>
              <img src={LogoIcon} />
            </div>
          </div>
        </div>

        <div className={classes['header__bottom-head']}>
          <div className={classes['footer']}>
            @all copyrights are reserved | Garden Notes
          </div>
          <div className={classes['service']}>
            <Link className={classes['get-app']} to=''>
              <img src={androidIcon} />
              Get Our App
            </Link>
            <Link className={classes['contact-us']} to=''>
              Contat Us
            </Link>
          </div>
        </div>
      </header>
    </Fragment>
  );
};

export default LandingPage;
