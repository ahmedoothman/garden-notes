import classes from './Settings.module.scss';
import { useEffect, useState } from 'react';
// react redux
import { authUiActions } from '../../../store';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Fragment } from 'react';
import InputField from '../../../components/UI/Inputs/InputField';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRef } from 'react';
import CompLoadSpin from '../../../components/UI/Spinners/CompLoadSpin ';
import errorIcon from '../../../img/warning.png';
import sucessIcon from '../../../img/checked.png';
import FormData from 'form-data';
const Settings = () => {
  let api_url = useSelector((state) => state.authUi.url_api);
  const dispatch = useDispatch();
  const [Name, setName] = useState(Cookies.get('name'));
  const [Email, setEmail] = useState(Cookies.get('email'));
  const [Photo, setPhoto] = useState(Cookies.get('photo'));
  const [Token, setToken] = useState(Cookies.get('token'));
  const [imgInput, setImgInput] = useState(null);
  const [first, setFirst] = useState(true);
  const [firstPass, setFirstPass] = useState(true);
  const [isInfoUpdated, setIsInfoUpdated] = useState(null);
  const [infoUpdatedSuccessMessage, setInfoUpdatedSuccessMessage] =
    useState('');
  const [infoUpdatedFailedMessage, setInfoUpdatedFailedMessage] = useState('');
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
  const [passwordUpdatedSuccessMessage, setPasswordUpdatedSuccessMessage] =
    useState('');
  const [passwordUpdatedFailedMessage, setPasswordUpdatedFailedMessage] =
    useState('');
  const [isEditInfoPending, setIsEditInfoPending] = useState(false);
  const [isChangePasswordPending, setIsChangePasswordPending] = useState(false);
  const NameRef = useRef();
  const EmailRef = useRef();
  const currentPasswordRef = useRef();
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();
  useEffect(() => {
    dispatch(authUiActions.setSettingsActive());
  }, []);
  const updateDataReq = async (dataUser, imgFile) => {
    let data = new FormData();
    if (dataUser.name) {
      data.append('name', dataUser.name);
    }
    if (dataUser.email) {
      data.append('email', dataUser.email);
    }
    if (imgFile) {
      data.append('photo', imgFile);
    }
    try {
      setIsEditInfoPending(true);
      const response = await axios.patch(
        `${api_url}/api/users/updateMe`,
        data,
        {
          headers: {
            Accept: '*/*',
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      setIsInfoUpdated(true);
      setFirst(false);
      setInfoUpdatedSuccessMessage(response.data.message);

      Cookies.set('name', response.data.data.user.name, {
        path: '/',
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      });
      Cookies.set('photo', response.data.data.user.photo, {
        path: '/',
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      });
      Cookies.set('email', response.data.data.user.email, {
        path: '/',
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      });
    } catch (error) {
      /* Set Error Message */
      setIsInfoUpdated(false);
      setFirst(false);
      setInfoUpdatedFailedMessage(error.response.data.message);
    }
    setIsEditInfoPending(false);
  };
  const valiatePasswordInputs = (data) => {
    if (data.passwordCurrent.trim() === '') {
      setFirstPass(false);
      setIsPasswordUpdated(false);
      setPasswordUpdatedFailedMessage('Please Provide the current password');
      currentPasswordRef.current.activeError();
      return false;
    }
    if (data.password.trim().length < 8) {
      setFirstPass(false);
      setIsPasswordUpdated(false);
      setPasswordUpdatedFailedMessage('Password must be at least 8 digits');
      newPasswordRef.current.activeError();
      return false;
    }
    if (data.passwordConfirm.trim().length < 8) {
      setFirstPass(false);
      setIsPasswordUpdated(false);
      setPasswordUpdatedFailedMessage('Please Confirm Password');
      confirmPasswordRef.current.activeError();
      return false;
    }
    if (data.passwordConfirm.trim() !== data.password.trim()) {
      setFirstPass(false);
      setIsPasswordUpdated(false);
      setPasswordUpdatedFailedMessage(`Passwords doesn't match`);
      confirmPasswordRef.current.activeError();
      newPasswordRef.current.activeError();

      return false;
    }
    return true;
  };
  const changePasswordReq = async (data) => {
    /* Validate Data */
    const status = valiatePasswordInputs(data);
    /* Axios */
    if (status) {
      try {
        setIsChangePasswordPending(true);
        const response = await axios.patch(
          `${api_url}/api/users/updateMyPassword`,
          data,
          {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        );
        setFirstPass(false);
        setIsPasswordUpdated(true);
        setPasswordUpdatedSuccessMessage('Password Successfully changed');
      } catch (error) {
        setFirstPass(false);
        setIsPasswordUpdated(false);
        setPasswordUpdatedFailedMessage(error.response.data.message);
      }
    }
    setIsChangePasswordPending(false);
  };
  const changePasswordHandler = async (event) => {
    event.preventDefault();
    const data = {
      passwordCurrent: currentPasswordRef.current.inputValue,
      password: newPasswordRef.current.inputValue,
      passwordConfirm: confirmPasswordRef.current.inputValue,
    };
    await changePasswordReq(data);
  };
  const editAccountHandler = async (event) => {
    event.preventDefault();
    let data = {
      name: '',
      email: '',
    };
    if (
      NameRef.current.inputValue.trim() !== '' &&
      EmailRef.current.inputValue.trim() !== ''
    ) {
      data = {
        name: NameRef.current.inputValue.trim(),
        email: EmailRef.current.inputValue.trim(),
      };
    }
    if (NameRef.current.inputValue.trim() !== '') {
      data = {
        name: NameRef.current.inputValue.trim(),
      };
    }
    if (EmailRef.current.inputValue.trim() !== '') {
      data = {
        email: EmailRef.current.inputValue.trim(),
      };
    }
    /* send req */
    await updateDataReq(data, imgInput);
  };
  return (
    <Fragment>
      <section className={classes['settings-page']}>
        <form className={classes['normal-info']} onSubmit={editAccountHandler}>
          <div className={classes['settings-title']}>Edit Account Info</div>
          <div className={classes['settings-inputs-container']}>
            <div className={classes['input-fields-container']}>
              <InputField
                config={{ type: 'text', placeholder: `${Name}` }}
                ref={NameRef}
              />
              <InputField
                config={{ type: 'email', placeholder: `${Email}` }}
                ref={EmailRef}
              />
              <button className={classes['settings-btn']}>
                {!isEditInfoPending && `Save Changes`}
                {isEditInfoPending && <CompLoadSpin />}
              </button>
            </div>
            <div className={classes['input-img-container']}>
              <div className={classes['input-img-container__img-conatiner']}>
                <img src={`${Photo}`} />
              </div>
              <input
                type='file'
                onChange={(event) => {
                  setImgInput(event.target.files[0]);
                }}
              />
            </div>
          </div>
          {!isInfoUpdated && !first && (
            <div className={classes['error-message']}>
              <img src={errorIcon} />
              <p>{infoUpdatedFailedMessage}</p>
            </div>
          )}
          {isInfoUpdated && !first && (
            <div className={classes['sucess-message']}>
              <img src={sucessIcon} />
              <p> {infoUpdatedSuccessMessage}</p>
            </div>
          )}
        </form>
        <hr />
        <form
          className={classes['password-info']}
          onSubmit={changePasswordHandler}
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
                {!isChangePasswordPending && `Submit`}
                {isChangePasswordPending && <CompLoadSpin />}
              </button>
            </div>
          </div>
          <br />
          {!isPasswordUpdated && !firstPass && (
            <div className={classes['error-message']}>
              <img src={errorIcon} />
              <p>{passwordUpdatedFailedMessage}</p>
            </div>
          )}
          {isPasswordUpdated && !firstPass && (
            <div className={classes['sucess-message']}>
              <img src={sucessIcon} />
              <p> {passwordUpdatedSuccessMessage}</p>
            </div>
          )}
        </form>
      </section>
    </Fragment>
  );
};
export default Settings;
