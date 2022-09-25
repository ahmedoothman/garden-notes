import editImg from '../../img/edit.png';
import classes from './EditBtn.module.scss';
const EditBtn = (props) => {
  const editHandler = async () => {
    await props.onEdit();
  };
  return (
    <button className={classes['edit-btn']} onClick={editHandler}>
      <img src={editImg} />
    </button>
  );
};
export default EditBtn;
