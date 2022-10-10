import classes from './GardenItem.module.scss';
import DeleteBtn from '../UI/DeleteBtn';
import EditBtn from '../UI/EditBtn';
import CompLoadSpin from '../UI/CompLoadSpin ';
import { useState, useEffect } from 'react';
/* set function to calc the days */
const calcDays = (wateredDate) => {
  const oneDay = 1000 * 60 * 60 * 24;
  const dateNow = new Date().getTime();
  const lastWateredDate = new Date(wateredDate);
  let noDays = Math.floor((dateNow - lastWateredDate.getTime()) / oneDay) - 1;
  if (noDays < 0) {
    noDays = 0;
  }
  return noDays;
};
const GardenItem = (props) => {
  const lastFertilizedDate = new Date(props.data.lastFertilizedDate);
  const lastWateredDate = new Date(props.data.lastWateredDate);
  const plantDate = new Date(props.data.plantDate);
  const [daysAgo, setDaysAgo] = useState(99);

  useEffect(() => {
    console.log();
    if (props.data.lastWateredDate) {
      /* Here */
      setDaysAgo(calcDays(props.data.lastWateredDate));
    } else {
      setDaysAgo(0);
    }
  }, []);

  const deleteHandler = async () => {
    await props.onDelete(props.data._id);
  };
  const editHandler = async () => {
    props.onEdit(props.data);
  };
  return (
    <div className={classes['garden-item']}>
      <div className={classes['garden-item__img']}>
        <img src={props.data.photo} />
      </div>
      <div className={classes['garden-item__content']}>
        <div className={classes['garden-item__content__title']}>
          {props.data.name}
        </div>
        <div className={classes['garden-item__content__mid']}>
          <p>
            <span>Plant Date :</span>{' '}
            {!props.data.plantDate ? 'No Date' : plantDate.toDateString()}
          </p>
          <p>
            <span>Last Fertilized Date:</span>{' '}
            {!props.data.lastFertilizedDate
              ? 'No Date'
              : lastFertilizedDate.toDateString()}
          </p>
          <p>
            <span>Fertilize Type :</span>
            {props.data.fertilizedType}
          </p>
        </div>
        <div className={classes['garden-item__content__mid']}>
          <p>
            <span>Last Watered Date:</span>{' '}
            {!props.data.lastWateredDate
              ? 'No Date'
              : lastWateredDate.toDateString()}
            <b className={classes['days-number']}>{daysAgo} days</b>
          </p>
          <p>
            <span>Soil :</span> {props.data.soil}
          </p>
          <p>
            <span>Note :</span> {props.data.note}
          </p>
        </div>
        <div className={classes['garden-item__content__actions']}>
          {props.isPending && <CompLoadSpin />}
          <DeleteBtn onDelete={deleteHandler} />
          <EditBtn onEdit={editHandler} />
        </div>
      </div>
    </div>
  );
};
export default GardenItem;
