import waterImg from '../../../img/waterCan.png';
import classes from './WaterBtn.module.scss';
const EditBtn = (props) => {
  const today = new Date();
  const dataObj = { wateredDate: today };
  const waterHandler = async () => {
    await props.onWater(dataObj);
  };
  return (
    <button className={classes['edit-btn']} onClick={waterHandler}>
      <img src={waterImg} />
    </button>
  );
};
export default EditBtn;
