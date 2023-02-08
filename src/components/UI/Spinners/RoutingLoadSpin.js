import classes from './RoutingLoadSpin.module.scss';

const RoutingLoadSpin = () => {
  return (
    <div className={classes.conatiner}>
      <div className={classes.spinner}></div>
      <h1>Loading..</h1>
    </div>
  );
};

export default RoutingLoadSpin;
