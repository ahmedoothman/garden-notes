import DeleteImg from '../../../img/delete.png';
import DeleteImgBlack from '../../../img/delete-black.png';
import classes from './DeleteBtn.module.scss';
import { useState, useEffect } from 'react';
const DeleteBtn = (props) => {
  const [btnClass, setBtnClass] = useState('delete-btn');
  const [btnImg, setBtnImg] = useState(DeleteImg);
  useEffect(() => {
    if (props.background === 'black') {
      setBtnClass('delete-btn');
      setBtnImg(DeleteImg);
    } else {
      setBtnClass('delete-btn-white');
      setBtnImg(DeleteImgBlack);
    }
  }, []);
  const deleteHandler = async () => {
    await props.onDelete();
  };
  return (
    <button className={classes[btnClass]} onClick={deleteHandler}>
      <img src={btnImg} />
    </button>
  );
};
export default DeleteBtn;
