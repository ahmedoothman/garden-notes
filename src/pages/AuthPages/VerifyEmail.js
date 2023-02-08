import { Fragment, useState, useEffect, useCallback } from 'react';
import classes from './VerifyEmail.module.scss';
import wideLogo from '../../img/wide-logo-web.png';
import errorIcon from '../../img/warning.png';
import sucessIcon from '../../img/checked.png';
import axios from 'axios';
import CompLoadSpinnerBig from '../../components/UI/Spinners/CompLoadSpinBig';
import { useParams } from 'react-router-dom';
// react redux
import { useSelector } from 'react-redux';
import { authUiActions } from '../../store/index';

import { NavLink } from 'react-router-dom';
const VerifyEmail = () => {
  let api_url = useSelector((state) => state.authUi.url_api);

  const [errorMessage, setErrorMessage] = useState('');
  const [isSucess, setIsSucess] = useState(false);
  const [isPending, setisPending] = useState(true);
  const params = useParams();
  const verifyToken = params.verifyToken;
  const sendToken = useCallback(async () => {
    try {
      const response = await axios.patch(
        `${api_url}/api/users/verifyEmail/${verifyToken}`
      );
      setIsSucess(true);
      console.log(response);
    } catch (error) {
      setIsSucess(false);
      console.log(error.response.data.message);
      setErrorMessage(error.response.data.message);
    }
    setisPending(false);
  }, []);
  useEffect(() => {
    (async () => {
      await sendToken();
    })();
  }, [sendToken]);

  return (
    <Fragment>
      <section className={classes['verify-section']}>
        <div className={classes['verify-section__wrapper']}>
          <div className={classes['auth-header']}>
            <div className={classes['auth-header__img']}>
              <img src={wideLogo} />
            </div>
          </div>
          <div className={classes['verify-content']}>
            <div className={classes['verify-content__wrapper']}>
              {!isSucess && !isPending && errorMessage !== '' && (
                <div className={classes['error-message']}>
                  <img src={errorIcon} />
                  <p>{errorMessage}</p>
                </div>
              )}
              {isSucess && !isPending && (
                <div className={classes['sucess-message']}>
                  <img src={sucessIcon} />
                  <p>
                    Your Email is verified, try to
                    <NavLink to='/authentication/sign-in'> Sign In</NavLink>
                  </p>
                </div>
              )}
              {isPending && <CompLoadSpinnerBig />}
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};
export default VerifyEmail;
