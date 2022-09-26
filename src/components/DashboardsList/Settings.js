import classes from './Settings.module.scss';
import { useEffect, useState } from 'react';
import { authUiActions } from '../../store';
import { useDispatch } from 'react-redux';
import { Fragment } from 'react';
import InputField from '../Auth/InputField';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRef } from 'react';
import CompLoadSpin from '../UI/CompLoadSpin ';
import errorIcon from '../../img/warning.png';
import sucessIcon from '../../img/checked.png';
import FormData from 'form-data';
const Settings = () => {
  const dispatch = useDispatch();
  const [Name, setName] = useState(Cookies.get('name'));
  const [Email, setEmail] = useState(Cookies.get('email'));
  const [Photo, setPhoto] = useState(Cookies.get('photo'));
  const [Token, setToken] = useState(Cookies.get('token'));
  const [imgInput, setImgInput] = useState(null);
  const [first, setFirst] = useState(true);
  const [isInfoUpdated, setIsInfoUpdated] = useState(null);
  const [infoUpdatedSuccessMessage, setInfoUpdatedSuccessMessage] =
    useState('');
  const [infoUpdatedFailedMessage, setInfoUpdatedFailedMessage] = useState('');
  const [isEditInfoPending, setIsEditInfoPending] = useState(false);
  const [isChangePasswordPending, setIsChangePasswordPending] = useState(false);
  const NameRef = useRef();
  const EmailRef = useRef();
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
        'https://gardennotes.herokuapp.com/api/users/updateMe',
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
                <img
                  src={`https://gardennotes.herokuapp.com/api/img/users/${Photo}`}
                />
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
        <form className={classes['password-info']}>
          <div className={classes['settings-title']}>Change Password</div>
          <div className={classes['settings-inputs-container']}>
            <div className={classes['input-fields-container']}>
              <InputField
                config={{ type: 'password', placeholder: 'Current Password' }}
              />
              <InputField
                config={{ type: 'password', placeholder: 'New Password' }}
              />
              <InputField
                config={{ type: 'password', placeholder: 'Confirm Password' }}
              />
              <button className={classes['settings-btn']}>
                {!isChangePasswordPending && `Submit`}
                {isChangePasswordPending && <CompLoadSpin />}
              </button>
            </div>
          </div>
        </form>
      </section>
    </Fragment>
  );
};
export default Settings;
