// react
import React, { useState, useRef, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
// styles
import classes from './SignUpForm.module.scss';
// libraries
import validator from 'validator';
import Cookies from 'js-cookie';
// images
import errorIcon from '../../img/warning.png';
import sucessIcon from '../../img/checked.png';
// components
import CompLoadSpin from '../../components/UI/Spinners/CompLoadSpin ';
import Button from '../../components/UI/Buttons/Button';
import InputField from '../../components/UI/Inputs/InputField';
// React redux
import { useDispatch, useSelector } from 'react-redux';
import { authUiActions } from '../../store/index';
// services
import { signUpService } from '../../services/userServices';
// import reducer
import {
  signUpStatesReducer,
  signUpStatesInitialState,
} from './SignUpFormReducer';
// react components
const SignUpForm = () => {
  //  react redux
  const dispatch = useDispatch();
  //  react router
  const navigate = useNavigate();
  // Refs
  const nameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const passwordConfirmInputRef = useRef();
  // cookies
  const [checkCookies, setcheckCookies] = useState(Cookies.get('token'));
  // show navbar
  dispatch(authUiActions.setShown());
  // sign up states
  const [signUpStates, dispatchSignUpStates] = useReducer(
    signUpStatesReducer,
    signUpStatesInitialState
  );
  // check if user is logged in
  const isLoggedIn = !!checkCookies;

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoggedIn]);
  /*  ********************************************* */
  /**************** Validate Input ****************/
  /* ********************************************* */
  const validateInput = (data) => {
    if (data.name.trim() === '') {
      dispatchSignUpStates({
        type: 'INVALID',
        errorMessage: 'Please Provide Name',
      });
      nameInputRef.current.activeError();
      return false;
    }
    if (data.email.trim() === '') {
      dispatchSignUpStates({
        type: 'INVALID',
        errorMessage: 'Please Provide Email',
      });
      emailInputRef.current.activeError();
      return false;
    }
    if (!validator.isEmail(data.email)) {
      dispatchSignUpStates({
        type: 'INVALID',
        errorMessage: 'Please Provide a Valid Email',
      });
      emailInputRef.current.activeError();
      return false;
    }
    if (data.password.trim() === '') {
      dispatchSignUpStates({
        type: 'INVALID',
        errorMessage: 'Please Provide Password',
      });
      passwordInputRef.current.activeError();
      return false;
    }
    if (data.password.trim().length < 8) {
      dispatchSignUpStates({
        type: 'INVALID',
        errorMessage: 'Password Should at least be 8 digits',
      });
      passwordInputRef.current.activeError();
      return false;
    }
    if (data.passwordConfirm.trim() === '') {
      dispatchSignUpStates({
        type: 'INVALID',
        errorMessage: 'Please Provide Password Confirm',
      });
      passwordConfirmInputRef.current.activeError();
      return false;
    }
    if (data.password.trim() !== data.passwordConfirm.trim()) {
      dispatchSignUpStates({
        type: 'INVALID',
        errorMessage: "Password doesn't match",
      });
      passwordInputRef.current.activeError();
      passwordConfirmInputRef.current.activeError();
      return false;
    }
    return true;
  };
  /* ********************************************* */
  /********************* Sign up ******************/
  /* ********************************************* */
  const sendSignUpRequest = async (data) => {
    /* Valaidate Inputs */
    const inputValid = validateInput(data);
    if (inputValid) {
      dispatchSignUpStates({ type: 'PENDING' });
      const response = await signUpService(data);
      if (response.status === 'success') {
        dispatchSignUpStates({ type: 'VALID' });
      } else {
        dispatchSignUpStates({
          type: 'INVALID',
          errorMessage: response.message,
        });
      }
      dispatchSignUpStates({ type: 'CLEAR' });
    }
  };
  /* ********************************************* */
  /******************* Submit Handler **************/
  /* ********************************************* */
  const submitHandler = async (event) => {
    event.preventDefault();
    const data = {
      name: nameInputRef.current.inputValue,
      email: emailInputRef.current.inputValue,
      password: passwordInputRef.current.inputValue,
      passwordConfirm: passwordConfirmInputRef.current.inputValue,
    };
    await sendSignUpRequest(data);
  };
  return (
    <form className={classes['form-container']} onSubmit={submitHandler}>
      {signUpStates.invalid && (
        <div className={classes['error-message']}>
          <img src={errorIcon} />
          <p>{signUpStates.errorMessage}</p>
        </div>
      )}
      {signUpStates.valid && (
        <div className={classes['sucess-message']}>
          <img src={sucessIcon} />
          <p> Please Check your email to veriy your account</p>
        </div>
      )}
      <InputField
        config={{ type: 'text', placeholder: 'Full Name' }}
        ref={nameInputRef}
      />
      <InputField
        config={{ type: 'email', placeholder: 'Email' }}
        ref={emailInputRef}
      />
      <InputField
        config={{ type: 'password', placeholder: 'Password' }}
        ref={passwordInputRef}
      />
      <InputField
        config={{ type: 'password', placeholder: 'Confirm Password' }}
        ref={passwordConfirmInputRef}
      />
      {!signUpStates.pending && <Button title={'Sign UP'} />}
      {signUpStates.pending && <Button title={<CompLoadSpin />} />}
    </form>
  );
};
export default React.memo(SignUpForm);
