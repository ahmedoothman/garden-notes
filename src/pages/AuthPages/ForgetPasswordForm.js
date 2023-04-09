// react
import React, { useRef, useReducer } from 'react';
// styles
import classes from './ForgetPasswordForm.module.scss';
// libraries
import validator from 'validator';
// images
import errorIcon from '../../img/warning.png';
import sucessIcon from '../../img/checked.png';
// components
import InputField from '../../components/UI/Inputs/InputField';
import Button from '../../components/UI/Buttons/Button';
import CompLoadSpin from '../../components/UI/Spinners/CompLoadSpin ';
// react redux
import { useDispatch } from 'react-redux';
import { authUiActions } from '../../store/index';
// services
import { sendResetPasswordReqService } from '../../services/userServices';

// foreget password states reducer
const forgetPssswordStatesIntialStates = {
  success: false,
  error: false,
  errorMessage: '',
  pending: false,
};
const forgetPssswordStatesReducer = (state, action) => {
  if (action.type === 'SUCCESS') {
    return {
      success: true,
      error: false,
      errorMessage: '',
      pending: false,
    };
  }
  if (action.type === 'ERROR') {
    return {
      success: false,
      error: true,
      errorMessage: action.errorMessage,
      pending: false,
    };
  }
  if (action.type === 'PENDING') {
    return {
      success: false,
      error: false,
      errorMessage: '',
      pending: true,
    };
  }
  if (action.type === 'CLEAR') {
    return {
      success: state.success,
      error: state.error,
      errorMessage: state.errorMessage,
      pending: false,
    };
  }
  return forgetPssswordStatesIntialStates;
};

// react component
const ForgetPasswordForm = () => {
  // react redux
  const dispatch = useDispatch();
  // hide nav
  dispatch(authUiActions.setHidden());
  // refs
  const emailInputRef = useRef();
  // forget password states reducer
  const [forgetPssswordStates, dispatchForgetPssswordStates] = useReducer(
    forgetPssswordStatesReducer,
    forgetPssswordStatesIntialStates
  );
  /* ******************************************** */
  /**************** Validate Input ****************/
  /* ******************************************** */
  const validateEmail = (data) => {
    if (data.email.trim() === '') {
      dispatchForgetPssswordStates({
        type: 'ERROR',
        errorMessage: 'Please Provide email',
      });
      emailInputRef.current.activeError();
      return false;
    }
    if (!validator.isEmail(data.email)) {
      dispatchForgetPssswordStates({
        type: 'ERROR',
        errorMessage: 'Please Provide a valid email',
      });
      emailInputRef.current.activeError();
      return false;
    }
    return true;
  };
  /* ******************************************** */
  /**************** Send Reset request ****************/
  /* ******************************************** */
  const sendResetPasswordReq = async (data) => {
    /*validate input*/
    const inputValid = validateEmail(data);
    if (inputValid) {
      dispatchForgetPssswordStates({ type: 'PENDING' });
      const response = await sendResetPasswordReqService(data);
      if (response.status === 'success') {
        dispatchForgetPssswordStates({ type: 'SUCCESS' });
      } else {
        dispatchForgetPssswordStates({
          type: 'ERROR',
          errorMessage: response.message,
        });
      }
      dispatchForgetPssswordStates({ type: 'CLEAR' });
    }
  };
  /* ******************************************** */
  /**************** Submit Handler ****************/
  /* ******************************************** */
  const submitHandler = async (event) => {
    event.preventDefault();
    const data = {
      email: emailInputRef.current.inputValue,
    };
    await sendResetPasswordReq(data);
  };
  return (
    <form className={classes['form-container']} onSubmit={submitHandler}>
      {forgetPssswordStates.error && (
        <div className={classes['error-message']}>
          <img src={errorIcon} />
          <p>{forgetPssswordStates.errorMessage}</p>
        </div>
      )}
      {forgetPssswordStates.success && (
        <div className={classes['sucess-message']}>
          <img src={sucessIcon} />
          <p> Please Check your email to reset your password</p>
        </div>
      )}
      <InputField
        config={{ type: 'email', placeholder: 'Email' }}
        ref={emailInputRef}
      />
      {!forgetPssswordStates.pending && <Button title={'Verify'} />}
      {forgetPssswordStates.pending && <Button title={<CompLoadSpin />} />}
    </form>
  );
};
export default React.memo(ForgetPasswordForm);
