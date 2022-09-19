import DeleteImg from '../../img/delete.png';
import classes from './DeleteBtn.module.scss';
const DeleteBtn = (props) => {
  return (
    <button className={classes['delete-btn']}>
      <img src={DeleteImg} />
    </button>
  );
};
export default DeleteBtn;
