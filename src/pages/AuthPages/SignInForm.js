import axios from 'axios';
InputField;
import Cookies from 'js-cookie';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import useCookies from 'react-cookie/cjs/useCookies';
import { Link, useNavigate } from 'react-router-dom';
import errorIcon from '../../img/warning.png';
import CompLoadSpin from '../../components/UI/Spinners/CompLoadSpin ';
import Button from '../../components/UI/Buttons/Button';
import InputField from '../../components/UI/Inputs/InputField';
import classes from './SignInForm.module.scss';
// react redux
import { useDispatch } from 'react-redux';
import { authUiActions } from '../../store/index';
import { useSelector } from 'react-redux';
// services
import {
  updateUserInfoService,
  setCookiesService,
} from '../../services/userServices';

const SignInForm = () => {
  let api_url = useSelector((state) => state.authUi.url_api);
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
  // update user info
  const updateUserInfo = async () => {
    await updateUserInfoService(api_url);
  };

  useEffect(() => {
    if (isLoggedIn) {
      /* Update User Info */
      (async () => {
        await updateUserInfo();
        navigate('/dashboard/garden', { replace: true });
      })();
    }
  }, [isLoggedIn]);

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
      setPending(true);
      try {
        const response = await axios.post(`${api_url}/api/users/login`, data);
        setIsvalid(true);
        /*Set Cookies */
        setCookiesService(
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
