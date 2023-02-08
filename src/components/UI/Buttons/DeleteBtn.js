import DeleteImg from '../../../img/delete.png';
import classes from './DeleteBtn.module.scss';
const DeleteBtn = (props) => {
  const deleteHandler = async () => {
    await props.onDelete();
  };
  return (
    <button className={classes['delete-btn']} onClick={deleteHandler}>
      <img src={DeleteImg} />
    </button>
  );
};
export default DeleteBtn;
