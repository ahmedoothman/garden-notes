// react
import { Fragment, useState, useEffect, useCallback, useReducer } from 'react';
import { useParams, NavLink } from 'react-router-dom';
// styles
import classes from './VerifyEmail.module.scss';
// images
import wideLogo from '../../img/wide-logo-web.png';
import errorIcon from '../../img/warning.png';
import sucessIcon from '../../img/checked.png';
// components
import CompLoadSpinnerBig from '../../components/UI/Spinners/CompLoadSpinBig';
// services
import { verifyEmailService } from '../../services/userServices';
// verify email states reducer
const verifyEmailStatesInitialState = {
  error: false,
  success: false,
  errorMessage: '',
  pending: false,
};
const verifyEmailStatesReducer = (state, action) => {
  if (action.type === 'SUCCESS') {
    return {
      error: false,
      success: true,
      errorMessage: '',
      pending: false,
    };
  }
  if (action.type === 'ERROR') {
    return {
      error: true,
      success: false,
      errorMessage: action.errorMessage,
      pending: false,
    };
  }
  if (action.type === 'PENDING') {
    return {
      error: false,
      success: false,
      errorMessage: '',
      pending: true,
    };
  }
  if (action.type === 'CLEAR') {
    return {
      error: state.error,
      success: state.success,
      errorMessage: state.errorMessage,
      pending: false,
    };
  }
  return verifyEmailStatesInitialState;
};

// ract component
const VerifyEmail = () => {
  // get token from url
  const params = useParams();
  const verifyToken = params.verifyToken;
  // verify email states
  const [verifyEmailStates, dispatchVerifyEmailStates] = useReducer(
    verifyEmailStatesReducer,
    verifyEmailStatesInitialState
  );
  /* ************************************************ */
  /* ******************* verify Token *************** */
  /* ************************************************ */
  const verifyTokenServer = useCallback(async () => {
    dispatchVerifyEmailStates({ type: 'PENDING' });
    const response = await verifyEmailService(verifyToken);
    if (response.status === 'success') {
      dispatchVerifyEmailStates({ type: 'SUCCESS' });
    } else {
      dispatchVerifyEmailStates({
        type: 'ERROR',
        errorMessage: response.message,
      });
    }
    dispatchVerifyEmailStates({ type: 'CLEAR' });
  }, []);

  //calling verify token
  useEffect(() => {
    (async () => {
      await verifyTokenServer();
    })();
  }, [verifyTokenServer]);

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
              {verifyEmailStates.error && (
                <div className={classes['error-message']}>
                  <img src={errorIcon} />
                  <p>{verifyEmailStates.errorMessage}</p>
                </div>
              )}
              {verifyEmailStates.success && (
                <div className={classes['sucess-message']}>
                  <img src={sucessIcon} />
                  <p>
                    Your Email is verified, try to
                    <NavLink to='/authentication/sign-in'> Sign In</NavLink>
                  </p>
                </div>
              )}
              {verifyEmailStates.pending && <CompLoadSpinnerBig />}
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};
export default VerifyEmail;
