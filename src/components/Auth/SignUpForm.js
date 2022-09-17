import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authUiActions } from '../../store/index';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';
import axios from 'axios';
import classes from './SignUpForm.module.scss';
import InputField from './InputField';
import Button from './Button';
import Cookies from 'js-cookie';
import errorIcon from '../../img/warning.png';
import sucessIcon from '../../img/checked.png';
import CompLoadSpin from '../UI/CompLoadSpin ';
const SignUpForm = () => {
  const navigate = useNavigate();

  const nameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const passwordConfirmInputRef = useRef();

  const dispatch = useDispatch();
  const [checkCookies, setcheckCookies] = useState(Cookies.get('token'));
  const [formIsValid, setFormIsValid] = useState(true);
  const [isSucess, setIsSucess] = useState(false);
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  dispatch(authUiActions.setShown());

  const isLoggedIn = !!checkCookies;

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoggedIn]);
  /**************** Validate Input ****************/
  const validateInput = (data) => {
    if (data.name.trim() === '') {
      setFormIsValid(false);
      setErrorMessage('Please Provide Name');
      nameInputRef.current.activeError();
      return false;
    }
    if (data.email.trim() === '') {
      setFormIsValid(false);
      setErrorMessage('Please Provide Email');
      emailInputRef.current.activeError();
      return false;
    }
    if (!validator.isEmail(data.email)) {
      setFormIsValid(false);
      setErrorMessage('Please Provide a Valid Email');
      emailInputRef.current.activeError();
      return false;
    }
    if (data.password.trim() === '') {
      setFormIsValid(false);
      setErrorMessage('Please Provide Password');
      passwordInputRef.current.activeError();
      return false;
    }
    if (data.password.trim().length < 8) {
      setFormIsValid(false);
      setErrorMessage('Password Should at least be 8 digits');
      passwordInputRef.current.activeError();
      return false;
    }
    if (data.passwordConfirm.trim() === '') {
      setFormIsValid(false);
      setErrorMessage('Please Provide Password Confirm');
      passwordConfirmInputRef.current.activeError();
      return false;
    }
    if (data.password.trim() !== data.passwordConfirm.trim()) {
      setFormIsValid(false);
      setErrorMessage(`Password doesn't match`);
      passwordInputRef.current.activeError();
      passwordConfirmInputRef.current.activeError();
      return false;
    }
    return true;
  };
  /**************** Send Sign up request ****************/
  const sendSignUpRequest = async (data) => {
    /* Valaidate Inputs */
    const inputValid = validateInput(data);
    if (inputValid) {
      try {
        setPending(true);
        const response = await axios.post(
          'https://gardennotes.herokuapp.com/api/users/signup',
          data
        );
        setIsSucess(true);
      } catch (error) {
        console.log(error.response);
        setFormIsValid(false);
        setErrorMessage(error);
      }
    }
    setPending(false);
  };
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
      {!formIsValid && (
        <div className={classes['error-message']}>
          <img src={errorIcon} />
          <p>{errorMessage}</p>
        </div>
      )}
      {isSucess && (
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
      {!pending && <Button title={'Sign UP'} />}
      {pending && <Button title={<CompLoadSpin />} />}
    </form>
  );
};
export default React.memo(SignUpForm);
