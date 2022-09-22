import classes from './GardenItem.module.scss';
import flowerImg from '../../img/flower.png';
import DeleteBtn from '../UI/DeleteBtn';
import EditBtn from '../UI/EditBtn';
import CompLoadSpin from '../UI/CompLoadSpin ';
const GardenItem = (props) => {
  const lastFertilizedDate = new Date(props.data.lastFertilizedDate);
  const plantDate = new Date(props.data.plantDate);

  const deleteHandler = async () => {
    await props.onDelete(props.data._id);
  };
  return (
    <div className={classes['garden-item']}>
      <div className={classes['garden-item__img']}>
        <img
          src={`https://gardennotes.herokuapp.com/api/img/gardenItem/${props.data.photo}`}
        />
      </div>
      <div className={classes['garden-item__content']}>
        <div className={classes['garden-item__content__title']}>
          {props.data.name}
        </div>
        <div className={classes['garden-item__content__mid']}>
          <p>
            <span>Plant Date :</span> {plantDate.toDateString()}
          </p>
          <p>
            <span>Last Fertilized Date:</span>{' '}
            {lastFertilizedDate.toDateString()}
          </p>
          <p>
            <span>Fertilize Type :</span>
            {props.data.fertilizedType}
          </p>
        </div>
        <div className={classes['garden-item__content__mid']}>
          <p>
            <span>Soil :</span> {props.data.soil}
          </p>
          <p>
            <span>Note :</span> {props.data.note}
          </p>
        </div>
        <div className={classes['garden-item__content__actions']}>
          {props.deletePending && <CompLoadSpin />}
          <DeleteBtn onDelete={deleteHandler} />
          <EditBtn />
        </div>
      </div>
    </div>
  );
};
export default GardenItem;
