import { Fragment, useEffect } from 'react';
import { UnderDevelopment } from '../../UI/UnderDevelopment';
import styles from './Inventory.module.scss';
// react redux
import { authUiActions } from '../../../store/index';
import { useDispatch } from 'react-redux';
const Inventory = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(authUiActions.setInventoryActive());
  }, []);
  return (
    <Fragment>
      <UnderDevelopment />
    </Fragment>
  );
};

export { Inventory };
