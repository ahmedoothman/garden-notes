// react
import { Fragment, useEffect, useState, useReducer } from 'react';
// components
import CompLoadSpinBig from '../../../components/UI/Spinners/CompLoadSpinBig';
import SearchTabs from '../../../components/UI/Search/SearchTabs';
import SearchBar from '../../../components/UI/Search/SearchBar';
import AddBtn from '../../../components/UI/Buttons/AddBtn';
import { InventoryItem } from './InventoryItem';
import { InventoryForm } from './InventoryForm';
// styles
import styles from './index.module.scss';
// react redux
import { authUiActions } from '../../../store/index';
import { useDispatch } from 'react-redux';
// services
import {
  fetchInventory,
  createInventoryItem,
  deleteInventoryItem,
  updateInventoryItem,
} from '../../../services/inventorySevices';
// material ui
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
// import reducer
import {
  fetchingLoadingReducer,
  intialFetchingLoadingState,
  updateLoadingReducer,
  intialUpdateLoadingState,
} from './indexReducer';
/* *********************************************************************************** */
/* ******************************** REACT COMPONENT ********************************** */
/* *********************************************************************************** */
const Inventory = () => {
  const dispatch = useDispatch();
  // inventory data
  const [inventoryData, serInventoryData] = useState([]);
  const [fetchingLoadingState, dispatchFetchingLoading] = useReducer(
    fetchingLoadingReducer,
    intialFetchingLoadingState
  );
  const [updateLoadingState, dispatchUpdateLoadingState] = useReducer(
    updateLoadingReducer,
    intialUpdateLoadingState
  );
  // form state
  const [openForm, setOpenForm] = useState(false);
  const [formType, setFormType] = useState('create');
  const [itemUpdateId, setItemUpdateId] = useState(null);
  const handleCloseFormMain = () => {
    setOpenForm(false);
  };
  const handleOpenFormMain = () => {
    setOpenForm(true);
    setFormType('create');
  };
  // snackbar state
  const handleCloseSnackbar = () => {
    dispatchFetchingLoading({ type: 'CLEAR' });
  };
  const getIdHandler = (id) => {
    setItemUpdateId(id);
  };
  /* ************************************* */
  /* ********** Tasks at Loading ********* */
  /* ************************************* */
  useEffect(() => {
    (async () => {
      await fetchInventoryData();
    })();
    dispatch(authUiActions.setInventoryActive());
  }, []);
  /* ************************************* */
  /* ************ Fetch Data ************ */
  /* ************************************* */
  const fetchInventoryData = async () => {
    dispatchFetchingLoading({ type: 'FETCHING' });
    const response = await fetchInventory();
    if (response.status === 'success') {
      serInventoryData(response.dataArray);
      dispatchFetchingLoading({ type: 'DONE-LOADING' });
    } else {
      dispatchFetchingLoading({
        type: 'ERROR',
        errorMessage: response.message,
      });
    }
  };
  /* ******************************************* */
  /* ************ Create Data Item ************* */
  /* ****************************************** */
  const createInventoryItemHandler = async (data) => {
    dispatchUpdateLoadingState({ type: 'FETCHING' });
    const response = await createInventoryItem(data);
    if (response.status === 'success') {
      dispatchFetchingLoading({ type: 'DONE-CREATED' });
      dispatchUpdateLoadingState({ type: 'DONE' });
      setOpenForm(false);
      // push new item to inventory data
      serInventoryData((prev) => [...prev, response.dataObj]);
    } else {
      dispatchUpdateLoadingState({
        type: 'ERROR',
        errorMessage: response.message,
      });
    }
  };
  /* ******************************************* */
  /* ************ Update Data Item ************* */
  /* ****************************************** */
  const updateInventoryItemHandler = async (data, id) => {
    dispatchUpdateLoadingState({ type: 'FETCHING' });
    const response = await updateInventoryItem(data, id);
    // update data

    if (response.status === 'success') {
      dispatchFetchingLoading({ type: 'DONE-UPDATED' });
      dispatchUpdateLoadingState({ type: 'DONE' });
      setOpenForm(false);

      // update inventory data
      serInventoryData((prev) =>
        prev.map((item) => {
          if (item._id === id) {
            return response.dataObj;
          }
          return item;
        })
      );
    } else {
      dispatchUpdateLoadingState({
        type: 'ERROR',
        errorMessage: response.message,
      });
    }
  };
  /* ******************************************* */
  /* ************ OutOfStock Handler *********** */
  /* ****************************************** */
  const outOfStockHandler = async (id) => {
    const data = { available: 'false' };
    dispatchUpdateLoadingState({ type: 'FETCHING' });
    const response = await updateInventoryItem(data, id);

    if (response.status === 'success') {
      dispatchFetchingLoading({ type: 'DONE-UPDATED' });
      dispatchUpdateLoadingState({ type: 'DONE' });

      // update inventory data
      serInventoryData((prev) =>
        prev.map((item) => {
          if (item._id === id) {
            return response.dataObj;
          }
          return item;
        })
      );
    } else {
      dispatchUpdateLoadingState({
        type: 'ERROR',
        errorMessage: response.message,
      });
    }
  };
  /* ******************************************* */
  /* ************ Delete Data Item ************* */
  /* ****************************************** */
  const deleteInventoryItemHandler = async (id) => {
    const response = await deleteInventoryItem(id);
    if (response.status === 'success') {
      dispatchFetchingLoading({ type: 'DONE-DELETED' });
      // delete item from inventory data
      serInventoryData((prev) => prev.filter((item) => item._id !== id));
    } else {
      dispatchFetchingLoading({
        type: 'ERROR',
        errorMessage: response.message,
      });
    }
  };
  return (
    <Fragment>
      {/* ********** SEARCH BAR ********** */}
      <SearchBar
        config={{
          type: 'search',
          placeholder: `Search in  Inventory..`,
        }}
      />
      {/* ********** SEARCH TABS ********** */}
      <SearchTabs tabs={['Seeds', 'Feretilzers', 'Soil']} />

      {/* ********** ADD BUTTON ********** */}
      <div className={styles['header-actions']}>
        <AddBtn page='inventory' openPopUp={handleOpenFormMain} />
      </div>

      {/* ********** LOADING SPINNER ********** */}
      {fetchingLoadingState.state && <CompLoadSpinBig />}

      {/* ********** INVENTORY ITEMS ********** */}
      <div className={styles['itemsContainer']}>
        {!fetchingLoadingState.state &&
          inventoryData.length > 0 &&
          inventoryData.map((item) => (
            <InventoryItem
              data={item}
              key={item._id}
              deleteInventoryItem={deleteInventoryItemHandler}
              outOfStockHandler={outOfStockHandler}
              openForm={setOpenForm}
              setFormType={setFormType}
              passID={getIdHandler}
            />
          ))}
      </div>

      {!fetchingLoadingState.state && inventoryData.length === 0 && (
        <div className={styles['noItemsMessage']}>
          <h1>No Items in your inventory 😔</h1>
        </div>
      )}
      {/* ********** INVENTORY POP UP FORM ********** */}
      <InventoryForm
        open={openForm}
        handleCloseForm={handleCloseFormMain}
        btnTitle={formType === 'create' ? 'Add to Inventory' : 'Update Item'}
        updateInventoryItem={updateInventoryItemHandler}
        updateLoadingState={updateLoadingState}
        dispatchUpdateLoadingState={dispatchUpdateLoadingState}
        createInventoryItem={createInventoryItemHandler}
        itemUpdateId={itemUpdateId}
        setItemUpdateId={setItemUpdateId}
        formType={formType}
      />
      {/* ********** ERROR SNACKBAR ********** */}
      <Snackbar
        open={fetchingLoadingState.error}
        onClose={handleCloseSnackbar}
        autoHideDuration={20000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Alert
          severity='error'
          onClose={handleCloseSnackbar}
          sx={{
            width: '100%',
            backgroundColor: '#D32F2F',
            color: '#fff',
            '& .MuiAlert-icon': {
              color: '#fff',
            },
          }}
        >
          {fetchingLoadingState.errorMessage}!
        </Alert>
      </Snackbar>
      {/* ********** SUCESS SNACKBAR ********** */}
      <Snackbar
        open={fetchingLoadingState.success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity='success'
          sx={{
            width: '100%',
            backgroundColor: '#388E3C',
            color: '#fff',
            '& .MuiAlert-icon': {
              color: '#fff',
            },
          }}
        >
          {fetchingLoadingState.successMessage}!
        </Alert>
      </Snackbar>
    </Fragment>
  );
};

export default Inventory;
