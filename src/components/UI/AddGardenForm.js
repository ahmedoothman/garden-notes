import { useState, useRef, useEffect } from 'react';
import classes from './AddGardenForm.module.scss';
import Modal from './Modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import addWhite from '../../img/addWhite.png';
import closeImg from '../../img/close.png';
import errorIcon from '../../img/alert.png';
import ComplLoadSpin from './CompLoadSpin ';
//import Compressor from 'compressorjs'; // not working well
import imageCompression from 'browser-image-compression';
const AddGardenForm = (props) => {
  const dateNow = new Date();
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [fertilizeDate, setFertilizeDate] = useState('');
  const [plantDate, setPlantDate] = useState('');
  const [wateredDate, setWateredDate] = useState('');
  const [nameHolder, setNameHolder] = useState('');
  const [soil, setSoil] = useState('');
  const [fertilizetype, setFertilizetype] = useState('');
  const [imgFile, setImgFile] = useState(null);
  const [imageFileSize, setImageFileSize] = useState(0);
  const [fileUploading, setFileUploading] = useState(false);
  const [notesHolder, setNotesHolder] = useState('');
  const NameRef = useRef('');
  const SoilRef = useRef();
  const fertilizedTypeRef = useRef();
  const notesRef = useRef();

  /* ************************************** */
  /* Image compressed File Handler */
  /* ************************************** */
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
  useEffect(() => {
    if (props.data.name) {
      setNameHolder(props.data.name);
    }
    if (props.data.soil) {
      setSoil(props.data.soil);
    }
    if (props.data.fertilizedType) {
      setFertilizetype(props.data.fertilizedType);
    }
    if (props.data.note) {
      setNotesHolder(props.data.note);
    }
    if (props.data.plantDate) {
      setPlantDate(new Date(props.data.plantDate));
    }
    if (props.data.lastWateredDate) {
      setWateredDate(new Date(props.data.lastWateredDate));
    }
    if (props.data.lastFertilizedDate) {
      setFertilizeDate(new Date(props.data.lastFertilizedDate));
    }
  }, []);

  /* ************************************** */
  /* Image File Handler */
  /* ************************************** */
  // const imgFileHandler = (event) => {
  //   setImgFile(event.target.files[0]);
  // };
  /* ************************************** */
  /* Submit Handler */
  /* ************************************** */
  const submitHandler = async (event) => {
    event.preventDefault();
    /* Save the Data in object*/
    const dataObj = {
      name: NameRef.current.value,
      soil: SoilRef.current.value,
      fertilizeType: fertilizedTypeRef.current.value,
      notes: notesRef.current.value,
      fertilizeDate: fertilizeDate,
      plantDate: plantDate,
      wateredDate: wateredDate,
      type: 'flowers',
    };
    if (props.type == 'add' && !dataObj.name) {
      setIsError(true);
      setErrorMessage('Garden Plant Must Have a Name');
      return;
    }
    /* Send the data to the Function */
    try {
      setIsPending(true);
      if (props.type === 'add') {
        await props.sendDataItem(dataObj, imgFile);
      } else {
        await props.editDataItem(dataObj, imgFile);
      }
      /* Close pop up on finish if done*/
      await props.updateDataItems();
      props.closePopUp();
    } catch (error) {
      /* Display error message */
      setIsError(true);
      setErrorMessage(error.response.data.message);
    }
    setIsPending(false);
  };
  return (
    <Modal onClose={props.closePopUp}>
      <div className={classes['close-container']}>
        <img src={closeImg} onClick={props.closePopUp} />
      </div>
      {isError && (
        <div className={classes['error-message']}>
          <img src={errorIcon} />
          <p>{errorMessage}</p>
        </div>
      )}
      <form className={classes['form-container']} onSubmit={submitHandler}>
        <div className={classes['info-col']}>
          <div className={classes['form-control']}>
            <label htmlFor='name'>Name</label>
            <input
              type='text'
              id='name'
              placeholder={`${nameHolder}`}
              ref={NameRef}
            />
          </div>
          <div className={classes['form-control']}>
            <label htmlFor='soil'>Soil</label>
            <input
              type='text'
              id='soil'
              placeholder={`${soil}`}
              ref={SoilRef}
            />
          </div>
          <div className={classes['form-control']}>
            <label htmlFor='fertilizeDate'>Fertilize Type</label>
            <input
              type='text'
              id='fertilizeDate'
              placeholder={`${fertilizetype}`}
              ref={fertilizedTypeRef}
            />
          </div>
          <div className={classes['form-control']}>
            <label htmlFor='name'>Fertilize Date</label>
            <DatePicker
              selected={fertilizeDate}
              onChange={(date) => setFertilizeDate(date)}
            />
          </div>
          <div className={classes['form-control']}>
            <label htmlFor='name'>Plant Date</label>
            <DatePicker
              selected={plantDate}
              onChange={(date) => setPlantDate(date)}
            />
          </div>
        </div>
        <div className={classes['info-col']}>
          <div className={classes['types-conatiner']}></div>
          <div className={classes['form-control']}>
            <label htmlFor='name'>Watered Date</label>
            <DatePicker
              selected={wateredDate}
              onChange={(date) => setWateredDate(date)}
            />
          </div>
          <div className={classes['form-control']}>
            <label htmlFor='name'>Notes</label>
            <textarea ref={notesRef} placeholder={notesHolder} />
          </div>
          <div className={classes['form-control']}></div>
          <div className={classes['form-control']}>
            <label htmlFor='name'>
              {fileUploading && <ComplLoadSpin />}
              Image{' '}
              {imageFileSize !== 0 && (
                <h5 classsName={classes['file-size']}>{imageFileSize} MB</h5>
              )}
            </label>

            <input
              type='file'
              className={classes['file-input']}
              onChange={handleCompressedUpload}
            />
          </div>
          <div className={classes['form-control']}>
            {!isPending && (
              <button className={classes['add-btn-form']}>
                <img src={addWhite} />
                {props.btnTitle}
              </button>
            )}
            {isPending && (
              <button className={classes['add-btn-form']}>
                <ComplLoadSpin />
              </button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};
export default AddGardenForm;
