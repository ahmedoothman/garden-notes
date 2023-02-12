import classes from './AddBtn.module.scss';
import AddBtnImg from '../../../img/add.png';
import { useState } from 'react';
const AddBtn = (props) => {
  const [btnClass, setBtnClass] = useState('add-button');
  return (
    <button className={classes[btnClass]} onClick={props.openPopUp}>
      <img src={AddBtnImg} />
      <p>Add to {props.page}</p>
    </button>
  );
};
export default AddBtn;
