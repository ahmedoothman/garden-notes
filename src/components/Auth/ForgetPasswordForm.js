import React, { useRef, useState, useEffect } from 'react';
import classes from './ForgetPasswordForm.module.scss';
import { useDispatch } from 'react-redux';
import { authUiActions } from '../../store/index';
import axios from 'axios';
import validator from 'validator';
import InputField from './InputField';
import Button from './Button';
import CompLoadSpin from '../../components/UI/CompLoadSpin ';
import errorIcon from '../../img/warning.png';
import sucessIcon from '../../img/checked.png';
const ForgetPasswordForm = () => {
  const dispatch = useDispatch();
  dispatch(authUiActions.setHidden());

  const [errorMessage, setErrorMessage] = useState('');
  const [isSucess, setIsSucess] = useState(false);
  const [pending, setPending] = useState(false);

  const emailInputRef = useRef();

  /**************** Validate Input ****************/
  const validateEmail = (data) => {
    if (data.email.trim() === '') {
      setErrorMessage('Please Provide email');
      setIsSucess(false);
      emailInputRef.current.activeError();
      return false;
    }
    if (!validator.isEmail(data.email)) {
      setErrorMessage('Please Provide a valid email');
      setIsSucess(false);
      emailInputRef.current.activeError();
      return false;
    }
    return true;
  };
  /**************** Send Email request ****************/
  const sendEmailReq = async (data) => {
    /*validate input*/
    const inputValid = validateEmail(data);
    if (inputValid) {
      try {
        setPending(true);
        const response = await axios.post(
          'https://gardennotes.herokuapp.com/api/users/forgotPassword',
          data
        );
        console.log(response.data);
        setIsSucess(true);
      } catch (error) {
        setIsSucess(false);
        setErrorMessage(error.response.data.message);
      }
    }
    setPending(false);
  };
  /**************** Submit Handler ****************/

  const submitHandler = async (event) => {
    event.preventDefault();
    const data = {
      email: emailInputRef.current.inputValue,
    };
    await sendEmailReq(data);
  };
  return (
    <form className={classes['form-container']} onSubmit={submitHandler}>
      {!isSucess && errorMessage !== '' && (
        <div className={classes['error-message']}>
          <img src={errorIcon} />
          <p>{errorMessage}</p>
        </div>
      )}
      {isSucess && (
        <div className={classes['sucess-message']}>
          <img src={sucessIcon} />
          <p> Please Check your email to reset your password</p>
        </div>
      )}
      <InputField
        config={{ type: 'email', placeholder: 'Email' }}
        ref={emailInputRef}
      />
      {!pending && <Button title={'Verify'} />}
      {pending && <Button title={<CompLoadSpin />} />}
    </form>
  );
};
export default React.memo(ForgetPasswordForm);
