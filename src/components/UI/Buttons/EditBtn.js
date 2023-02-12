import editImg from '../../../img/edit.png';
import editImgBlack from '../../../img/edit-black.png';
import classes from './EditBtn.module.scss';
import { useState, useEffect } from 'react';
const EditBtn = (props) => {
  const [btnClass, setBtnClass] = useState('edit-btn');
  const [btnImg, setBtnImg] = useState(editImg);
  useEffect(() => {
    if (props.background === 'black') {
      setBtnClass('edit-btn');
      setBtnImg(editImg);
    } else {
      setBtnClass('edit-btn-white');
      setBtnImg(editImgBlack);
    }
  }, []);
  const editHandler = async () => {
    await props.onEdit();
  };
  return (
    <button className={classes[btnClass]} onClick={editHandler}>
      <img src={btnImg} />
    </button>
  );
};
export default EditBtn;
