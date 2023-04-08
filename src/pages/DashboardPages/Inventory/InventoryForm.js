//react
import { React, useEffect, useRef, useState } from 'react';
// styles
import styles from './InventoryForm.module.scss';
// components
import ComplLoadSpin from '../../../components/UI/Spinners/CompLoadSpin ';
// material ui
import Modal from '@mui/material/Modal';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
// img
import closeImg from '../../../img/close.png';
import addWhite from '../../../img/addWhite.png';
// library
import imageCompression from 'browser-image-compression';
// services
import { getItemInventory } from '../../../services/inventorySevices';
const InventoryForm = (props) => {
  // form info
  const [name, setName] = useState('');
  const [itemType, setItemType] = useState('soil');
  const [Available, setAvailable] = useState('true');
  const [fileUploading, setFileUploading] = useState(false);
  const [imageFileSize, setImageFileSize] = useState(0);
  const [imgFile, setImgFile] = useState(null);
  // form state
  const [isFormPending, setIsFormPending] = useState(false);
  /* ************************************* */
  /* ********** Tasks at Loading ********* */
  /* ************************************* */
  const { itemUpdateId } = props;
  useEffect(() => {
    if (itemUpdateId) {
      setIsFormPending(true);
      (async () => {
        const response = await getItemInventory(props.itemUpdateId);
        if (response.status === 'success') {
          setName(response.data.name);
          setItemType(response.data.Type);
          setAvailable(response.data.available === true ? 'true' : 'false');
          setImgFile(response.data.photo);
          setIsFormPending(false);
        }
      })();
    }
  }, [itemUpdateId]);
  //   handle close form
  const handleCloseForm = () => {
    // reset form
    setName('');
    setItemType('soil');
    setAvailable('true');
    setImgFile(null);
    setImageFileSize(0);
    props.setItemUpdateId(null);
    props.handleCloseForm();
  };

  // type Select
  const handleSelectChange = (event) => {
    setItemType(event.target.value);
  };
  /* ************************************* */
  /* ********* Image Uploader ************ */
  /* ************************************* */
  const handleCompressedUpload = async (e) => {
    setFileUploading(true);
    const imageFile = e.target.files[0];
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      setImgFile(compressedFile);
      setFileUploading(false);
      setImageFileSize((compressedFile.size / 1024 / 1024).toFixed(2));
    } catch (error) {
      console.log(error);
    }
  };
  /* ************************************* */
  /* ********* Form Handler ************ */
  /* ************************************* */
  const formSubmitHandler = async (event) => {
    event.preventDefault();

    const data = {
      name: name,
      type: itemType,
      available: Available,
      photo: imgFile,
    };

    if (props.formType === 'create') {
      if (name === '') {
        console.log('name is required');
        props.dispatchUpdateLoadingState({
          type: 'ERROR',
          errorMessage: 'Name is required',
        });
        return;
      }
      // send data to server
      await props.createInventoryItem(data);
    } else {
      await props.updateInventoryItem(data, itemUpdateId);
    }
    // reset form
    setName('');
    setImgFile(null);
    setImageFileSize(0);
    props.setItemUpdateId(null);
  };
  return (
    <Modal
      open={props.open}
      onClose={handleCloseForm}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      {!isFormPending ? (
        <div className={styles['formCenter']}>
          <form
            action=''
            onSubmit={formSubmitHandler}
            className={styles['formContainer']}
          >
            <div className={styles['close-container']}>
              <img src={closeImg} onClick={handleCloseForm} />
            </div>
            <div className={styles['input-container']}>
              <label htmlFor=''>Name</label>
              <input
                type='text'
                placeholder={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className={styles['input-container']}>
              <label htmlFor=''>Type</label>
              <Select
                labelId='demo-simple-select-helper-label'
                id='demo-simple-select-helper'
                onChange={handleSelectChange}
                value={itemType}
                inputProps={{ 'aria-label': 'Without label' }}
                sx={{
                  width: '110%',
                  height: '45px',
                }}
              >
                <MenuItem value={'soil'}>Soil</MenuItem>
                <MenuItem value={'seeds'}>Seeds</MenuItem>
                <MenuItem value={'fertilizers'}>Feretilzers</MenuItem>
              </Select>
            </div>
            <div className={styles['input-container']}>
              <label htmlFor=''>Available</label>
              <RadioGroup
                row
                aria-labelledby='demo-row-radio-buttons-group-label'
                name='row-radio-buttons-group'
                value={Available}
                onChange={(e) => setAvailable(e.target.value)}
              >
                <FormControlLabel
                  value='true'
                  control={<Radio className={styles['radio']} />}
                  sx={{
                    '& 	.MuiTypography-root ': {
                      fontSize: '14px',
                    },
                  }}
                  label='Yes'
                />
                <FormControlLabel
                  value='false'
                  control={<Radio className={styles['radio']} />}
                  sx={{
                    '& 	.MuiTypography-root ': {
                      fontSize: '14px',
                    },
                  }}
                  label='No'
                />
              </RadioGroup>
            </div>
            <div className={styles['input-container']}>
              <label htmlFor='name'>
                Image {imageFileSize !== 0 && <h5>{imageFileSize} MB</h5>}
                {fileUploading && (
                  <CircularProgress
                    size='15px'
                    sx={{
                      '&	.MuiCircularProgress-svg': {
                        color: '#2c2c2c',
                      },
                    }}
                  />
                )}
              </label>
              <input type='file' onChange={handleCompressedUpload}></input>
            </div>
            <div className={styles['form-control']}>
              {!props.updateLoadingState.state && (
                <button className={styles['add-btn-form']}>
                  <img src={addWhite} />
                  {props.btnTitle}
                </button>
              )}
              {props.updateLoadingState.state && (
                <button className={styles['add-btn-form']}>
                  <ComplLoadSpin />
                </button>
              )}
            </div>
          </form>
          {/* ********** ERROR SNACKBAR ********** */}
          <Snackbar
            open={props.updateLoadingState.error}
            onClose={() => props.dispatchUpdateLoadingState({ type: 'CLEAR' })}
            autoHideDuration={6000}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Alert
              severity='error'
              onClose={() =>
                props.dispatchUpdateLoadingState({ type: 'CLEAR' })
              }
              sx={{
                width: '100%',
                backgroundColor: '#D32F2F',
                color: '#fff',
                '& .MuiAlert-icon': {
                  color: '#fff',
                },
              }}
            >
              {props.updateLoadingState.errorMessage}!
            </Alert>
          </Snackbar>
        </div>
      ) : (
        <div className={styles['formCenter']}>
          <CircularProgress
            size='60px'
            sx={{
              '&	.MuiCircularProgress-svg': {
                backgroundColor: '#2c2c2c',
                borderRadius: '50%',
                padding: '10px',
                color: '#fff',
              },
            }}
          />
        </div>
      )}
    </Modal>
  );
};
export { InventoryForm };
