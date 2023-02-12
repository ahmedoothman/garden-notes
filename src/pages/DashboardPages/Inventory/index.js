// react
import { Fragment, useEffect, useState, useReducer } from 'react';
// components
import { UnderDevelopment } from '../../../components/UI/UnderDevelopment';
import CompLoadSpinBig from '../../../components/UI/Spinners/CompLoadSpinBig';
import SearchTabs from '../../../components/UI/Search/SearchTabs';
import SearchBar from '../../../components/UI/Search/SearchBar';
import AddBtn from '../../../components/UI/Buttons/AddBtn';
import { InventoryItem } from './InventoryItem';
import { InventoryForm } from './InventoryForm';
// styles
import styles from './Inventory.module.scss';
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
/* ************************************* */
/* ********* Reducers Functions ******** */
/* ************************************* */
//Fetching Loading Reducer
const fetchingLoadingReducer = (state, action) => {
  if (action.type === 'FETCHING') {
    return {
      state: true,
      success: state.success,
      successMessage: state.successMessage,
      error: false,
      errorMessage: '',
    };
  }
  if (action.type === 'DONE-LOADING') {
    return {
      state: false,
      success: state.success,
      successMessage: state.successMessage,
      error: false,
      errorMessage: '',
    };
  }
  if (action.type === 'DONE-DELETED') {
    return {
      state: false,
      success: true,
      successMessage: 'Item Deleted Successfully',
      error: false,
      errorMessage: '',
    };
  }
  if (action.type === 'DONE-CREATED') {
    return {
      state: false,
      success: true,
      successMessage: 'Item Created Successfully',
      error: false,
      errorMessage: '',
    };
  }
  if (action.type === 'DONE-UPDATED') {
    return {
      state: false,
      success: true,
      successMessage: 'Item Updated Successfully',
      error: false,
      errorMessage: '',
    };
  }
  if (action.type === 'ERROR') {
    return {
      state: false,
      success: false,
      successMessage: '',
      error: true,
      errorMessage: action.errorMessage,
    };
  }
  return {
    state: false,
    success: false,
    successMessage: '',
    error: false,
    errorMessage: '',
  };
};
//Update Loading Reducer
const updateLoadingReducer = (state, action) => {
  if (action.type === 'FETCHING') {
    return { state: true, error: false, errorMessage: '' };
  }
  if (action.type === 'DONE') {
    return { state: false, error: false, errorMessage: '' };
  }
  if (action.type === 'ERROR') {
    return { state: false, error: true, errorMessage: action.errorMessage };
  }
  return { state: false, error: false, errorMessage: '' };
};

/* *********************************************************************************** */
/* ******************************** REACT COMPONENT ********************************** */
/* *********************************************************************************** */
const Inventory = () => {
  const dispatch = useDispatch();
  // inventory data
  const [inventoryData, setinventoryData] = useState(null);
  const [fetchingLoadingState, dispatchFetchingLoading] = useReducer(
    fetchingLoadingReducer,
    {
      state: false,
      error: false,
      errorMessage: '',
    }
  );
  const [updateLoadingState, dispatchUpdateLoadingState] = useReducer(
    updateLoadingReducer,
    {
      state: false,
      error: false,
      errorMessage: '',
    }
  );
  // form state
  const [openForm, setOpenForm] = useState(false);
  const handleCloseFormMain = () => {
    setOpenForm(false);
  };
  const handleOpenFormMain = () => {
    setOpenForm(true);
  };
  // snackbar state
  const handleCloseSnackbar = () => {
    dispatchFetchingLoading({ type: 'DONE' });
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
      setinventoryData(response.dataArray);
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
      await fetchInventoryData();
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
    if (response.status === 'success') {
      dispatchFetchingLoading({ type: 'DONE-UPDATED' });
      dispatchUpdateLoadingState({ type: 'DONE' });
      setOpenForm(false);
      await fetchInventoryData();
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
      await fetchInventoryData();
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
    dispatchFetchingLoading({ type: 'FETCHING' });
    const response = await deleteInventoryItem(id);
    if (response.status === 'success') {
      dispatchFetchingLoading({ type: 'DONE-DELETED' });
      await fetchInventoryData();
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
          inventoryData &&
          inventoryData.map((item) => (
            <InventoryItem
              data={item}
              key={item._id}
              deleteInventoryItem={deleteInventoryItemHandler}
              outOfStockHandler={outOfStockHandler}
            />
          ))}
      </div>

      {/* ********** INVENTORY POP UP FORM ********** */}
      <InventoryForm
        open={openForm}
        handleCloseForm={handleCloseFormMain}
        btnTitle='Add to Inventory'
        updateLoadingState={updateLoadingState}
        createInventoryItem={createInventoryItemHandler}
      />
      {/* ********** ERROR SNACKBAR ********** */}
      <Snackbar
        open={fetchingLoadingState.error}
        autoHideDuration={20000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Alert
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
