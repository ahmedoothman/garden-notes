import { Fragment, useEffect } from 'react';
import { UnderDevelopment } from '../../UI/UnderDevelopment';
import styles from './Notes.module.scss';
// react redux
import { authUiActions } from '../../../store/index';
import { useDispatch } from 'react-redux';
const Notes = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(authUiActions.setNotesActive());
  }, []);

  return (
    <Fragment>
      <UnderDevelopment />
    </Fragment>
  );
};

export { Notes };
