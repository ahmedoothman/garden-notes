import classes from './GardenList.module.scss';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import GardenItem from './GardenItem';
import AddBtn from '../UI/AddBtn';
import CompLoadSpinBig from '../UI/CompLoadSpinBig';
import AddGardenForm from '../UI/AddGardenForm';
const GardenList = () => {
  const [gardenItems, setGardenItems] = useState([]);
  const [isDeletePending, setIsDeletePending] = useState(false);
  const [isFetchPending, setIsFetchPending] = useState(true);
  const token = Cookies.get('token');

  const deleteItemReq = async (id) => {
    try {
      setIsDeletePending(true);
      const response = await axios.delete(
        `https://gardennotes.herokuapp.com/api/garden/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
      /* Show error message */
    }
    setIsDeletePending(false);
    await fetchGardenData();
  };
  const fetchGardenData = async () => {
    try {
      setIsFetchPending(true);
      const response = await axios.get(
        'https://gardennotes.herokuapp.com/api/garden/myGarden',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGardenItems(response.data.data.data);
      setIsFetchPending(false);
    } catch (error) {
      console.log(error.response.data);
      /* Show Error Message */
    }
  };
  useEffect(() => {
    /* Load Data */
    (async () => {
      await fetchGardenData();
    })();
  }, []);
  let gardenContent = gardenItems.map((item) => (
    <GardenItem
      data={item}
      key={item._id}
      onDelete={deleteItemReq}
      deletePending={isDeletePending}
    />
  ));
  return (
    <div className={classes['garden-list']}>
      <AddBtn page='Garden' />
      {isFetchPending && <CompLoadSpinBig />}
      {!isFetchPending && gardenContent}
      {false && <AddGardenForm />}
    </div>
  );
};
export default GardenList;
