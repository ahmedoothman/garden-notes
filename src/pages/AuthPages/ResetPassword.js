// react
import { Fragment, useRef, useReducer } from 'react';
import { useParams } from 'react-router-dom';
// styles
import classes from './ResetPassword.module.scss';
// images
import wideLogo from '../../img/wide-logo-web.png';
import errorIcon from '../../img/warning.png';
import sucessIcon from '../../img/checked.png';
// components
import InputField from '../../components/UI/Inputs/InputField';
import Button from '../../components/UI/Buttons/Button';
import CompLoadSpin from '../../components/UI/Spinners/CompLoadSpin ';
// react redux
import { useSelector } from 'react-redux';
// services
import { resetPasswordService } from '../../services/userServices';
// import reducer
import {
  resetPasswordStatesReducer,
  resetPasswordStatesInitialState,
} from './ResetPasswordReducer';
// react component
const ResetPassword = () => {
  // refs
  const passwordInputRef = useRef();
  const passwordConfirmInputRef = useRef();
  // get nav status from redux
  const navIsShown = useSelector((state) => state.authUi.navIsShown);
  // get reset token from url
  const params = useParams();
  const resetToken = params.resetToken;
  // resrt password states reducer
  const [resetPasswordStates, dispatchResetPasswordStates] = useReducer(
    resetPasswordStatesReducer,
    resetPasswordStatesInitialState
  );

  /* ******************************************** */
  /**************** Validate Input ****************/
  /* ******************************************** */
  const validateInput = (data) => {
    if (data.password.trim() === '') {
      dispatchResetPasswordStates({
        type: 'ERROR',
        errorMessage: 'Please Provide Password',
      });
      passwordInputRef.current.activeError();
      return false;
    }
    if (data.passwordConfirm.trim() === '') {
      dispatchResetPasswordStates({
        type: 'ERROR',
        errorMessage: 'Please Provide Password Confirm',
      });
      passwordConfirmInputRef.current.activeError();

      return false;
    }
    if (data.password.trim() !== data.passwordConfirm.trim()) {
      dispatchResetPasswordStates({
        type: 'ERROR',
        errorMessage: "Passwords doesn't match",
      });
      passwordInputRef.current.activeError();
      passwordConfirmInputRef.current.activeError();
      return false;
    }
    return true;
  };
  /* ******************************************** */
  /**************** reset password ****************/
  /* ******************************************** */
  const resetPasswordReq = async (data) => {
    const inputValid = validateInput(data);

    if (inputValid) {
      dispatchResetPasswordStates({ type: 'PENDING' });
      const response = await resetPasswordService(data, resetToken);
      if (response.status === 'success') {
        dispatchResetPasswordStates({ type: 'SUCCESS' });
      } else {
        dispatchResetPasswordStates({
          type: 'ERROR',
          errorMessage: response.message,
        });
      }
      dispatchResetPasswordStates({ type: 'CLEAR' });
    }
  };
  /* ******************************************** */
  /********** Password submit handler *************/
  /* ******************************************** */
  const submitHandler = async (event) => {
    event.preventDefault();
    const data = {
      password: passwordInputRef.current.inputValue,
      passwordConfirm: passwordConfirmInputRef.current.inputValue,
    };
    await resetPasswordReq(data);
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
                <div className={classes['auth-content__nav']}>{/* nav */}</div>
              )}
              <div className={classes['auth-content__form']}>
                <form onSubmit={submitHandler}>
                  {resetPasswordStates.error && (
                    <div className={classes['error-message']}>
                      <img src={errorIcon} />
                      <p>{resetPasswordStates.errorMessage}</p>
                    </div>
                  )}
                  {resetPasswordStates.success && (
                    <div className={classes['sucess-message']}>
                      <img src={sucessIcon} />
                      <p> Your password succesfuly changed, try to sign in</p>
                    </div>
                  )}
                  {}
                  <InputField
                    config={{ type: 'password', placeholder: 'Password' }}
                    ref={passwordInputRef}
                  />
                  <InputField
                    config={{
                      type: 'password',
                      placeholder: 'Confirm Password',
                    }}
                    ref={passwordConfirmInputRef}
                  />
                  {!resetPasswordStates.pending && <Button title={'Confirm'} />}
                  {resetPasswordStates.pending && (
                    <Button title={<CompLoadSpin />} />
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};
export default ResetPassword;
