// react
import { useEffect, useState, useRef } from 'react';
// react router
import { useNavigate } from 'react-router-dom';
// styles
import classes from './index.module.scss';
// libraries
import Cookies from 'js-cookie';
import FormData from 'form-data';
import axios from 'axios';
//components
import AddBtn from '../../../components/UI/Buttons/AddBtn';
import GardenItem from './GardenItem';
import CompLoadSpinBig from '../../../components/UI/Spinners/CompLoadSpinBig';
import AddGardenForm from './AddGardenForm';
import SearchBar from '../../../components/UI/Search/SearchBar';
import SearchTabs from '../../../components/UI/Search/SearchTabs';
// material ui
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
// react redux
import { useSelector } from 'react-redux';
import { authUiActions } from '../../../store/index';
import { useDispatch } from 'react-redux';
const GardenList = () => {
  const navigate = useNavigate();
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
  const [numberPages, setNumberPages] = useState(10);
  const token = Cookies.get('token');
  const searchRef = useRef();
  const isLoggedIn = !!tokenExists;
  const dispatch = useDispatch();

  // get data size from api
  const getDataSize = async () => {
    let dataSize;
    try {
      const response = await axios.get(`${api_url}/api/garden/myGarden`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dataSize = response.data.results;
      return +dataSize;
    } catch (error) {
      /* Show Error Message */
      setIsError(true);
      setErrorMessage(error.response.data.message);
    }
    return 10;
  };
  /* ************************************** */
  /* fetch Item Data */
  /* ************************************** */
  const fetchData = async (page = 1) => {
    //`${api_url}/api/garden/myGarden?page=${page}&limit=5&sort=createdDate`;
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
  // fetch data from api
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/authentication/sign-in', { replace: true });
      return;
    }
    dispatch(authUiActions.setGardenActive());

    getDataSize().then((dataSize) => {
      setNumberPages(Math.ceil(+dataSize / 5));
    });

    /* Load Data */
    (async () => {
      await fetchData();
    })();
  }, [isLoggedIn]);
  /* ************************************** */
  /* Snackbar Handlers */
  /* ************************************** */
  const handleCloseSnackbar = () => {
    setSnackbarState(false);
    setIsError(false);
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
      setSnackBarContent('Deleted Successfully');
      setSnackBarType('success');
      setSnackbarState(true);
    } catch (error) {
      /* Show error message */
      setIsError(true);
      setErrorMessage(error.response.data.message);
    }
    setIsPending(false);
  };
  /* ************************************** */
  /* Edit Item Function */
  /* ************************************** */
  const editItemReq = async (data) => {
    setShowEditPopUP(true);
    setDataEditObj(data);
  };
  const waterReqHandler = (data, itemID) => {
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
    try {
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
      setSnackBarContent('Edited Successfully');
      setSnackBarType('success');
      setSnackbarState(true);
    } catch (error) {
      /* Show Error Message */
      setIsError(true);
      setErrorMessage(error.response.data.message);
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

    try {
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
      setSnackBarContent('Edited Successfully');
      setSnackBarType('success');
      setSnackbarState(true);
    } catch (error) {
      /* Show Error Message */
      setIsError(true);
      setErrorMessage(error.response.data.message);
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

    try {
      const response = await axios.post(`${api_url}/api/garden/`, data, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
        },
      });
      setSnackBarContent('Added Successfully');
      setSnackBarType('success');
      setSnackbarState(true);
    } catch (error) {
      /* Show Error Message */
      setIsError(true);
      setErrorMessage(error.response.data.message);
    }
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

  const getPageNumberHandler = async (event, page) => {
    console.log(page);
    // it didn't work
    //await fetchData(page);
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
      {/* ********** ERROR SNACKBAR ********** */}
      <Snackbar
        open={isError}
        autoHideDuration={20000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity='error'
          sx={{
            width: '100%',
            backgroundColor: '#D32F2F',
            color: '#fff',
            '& .MuiAlert-icon': {
              color: '#fff',
            },
          }}
        >
          {errorMessage}!
        </Alert>
      </Snackbar>
      {/* ********** SUCCESS SNACKBAR ********** */}
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
      {!isFetchPending && (
        <Stack spacing={2}>
          <Pagination
            count={+numberPages}
            variant='outlined'
            shape='rounded'
            onChange={getPageNumberHandler}
            sx={{
              '& .MuiButtonBase-root': {
                backgroundColor: '#fff',
              },
            }}
          />
        </Stack>
      )}
      <br />
    </div>
  );
};
export default GardenList;
