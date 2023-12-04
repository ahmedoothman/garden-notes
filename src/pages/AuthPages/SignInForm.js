// react
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useReducer,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
// libraries
import Cookies from 'js-cookie';
// images
import errorIcon from '../../img/warning.png';
// styles
import classes from './SignInForm.module.scss';
// components
import CompLoadSpin from '../../components/UI/Spinners/CompLoadSpin ';
import Button from '../../components/UI/Buttons/Button';
import InputField from '../../components/UI/Inputs/InputField';
// react redux
import { useDispatch } from 'react-redux';
import { authUiActions } from '../../store/index';
// services
import { signInService } from '../../services/userServices';
// import reducer
import {
  signInStatesReducer,
  signInStatesInitialState,
} from './SignInFormReducer';
// React component
const SignInForm = () => {
  // react router
  const navigate = useNavigate();
  // react redux
  const dispatch = useDispatch();

  const [checkCookies, setcheckCookies] = useState(Cookies.get('token'));

  // refs
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  // show auth form nav
  dispatch(authUiActions.setShown());
  // sign in states
  const [signInStates, dispatchSigInStates] = useReducer(
    signInStatesReducer,
    signInStatesInitialState
  );
  // check if user is logged in
  const isLoggedIn = !!checkCookies;

  // if user is logged in redirect to dashboard
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard/garden', { replace: true });
    }
  }, [isLoggedIn]);

  /* ******************************************** */
  /**************** Validate Input ****************/
  /* ******************************************** */
  const validateInput = useCallback((data) => {
    if (data.email.trim() == '') {
      emailInputRef.current.activeError();
      dispatchSigInStates({
        type: 'INVALID',
        errorMessage: 'Please Provide Email',
      });
      return false;
    }
    if (data.password.trim() == '') {
      passwordInputRef.current.activeError();
      dispatchSigInStates({
        type: 'INVALID',
        errorMessage: 'Please Provide Password',
      });
      return false;
    }
    return true;
  }, []);

  /* ******************************************** */
  /**************** Login request *****************/
  /* ******************************************** */
  const sendLoginReq = async (data) => {
    const inputValid = validateInput(data);
    if (inputValid) {
      dispatchSigInStates({ type: 'PENDING' });
      const response = await signInService(data);
      if (response.status === 'success') {
        dispatchSigInStates({ type: 'VALID' });
        /* Forward to Dashboard */
        navigate('/dashboard/garden', { replace: true });
      } else {
        // activate error message
        dispatchSigInStates({
          type: 'INVALID',
          errorMessage: response.message,
        });
        // activate error message
        if (response.message !== 'Your email is not verified') {
          passwordInputRef.current.activeError();
          emailInputRef.current.activeError();
        }
      }
      dispatchSigInStates({ type: 'CLEAR' });
    }
  };
  /* ******************************************** */
  /**************** Submit Handler ****************/
  /* ******************************************** */
  const submitHandler = async (event) => {
    event.preventDefault();
    const data = {
      email: emailInputRef.current.inputValue,
      password: passwordInputRef.current.inputValue,
    };
    await sendLoginReq(data);
  };

  return (
    <form className={classes['form-container']} onSubmit={submitHandler}>
      {signInStates.invalid && (
        <div className={classes['error-message']}>
          <img src={errorIcon} />
          <p>{signInStates.errorMessage}</p>
        </div>
      )}

      <InputField
        config={{ type: 'email', placeholder: 'Email' }}
        ref={emailInputRef}
      />
      <InputField
        config={{ type: 'password', placeholder: 'Password' }}
        ref={passwordInputRef}
      />
      {!signInStates.pending && <Button title={'Sign in'} />}
      {signInStates.pending && <Button title={<CompLoadSpin />} />}
      <Link to='/authentication/forget-password' className={classes['forget']}>
        Forget Password ?
      </Link>
    </form>
  );
};
export default React.memo(SignInForm);
