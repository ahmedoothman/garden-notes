import OutOfStock from '../../../img/out-of-stock-black.png';
import classes from './OutofStockBtn.module.scss';
import { useState, useEffect } from 'react';
const DeleteBtn = (props) => {
  const [btnClass, setBtnClass] = useState('delete-btn');
  const [btnImg, setBtnImg] = useState(OutOfStock);
  useEffect(() => {
    if (props.background === 'black') {
      setBtnClass('out-of-stock');
      setBtnImg(OutOfStock);
    } else {
      setBtnClass('out-of-stock-white');
      // oposite of the above
      setBtnImg(OutOfStock);
    }
  }, []);
  const outOfStock = async () => {
    await props.outOfStockHandler();
  };
  return (
    <button className={classes[btnClass]} onClick={outOfStock}>
      <img src={btnImg} />
    </button>
  );
};
export default DeleteBtn;
