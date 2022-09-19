import classes from './GardenItem.module.scss';
import flowerImg from '../../img/flower.png';
import DeleteBtn from '../UI/DeleteBtn';
import EditBtn from '../UI/EditBtn';
const GardenItem = () => {
  return (
    <div className={classes['garden-item']}>
      <div className={classes['garden-item__img']}>
        <img src={flowerImg} />
      </div>
      <div className={classes['garden-item__content']}>
        <div className={classes['garden-item__content__title']}>Qatifa</div>
        <div className={classes['garden-item__content__mid']}>
          <p>
            <span>Plant Date :</span> 12/4/2022
          </p>
          <p>
            <span>Last Fertilized Date:</span> 12/4/2022
          </p>
          <p>
            <span>Fertilize Type :</span>NPK
          </p>
        </div>
        <div className={classes['garden-item__content__mid']}>
          <p>
            <span>Soil :</span> 4 Peatmos , 3 Sand, 1 Compost
          </p>
          <p>
            <span>Note :</span> Lorem Ipsum is simply dummy text of the printing
            and typesetting industry.
          </p>
        </div>
        <div className={classes['garden-item__content__actions']}>
          <DeleteBtn />
          <EditBtn />
        </div>
      </div>
    </div>
  );
};
export default GardenItem;
