import React, { useRef, useState, useEffect, useCallback } from 'react';
import classes from './SignInForm.module.scss';
import InputField from './InputField';
import Button from './Button';
import { useDispatch } from 'react-redux';
import { authUiActions } from '../../store/index';
import { Link, useNavigate } from 'react-router-dom';
import errorIcon from '../../img/warning.png';
import useCookies from 'react-cookie/cjs/useCookies';
import CompLoadSpin from '../UI/CompLoadSpin ';
import Cookies from 'js-cookie';
import axios from 'axios';
const SignInForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [checkCookies, setcheckCookies] = useState(Cookies.get('token'));

  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isvalid, setIsvalid] = useState(true);
  const [errorMessage, setErrorMessage] = useState();
  const [pending, setPending] = useState(false);
  const [cookies, setCookies] = useCookies(['user']);
  dispatch(authUiActions.setShown());

  const isLoggedIn = !!checkCookies;
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard/garden', { replace: true });
    }
  }, [isLoggedIn]);

  const setCookiesHandler = (token, name, photo, email) => {
    setCookies('token', token, {
      path: '/',
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    });
    setCookies('name', name, {
      path: '/',
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    });
    setCookies('photo', photo, {
      path: '/',
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    });
    setCookies('email', email, {
      path: '/',
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    });
    Cookies.set('navIsMin', false, {
      path: '/',
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    });
  };
  /**************** Validate Input ****************/
  const validateInput = useCallback((data) => {
    if (data.email.trim() == '') {
      setIsvalid(false);
      emailInputRef.current.activeError();
      setErrorMessage('Please Provide Email');
      return false;
    }
    if (data.password.trim() == '') {
      setIsvalid(false);
      setErrorMessage('Please Provide Password');
      passwordInputRef.current.activeError();
      return false;
    }
    return true;
  }, []);
  /**************** Login http request ****************/
  const sendLoginReq = useCallback(async (data) => {
    const inputValid = validateInput(data);
    if (inputValid) {
      try {
        setPending(true);
        const response = await axios.post(
          'https://gardennotes.herokuapp.com/api/users/login',
          data
        );
        setIsvalid(true);
        /*Set Cookies */
        setCookiesHandler(
          response.data.token,
          response.data.data.user.name,
          response.data.data.user.photo,
          response.data.data.user.email
        );
        /* Forward to DashBoard */
        navigate('/dashboard/garden', { replace: true });
      } catch (error) {
        setErrorMessage(error.response.data.message);
        setIsvalid(false);
        if (error.response.data.message !== 'Your email is not verified') {
          passwordInputRef.current.activeError();
          emailInputRef.current.activeError();
        }
      }
    }
    setPending(false);
  }, []);
  /**************** Submit Handler ****************/
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
      {!isvalid && (
        <div className={classes['error-message']}>
          <img src={errorIcon} />
          <p>{errorMessage}</p>
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
      {!pending && <Button title={'Sign in'} />}
      {pending && <Button title={<CompLoadSpin />} />}
      <Link to='/authentication/forget-password' className={classes['forget']}>
        {' '}
        Forget Password ?
      </Link>
    </form>
  );
};
export default React.memo(SignInForm);
