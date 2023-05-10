import classes from './Settings.module.scss';
import { Fragment } from 'react';
import { useEffect, useState, useReducer, useRef } from 'react';
// react redux
import { authUiActions, userInfoActions } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
// services
import {
  updateUserDataService,
  updatePasswordService,
} from '../../../services/userServices';
// libraries
import Cookies from 'js-cookie';
// components
import InputField from '../../../components/UI/Inputs/InputField';
import CompLoadSpin from '../../../components/UI/Spinners/CompLoadSpin ';
// material ui
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// import reducer
import {
  accountInfoInitialState,
  accountInfoReducer,
  userInfoInitialState,
  userInfoReducer,
  passwordInitialState,
  passwordReducer,
} from './SettingsReducer';
// react component
const Settings = () => {
  let api_url = useSelector((state) => state.authUi.url_api);
  const dispatch = useDispatch();
  /*  ********************************************
   * NAME : Input Refs
   * DESC : refs to collect data and send it to the server
   ******************************************** */
  const NameRef = useRef();
  const EmailRef = useRef();
  const currentPasswordRef = useRef();
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();
  // get image input
  const [imgInput, setImgInput] = useState(null);

  /* ******************************************** */
  /* *********** User Info Reducer *********** */
  /* ****************************************** */
  const [userInfoState, dispatchUserInfoReducer] = useReducer(
    userInfoReducer,
    userInfoInitialState
  );
  /* ******************************************** */
  /* *********** Account Info Reducer *********** */
  /* ****************************************** */
  const [accountInfoState, dispatchAccountInfo] = useReducer(
    accountInfoReducer,
    accountInfoInitialState
  );
  /* ******************************************** */
  /* *********** password Info Reducer *********** */
  /* ****************************************** */
  const [passwordState, dispatchPassword] = useReducer(
    passwordReducer,
    passwordInitialState
  );
  /* ******************************************** */
  /* *********** Set Active Page *********** */
  /* ****************************************** */
  useEffect(() => {
    // set active page
    dispatch(authUiActions.setSettingsActive());
    // update user info from cookies
    dispatchUserInfoReducer({ type: 'UPDATE-COOKIES' });
  }, []);

  /* ******************************************** */
  /* *********** Update Account Info *********** */
  /* ****************************************** */
  const updateAccountInfo = async (data) => {
    dispatchAccountInfo({ type: 'UPDATING' });
    // send data to server
    const response = await updateUserDataService(data);
    if (response.status === 'success') {
      dispatchAccountInfo({ type: 'SUCCESS' });
      dispatchUserInfoReducer({ type: 'UPDATE', data: response.dataArray });
      dispatch(userInfoActions.updateUserDataServiceFromCookies());
    } else {
      dispatchAccountInfo({ type: 'ERROR', errorMessage: response.message });
    }
  };
  /* ******************************************** */
  /* ********** Validate Password Input ******** */
  /* ****************************************** */
  const valiatePasswordInputs = (data) => {
    if (data.passwordCurrent.trim() === '') {
      dispatchPassword({
        type: 'ERROR',
        errorMessage: 'Please Provide the current password',
      });
      currentPasswordRef.current.activeError();
      return false;
    }
    if (data.password.trim().length < 8) {
      dispatchPassword({
        type: 'ERROR',
        errorMessage: 'Password must be at least 8 digits',
      });
      newPasswordRef.current.activeError();
      return false;
    }
    if (data.passwordConfirm.trim().length < 8) {
      dispatchPassword({
        type: 'ERROR',
        errorMessage: 'Please Confirm Password',
      });
      confirmPasswordRef.current.activeError();
      return false;
    }
    if (data.passwordConfirm.trim() !== data.password.trim()) {
      dispatchPassword({
        type: 'ERROR',
        errorMessage: "Passwords doesn't match",
      });
      confirmPasswordRef.current.activeError();
      newPasswordRef.current.activeError();
      return false;
    }
    return true;
  };
  /* ******************************************** */
  /* ********** Validate Password Input ******** */
  /* ****************************************** */
  const changePasswordReq = async (data) => {
    /* Validate Data */
    const status = valiatePasswordInputs(data);
    /* Axios */
    if (status) {
      dispatchPassword({ type: 'UPDATING' });
      const response = await updatePasswordService(data);
      if (response.status === 'success') {
        dispatchPassword({ type: 'SUCCESS' });
      } else {
        dispatchPassword({ type: 'ERROR', errorMessage: response.message });
      }
    }
  };
  /* ************************************************ */
  /* ********** Change Password Form Handler ******** */
  /* ************************************************ */
  const changePasswordFormHandler = async (event) => {
    event.preventDefault();
    const data = {
      passwordCurrent: currentPasswordRef.current.inputValue,
      password: newPasswordRef.current.inputValue,
      passwordConfirm: confirmPasswordRef.current.inputValue,
    };
    // send data to server
    await changePasswordReq(data);
  };
  // snackbar state handler
  const handleCloseSnackbar = () => {
    dispatchAccountInfo({ type: 'CLEAR' });
  };
  /* ************************************************** */
  /* ************ Edit Account Form handler *********** */
  /* ************************************************** */
  const editAccountFormHandler = async (event) => {
    event.preventDefault();
    let data = {
      name: '',
      email: '',
      photo: null,
    };
    if (NameRef.current.inputValue.trim() !== '') {
      data.name = NameRef.current.inputValue.trim();
    }
    if (EmailRef.current.inputValue.trim() !== '') {
      data.email = EmailRef.current.inputValue.trim();
    }
    // add the image to the data
    data.photo = imgInput;
    // send data to server
    await updateAccountInfo(data);
  };
  return (
    <Fragment>
      <section className={classes['settings-page']}>
        {/* ********************************************* */}
        {/* Account info */}
        {/* ********************************************* */}
        <form
          className={classes['normal-info']}
          onSubmit={editAccountFormHandler}
        >
          <div className={classes['settings-title']}>Edit Account Info</div>
          <div className={classes['settings-inputs-container']}>
            <div className={classes['input-fields-container']}>
              <InputField
                config={{ type: 'text', placeholder: `${userInfoState.name}` }}
                ref={NameRef}
              />
              <InputField
                config={{
                  type: 'email',
                  placeholder: `${userInfoState.email}`,
                }}
                ref={EmailRef}
              />
              <button className={classes['settings-btn']}>
                {!accountInfoState.pending && `Save Changes`}
                {accountInfoState.pending && <CompLoadSpin />}
              </button>
            </div>
            {/* image part */}
            <div className={classes['input-img-container']}>
              <div className={classes['input-img-container__img-conatiner']}>
                <img src={`${userInfoState.photo}`} />
              </div>
              <input
                type='file'
                onChange={(event) => {
                  setImgInput(event.target.files[0]);
                }}
              />
            </div>
          </div>
          {/* ********** ERROR SNACKBAR ********** */}
          <Snackbar
            open={accountInfoState.error}
            onClose={handleCloseSnackbar}
            autoHideDuration={20000}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Alert
              severity='error'
              onClose={handleCloseSnackbar}
              sx={{
                width: '100%',
                backgroundColor: '#D32F2F',
                color: '#fff',
                '& .MuiAlert-icon': {
                  color: '#fff',
                },
              }}
            >
              {accountInfoState.errorMessage}!
            </Alert>
          </Snackbar>
          {/* ********** SUCESS SNACKBAR ********** */}
          <Snackbar
            open={accountInfoState.success}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity='success'
              sx={{
                width: '100%',
                backgroundColor: '#388E3C',
                color: '#fff',
                '& .MuiAlert-icon': {
                  color: '#fff',
                },
              }}
            >
              {accountInfoState.successMessage}!
            </Alert>
          </Snackbar>
        </form>

        <hr />
        {/* ********************************************* */}
        {/* password section */}
        {/* ********************************************* */}
        <form
          className={classes['password-info']}
          onSubmit={changePasswordFormHandler}
        >
          <div className={classes['settings-title']}>Change Password</div>
          <div className={classes['settings-inputs-container']}>
            <div className={classes['input-fields-container']}>
              <InputField
                config={{ type: 'password', placeholder: 'Current Password' }}
                ref={currentPasswordRef}
              />
              <InputField
                config={{ type: 'password', placeholder: 'New Password' }}
                ref={newPasswordRef}
              />
              <InputField
                config={{ type: 'password', placeholder: 'Confirm Password' }}
                ref={confirmPasswordRef}
              />
              <button className={classes['settings-btn']}>
                {!passwordState.pending && `Submit`}
                {passwordState.pending && <CompLoadSpin />}
              </button>
            </div>
          </div>
          <br />
          {/* ********** ERROR SNACKBAR ********** */}
          <Snackbar
            open={passwordState.error}
            onClose={handleCloseSnackbar}
            autoHideDuration={20000}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Alert
              severity='error'
              onClose={handleCloseSnackbar}
              sx={{
                width: '100%',
                backgroundColor: '#D32F2F',
                color: '#fff',
                '& .MuiAlert-icon': {
                  color: '#fff',
                },
              }}
            >
              {passwordState.errorMessage}!
            </Alert>
          </Snackbar>
          {/* ********** SUCESS SNACKBAR ********** */}
          <Snackbar
            open={passwordState.success}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity='success'
              sx={{
                width: '100%',
                backgroundColor: '#388E3C',
                color: '#fff',
                '& .MuiAlert-icon': {
                  color: '#fff',
                },
              }}
            >
              {passwordState.successMessage}!
            </Alert>
          </Snackbar>
        </form>
      </section>
    </Fragment>
  );
};
export default Settings;
