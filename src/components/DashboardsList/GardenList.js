import classes from './GardenList.module.scss';
import GardenItem from './GardenItem';
import AddBtn from '../UI/AddBtn';
const GardenList = () => {
  return (
    <div className={classes['garden-list']}>
      <AddBtn page='Garden' />
      <GardenItem />
      <GardenItem />
      <GardenItem />
    </div>
  );
};
export default GardenList;
