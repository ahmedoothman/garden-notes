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
/* ************************************* */
/* ********* Reducers Functions ******** */
/* ************************************* */
//Fetching Loading Reducer
const intialFetchingLoadingState = {
  state: false,
  success: false,
  successMessage: '',
  error: false,
  errorMessage: '',
};
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
  if (action.type === 'CLEAR') {
    return {
      state: false,
      success: false,
      successMessage: '',
      error: false,
      errorMessage: '',
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
const intialUpdateLoadingState = {
  state: false,
  error: false,
  errorMessage: '',
};
const updateLoadingReducer = (state, action) => {
  if (action.type === 'FETCHING') {
    return { state: true, error: false, errorMessage: '' };
  }
  if (action.type === 'DONE') {
    return { state: false, error: false, errorMessage: '' };
  }
  if (action.type === 'CLEAR') {
    return { state: false, error: false, errorMessage: '' };
  }
  if (action.type === 'ERROR') {
    return {
      state: false,
      error: true,
      errorMessage: action.errorMessage,
    };
  }
  return { state: false, error: false, errorMessage: '' };
};

/* *********************************************************************************** */
/* ******************************** REACT COMPONENT ********************************** */
/* *********************************************************************************** */
const Inventory = () => {
  const dispatch = useDispatch();
  // inventory data
  const [inventoryData, setinventoryData] = useState([]);
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
      // push new item to inventory data
      setinventoryData((prev) => [...prev, response.dataObj]);
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
      setinventoryData((prev) =>
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
    setinventoryData((prev) =>
      prev.map((item) => {
        if (item._id === id) {
          return {
            ...item,
            available: data.available === 'true' ? true : false,
          };
        }
        return item;
      })
    );
    if (response.status === 'success') {
      dispatchFetchingLoading({ type: 'DONE-UPDATED' });
      dispatchUpdateLoadingState({ type: 'DONE' });
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
      setinventoryData((prev) => prev.filter((item) => item._id !== id));
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
