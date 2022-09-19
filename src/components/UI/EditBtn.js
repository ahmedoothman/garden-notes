import editImg from '../../img/edit.png';
import classes from './EditBtn.module.scss';
const EditBtn = (props) => {
  return (
    <button className={classes['edit-btn']}>
      <img src={editImg} />
    </button>
  );
};
export default EditBtn;
