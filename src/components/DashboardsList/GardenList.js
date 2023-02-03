import classes from './GardenList.module.scss';
import { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import FormData from 'form-data';
import GardenItem from './GardenItem';
import AddBtn from '../UI/AddBtn';
import CompLoadSpinBig from '../UI/CompLoadSpinBig';
import AddGardenForm from '../UI/AddGardenForm';
import errorIcon from '../../img/warning.png';
import SearchBar from '../UI/SearchBar';
import SearchTabs from '../UI/SearchTabs';
// material ui
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
// react redux
import { useSelector } from 'react-redux';
import { authUiActions } from '../../store/index';
import { useDispatch } from 'react-redux';
const GardenList = () => {
  let api_url = useSelector((state) => state.authUi.url_api);
  let titleContent = useSelector((state) => state.authUi.activeTab);
  const [tokenExists, setTokenExists] = useState(Cookies.get('token'));
  const [snackbarState, setSnackbarState] = useState(false);
  const [snackBarContent, setSnackBarContent] = useState('Added Successfully');
  const [snackBarType, setSnackBarType] = useState('success');
  const [dataItems, setdataItems] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [isFetchPending, setIsFetchPending] = useState(false);
  const [showAddPopUP, setShowAddPopUP] = useState(false);
  const [showEditPopUP, setShowEditPopUP] = useState(false);
  const [dataEditObj, setDataEditObj] = useState({});
  const [errorMessage, setErrorMessage] = useState();
  const [isError, setIsError] = useState(false);
  const [itemsContent, setItemsContent] = useState('');
  const token = Cookies.get('token');
  const searchRef = useRef();
  const isLoggedIn = !!tokenExists;
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/authentication/sign-in', { replace: true });
      return;
    }
    dispatch(authUiActions.setGardenActive());
  }, [isLoggedIn]);
  /* ************************************** */
  /* Snackbar Handlers */
  /* ************************************** */
  const handleCloseSnackbar = () => {
    setSnackbarState(false);
  };
  const handleOpenSnackbar = () => {
    setSnackbarState(true);
  };
  /* ************************************** */
  /* Delete Item Function */
  /* ************************************** */
  const deleteItemReq = async (id) => {
    try {
      setIsPending(true);
      const response = await axios.delete(`${api_url}/api/garden/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      /* Show error message */
      setIsError(true);
      setErrorMessage(error.response.data.message);
    }
    setIsPending(false);
    try {
      await fetchData();
      setSnackBarContent('Deleted Successfully');
      setSnackBarType('success');
      setSnackbarState(true);
    } catch (error) {
      console.log(error);
    }
  };
  /* ************************************** */
  /* Edit Item Function */
  /* ************************************** */
  const editItemReq = async (data) => {
    setShowEditPopUP(true);
    setDataEditObj(data);
  };
  const waterReqHandler = (data, itemID) => {
    console.log(data);
    editWateredDate(data, itemID);
  };
  /* ************************************** */
  /* Edit watered Item req Function */
  /* ************************************** */
  const editWateredDate = async (dataItem, itemId) => {
    let data = new FormData();
    if (dataItem.wateredDate) {
      data.append('lastWateredDate', dataItem.wateredDate);
    }
    const response = await axios.patch(
      `${api_url}/api/garden/${itemId}`,
      data,
      {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    try {
      await fetchData();
      setSnackBarContent('Edited Successfully');
      setSnackBarType('success');
      setSnackbarState(true);
    } catch (error) {
      console.log(error);
    }
  };
  /* ************************************** */
  /* Edit Item req Function */
  /* ************************************** */
  const editDataItem = async (dataItem, imgFile) => {
    let data = new FormData();
    if (dataItem.name) {
      data.append('name', dataItem.name);
    }
    if (dataItem.plantDate) {
      data.append('plantDate', dataItem.plantDate);
    }
    if (dataItem.fertilizeDate) {
      data.append('lastFertilizedDate', dataItem.fertilizeDate);
    }
    if (dataItem.wateredDate) {
      data.append('lastWateredDate', dataItem.wateredDate);
    }
    if (dataItem.fertilizeType) {
      data.append('fertilizedType', dataItem.fertilizeType);
    }
    if (dataItem.soil) {
      data.append('soil', dataItem.soil);
    }
    if (dataItem.notes) {
      data.append('note', dataItem.notes);
    }
    if (imgFile) {
      data.append('photo', imgFile);
    }
    data.append('Type', 'flowers');

    const response = await axios.patch(
      `${api_url}/api/garden/${dataEditObj._id}`,
      data,
      {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    try {
      await fetchData();
      setSnackBarContent('Edited Successfully');
      setSnackBarType('success');
      setSnackbarState(true);
    } catch (error) {
      console.log(error);
    }
  };

  /* ************************************** */
  /* send Item Data */
  /* ************************************** */
  const sendDataItem = async (dataItem, imgFile) => {
    let data = new FormData();
    if (dataItem.name) {
      data.append('name', dataItem.name);
    }
    if (dataItem.plantDate) {
      data.append('plantDate', dataItem.plantDate);
    }
    if (dataItem.fertilizeDate) {
      data.append('lastFertilizedDate', dataItem.fertilizeDate);
    }
    if (dataItem.wateredDate) {
      data.append('lastWateredDate', dataItem.wateredDate);
    }
    if (dataItem.fertilizeType) {
      data.append('fertilizedType', dataItem.fertilizeType);
    }

    if (dataItem.soil) {
      data.append('soil', dataItem.soil);
    }
    if (dataItem.notes) {
      data.append('note', dataItem.notes);
    }
    if (imgFile) {
      data.append('photo', imgFile);
    }
    data.append('Type', 'flowers');

    const response = await axios.post(`${api_url}/api/garden/`, data, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
    });
    try {
      await fetchData();
      setSnackBarContent('Added Successfully');
      setSnackBarType('success');
      setSnackbarState(true);
    } catch (error) {
      console.log(error);
    }
  };
  /* ************************************** */
  /* fetch Item Data */
  /* ************************************** */
  const fetchData = async () => {
    try {
      setIsFetchPending(true);
      const response = await axios.get(`${api_url}/api/garden/myGarden`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setdataItems(response.data.data.data);
    } catch (error) {
      /* Show Error Message */
      setIsError(true);
      setErrorMessage(error.response.data.message);
    }
    setIsFetchPending(false);
  };
  /* ************************************** */
  /* Load Data */
  /* ************************************** */
  let normalContent;
  if (dataItems.length > 0) {
    normalContent = dataItems.map((item) => (
      <GardenItem
        data={item}
        key={item._id}
        onWaterReqHandler={waterReqHandler}
        onDelete={deleteItemReq}
        isPending={isPending}
        onEdit={editItemReq}
      />
    ));
  } else {
    normalContent = (
      <p className={classes['empty-message']}>
        There is no Plants in Your garden
      </p>
    );
  }
  /* ************************************** */
  /* Execute The Load Data Function */
  /* ************************************** */
  useEffect(() => {
    /* Load Data */
    (async () => {
      await fetchData();
    })();
  }, []);

  /* ************************************** */
  /* Open Add Pop Up */
  /* ************************************** */
  const mainOpenAddHandler = () => {
    setShowAddPopUP(true);
  };

  /* ************************************** */
  /* Close Add Pop Up */
  /* ************************************** */
  const mainCloseAddHandler = () => {
    setShowAddPopUP(false);
    setShowEditPopUP(false);
  };

  const searchHandler = (event) => {
    let itemSearch = event.target.value;
    itemSearch = itemSearch.trim().toLowerCase();
    if (dataItems.length > 0) {
      setItemsContent(
        dataItems.map((item) => {
          if (item.name.toLowerCase().includes(itemSearch)) {
            return (
              <GardenItem
                data={item}
                key={item._id}
                onDelete={deleteItemReq}
                isPending={isPending}
                onEdit={editItemReq}
                onWaterReqHandler={waterReqHandler}
              />
            );
          }
        })
      );
    }
  };

  return (
    <div className={classes['item-list']}>
      <SearchBar
        config={{
          type: 'search',
          placeholder: `Search in ${titleContent} ..`,
        }}
        typing={searchHandler}
        ref={searchRef}
      />
      {/* search tabs */}
      <SearchTabs tabs={['Flowers', 'Trees', 'Vegetables']} />
      <AddBtn page='Garden' openPopUp={mainOpenAddHandler} />
      {isFetchPending && <CompLoadSpinBig />}
      {isError && (
        <div className={classes['error-message']}>
          <img src={errorIcon} />
          <p>{errorMessage}</p>
        </div>
      )}
      {!isFetchPending && !itemsContent ? normalContent : itemsContent}
      {showAddPopUP && (
        <AddGardenForm
          data={{}}
          closePopUp={mainCloseAddHandler}
          sendDataItem={sendDataItem}
          updateDataItems={fetchData}
          type='add'
          btnTitle='Add to Garden'
        />
      )}
      {showEditPopUP && (
        <AddGardenForm
          data={dataEditObj}
          closePopUp={mainCloseAddHandler}
          sendDataItem={sendDataItem}
          updateDataItems={fetchData}
          editDataItem={editDataItem}
          type='edit'
          btnTitle='Save Changes'
        />
      )}
      <Snackbar
        open={snackbarState}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackBarType}
          sx={{
            width: '100%',
            backgroundColor: '#388E3C',
            color: '#fff',
            '& .MuiAlert-icon': {
              color: '#fff',
            },
          }}
        >
          {snackBarContent}!
        </Alert>
      </Snackbar>
    </div>
  );
};
export default GardenList;
