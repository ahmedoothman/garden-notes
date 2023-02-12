//react
import { React, useRef, useState } from 'react';
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
// img
import closeImg from '../../../img/close.png';
import addWhite from '../../../img/addWhite.png';
// library
import imageCompression from 'browser-image-compression';
const InventoryForm = (props) => {
  // form info
  const [name, setName] = useState('');
  const [itemType, setItemType] = useState('soil');
  const [Available, setAvailable] = useState('true');
  const [fileUploading, setFileUploading] = useState(false);
  const [imageFileSize, setImageFileSize] = useState(0);
  const [imgFile, setImgFile] = useState(null);
  //   handle close form
  const handleCloseForm = () => {
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
    await props.createInventoryItem(data);
  };
  return (
    <Modal
      open={props.open}
      onClose={handleCloseForm}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
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
              placeholder=''
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
                '& .MuiSelect-select': {
                  borderColor: 'red',
                },
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
              <FormControlLabel value='true' control={<Radio />} label='Yes' />
              <FormControlLabel value='false' control={<Radio />} label='No' />
            </RadioGroup>
          </div>
          <div className={styles['input-container']}>
            <label htmlFor='name'>
              {fileUploading && <ComplLoadSpin />}
              Image {imageFileSize !== 0 && <h5>{imageFileSize} MB</h5>}
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
          autoHideDuration={20000}
          anchorOrigin={{
            vertical: 'bottom',
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
            {props.updateLoadingState.errorMessage}!
          </Alert>
        </Snackbar>
      </div>
    </Modal>
  );
};
export { InventoryForm };
