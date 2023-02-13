// react
import { React, useState } from 'react';
// styles
import styles from './InventoryItem.module.scss';
// components
import EditBtn from '../../../components/UI/Buttons/EditBtn';
import DeleteBtn from '../../../components/UI/Buttons/DeleteBtn';
import OutofStockBtn from '../../../components/UI/Buttons/OutofStockBtn';
// material ui
import CircularProgress from '@mui/material/CircularProgress';

const InventoryItem = (props) => {
  // item pending
  const [itemPending, setItemPending] = useState(false);
  // delete handler
  const deleteHandler = async () => {
    setItemPending(true);
    await props.deleteInventoryItem(props.data._id);
    setItemPending(false);
  };
  // edit handler
  const editHandler = async () => {
    setItemPending(true);
    props.openForm(true);
    props.setFormType('edit');
    props.passID(props.data._id);
    setItemPending(false);
  };
  // out of stock handler
  const outOfStockHandler = async () => {
    setItemPending(true);
    await props.outOfStockHandler(props.data._id);
    setItemPending(false);
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
          <EditBtn background='white' onEdit={editHandler} />
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
      {itemPending && (
        <div className={styles['itemProgress']}>
          {' '}
          <CircularProgress
            size='50px'
            sx={{
              '&	.MuiCircularProgress-svg': {
                color: '#fff',
                backgroundColor: '#2c2c2c',
                borderRadius: '50%',
                padding: '5px',
              },
            }}
          />
        </div>
      )}
    </div>
  );
};
export { InventoryItem };
