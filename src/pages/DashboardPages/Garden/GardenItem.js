import classes from './GardenItem.module.scss';
import DeleteBtn from '../../../components/UI/Buttons/DeleteBtn';
import EditBtn from '../../../components/UI/Buttons/EditBtn';
import WaterBtn from '../../../components/UI/Buttons/WaterBtn';

import CompLoadSpin from '../../../components/UI/Spinners/CompLoadSpin ';
import { useState, useEffect } from 'react';
/* set function to calc the days */
const calcDays = (wateredDate) => {
  const oneDay = 1000 * 60 * 60 * 24;
  const dateNow = new Date().getTime();
  const lastWateredDate = new Date(wateredDate);
  // The next operation is to increment the days by 1 if passed 18 hours
  let totalDays = ((dateNow - lastWateredDate.getTime()) / oneDay).toFixed(2);
  let decimalPart = (totalDays % 1).toFixed(2);
  if (decimalPart < 0.75) {
    totalDays = Math.floor(totalDays);
  } else {
    totalDays = Math.ceil(totalDays);
  }

  let noDays = totalDays;
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
    await props.onEdit(props.data);
  };
  const waterHandler = async (data) => {
    props.onWaterReqHandler(data, props.data._id);
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
          <DeleteBtn onDelete={deleteHandler} background='black' />
          <WaterBtn onWater={waterHandler} background='black' />
          <EditBtn onEdit={editHandler} background='black' />
        </div>
      </div>
    </div>
  );
};
export default GardenItem;
