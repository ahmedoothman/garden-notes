import { useState } from 'react';
import classes from './AddGardenForm.module.scss';
import Modal from './Modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ImageUploading from 'react-images-uploading';
import addWhite from '../../img/addWhite.png';
const AddGardenForm = (props) => {
  const dateNow = new Date();

  const [fertilizeDate, setFertilizeDate] = useState(dateNow);
  const [plantDate, setPlantDate] = useState(dateNow);
  const [nameHolder, setNameHolder] = useState('');
  const [soil, setSoil] = useState('');
  const [fertilizetype, setFertilizetype] = useState('');

  return (
    <Modal>
      <form className={classes['form-container']}>
        <div className={classes['info-col']}>
          <div className={classes['form-control']}>
            <label htmlFor='name'>Name</label>
            <input type='text' id='name' placeholder={`${nameHolder || ''}`} />
          </div>
          <div className={classes['form-control']}>
            <label htmlFor='soil'>Soil</label>
            <input type='text' id='soil' placeholder={`${soil || ''}`} />
          </div>
          <div className={classes['form-control']}>
            <label htmlFor='fertilizeDate'>Fertilize Type</label>
            <input
              type='text'
              id='fertilizeDate'
              placeholder={`${fertilizetype || ''}`}
            />
          </div>
          <div className={classes['form-control']}>
            <label htmlFor='name'>Fertilize Date</label>
            <DatePicker
              selected={fertilizeDate}
              onChange={(date) => setStartDate(date)}
            />
          </div>
          <div className={classes['form-control']}>
            <label htmlFor='name'>Plant Date</label>
            <DatePicker
              selected={plantDate}
              onChange={(date) => setStartDate(date)}
            />
          </div>
          <div className={classes['form-control']}></div>
        </div>
        <div className={classes['info-col']}>
          <div className={classes['form-control']}>
            <label htmlFor='name'>Notes</label>
            <textarea />
          </div>
          <div className={classes['form-control']}>
            <label htmlFor='name'>Image</label>
            <input type='file' className={classes['file-input']} />
          </div>
          <div className={classes['form-control']}>
            <button>
              <img src={addWhite} />
              <p>Add to Garden</p>
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
export default AddGardenForm;
