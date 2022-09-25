import classes from './AddBtn.module.scss';
import AddBtnImg from '../../img/add.png';
const AddBtn = (props) => {
  return (
    <button className={classes['add-button']} onClick={props.openPopUp}>
      <img src={AddBtnImg} />
      <p>Add to {props.page}</p>
    </button>
  );
};
export default AddBtn;
