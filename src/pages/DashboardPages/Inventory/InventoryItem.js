// react
import React from 'react';

// styles
import styles from './InventoryItem.module.scss';
// components
import EditBtn from '../../../components/UI/Buttons/EditBtn';
import DeleteBtn from '../../../components/UI/Buttons/DeleteBtn';
import OutofStockBtn from '../../../components/UI/Buttons/OutofStockBtn';
const InventoryItem = React.memo((props) => {
  const deleteHandler = async () => {
    props.deleteInventoryItem(props.data._id);
  };
  const outOfStockHandler = async () => {
    props.outOfStockHandler(props.data._id);
  };
  return (
    <div className={styles['itemBox']}>
      <div className={styles['itemBox__imgBox']}>
        <img src={props.data.photo} alt='item image' />
      </div>
      <div className={styles['itemBox__infoBox']}>
        <div className={styles['itemBox__infoBox__itemName']}>
          {props.data.name}
        </div>
        <div className={styles['itemBox__infoBox__actionBtns']}>
          <OutofStockBtn
            background='white'
            outOfStockHandler={outOfStockHandler}
          />
          <DeleteBtn background='white' onDelete={deleteHandler} />
          <EditBtn background='white' />
        </div>
      </div>
      {props.data.available && (
        <div className={styles['availableBadge-conatiner']}>
          <div className={styles['content']}>Available</div>
        </div>
      )}
      {!props.data.available && (
        <div className={styles['ostBadge-conatiner']}>
          <div className={styles['content']}>Out Of Stock</div>
        </div>
      )}
    </div>
  );
});
export { InventoryItem };
