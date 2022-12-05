import { Fragment, useState, useRef } from 'react';
import classes from './ResetPassword.module.scss';
import wideLogo from '../img/wide-logo-web.png';
import axios from 'axios';
import InputField from '../components/Auth/InputField';
import Button from '../components/Auth/Button';
import CompLoadSpin from '../components/UI/CompLoadSpin ';
import errorIcon from '../img/warning.png';
import sucessIcon from '../img/checked.png';
import { useParams } from 'react-router-dom';

// react redux
import { authUiActions } from '../store/index';
import { useSelector } from 'react-redux';
const ResetPassword = () => {
  let api_url = useSelector((state) => state.authUi.url_api);
  const passwordInputRef = useRef();
  const passwordConfirmInputRef = useRef();
  const [isSucess, setIsSucess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pending, setPending] = useState(false);
  const navIsShown = useSelector((state) => state.authUi.navIsShown);
  const params = useParams();
  const resetToken = params.resetToken;
  const validateInput = (data) => {
    if (data.password.trim() === '') {
      setIsSucess(false);
      setErrorMessage('Please Provide Password');
      passwordInputRef.current.activeError();
      return false;
    }
    if (data.passwordConfirm.trim() === '') {
      setIsSucess(false);
      setErrorMessage('Please Provide Password Confirm');
      passwordConfirmInputRef.current.activeError();

      return false;
    }
    if (data.password.trim() !== data.passwordConfirm.trim()) {
      setIsSucess(false);
      setErrorMessage(`Passwords doesn't match`);
      passwordInputRef.current.activeError();
      passwordConfirmInputRef.current.activeError();
      return false;
    }
    return true;
  };
  const resetPasswordReq = async (data) => {
    const inputValid = validateInput(data);
    if (inputValid) {
      try {
        setPending(true);
        const response = await axios.patch(
          `${api_url}/api/users/resetPassword/${resetToken}`,
          data
        );
        setIsSucess(true);
        console.log(response);
      } catch (error) {
        setIsSucess(false);
        console.log(error.response.data.message);
        setErrorMessage(error.response.data.message);
      }
    }
    setPending(false);
  };
  const submitHandler = async (event) => {
    event.preventDefault();
    const data = {
      password: passwordInputRef.current.inputValue,
      passwordConfirm: passwordConfirmInputRef.current.inputValue,
    };

    await resetPasswordReq(data);
  };
  return (
    <Fragment>
      <section className={classes['auth-section']}>
        <div className={classes['auth-section__wrapper']}>
          <div className={classes['auth-header']}>
            <div className={classes['auth-header__img']}>
              <img src={wideLogo} />
            </div>
          </div>
          <div className={classes['auth-content']}>
            <div className={classes['auth-content__wrapper']}>
              {navIsShown && (
                <div className={classes['auth-content__nav']}>{/* nav */}</div>
              )}
              <div className={classes['auth-content__form']}>
                <form onSubmit={submitHandler}>
                  {!isSucess && errorMessage !== '' && (
                    <div className={classes['error-message']}>
                      <img src={errorIcon} />
                      <p>{errorMessage}</p>
                    </div>
                  )}
                  {isSucess && (
                    <div className={classes['sucess-message']}>
                      <img src={sucessIcon} />
                      <p> Your password succesfuly changed, try to sign in</p>
                    </div>
                  )}
                  {}
                  <InputField
                    config={{ type: 'password', placeholder: 'Password' }}
                    ref={passwordInputRef}
                  />
                  <InputField
                    config={{
                      type: 'password',
                      placeholder: 'Confirm Password',
                    }}
                    ref={passwordConfirmInputRef}
                  />
                  {!pending && <Button title={'Confirm'} />}
                  {pending && <Button title={<CompLoadSpin />} />}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};
export default ResetPassword;
