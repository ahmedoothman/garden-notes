import classes from './SearchTabs.module.scss';
const SearchTabs = (props) => {
  let tabsContent = props.tabs.map((tab) => (
    <li className={classes['search-tabs-item']} key={tab}>
      {tab}
    </li>
  ));

  return (
    <div className={classes['search-tabs-container']}>
      <ul>
        <li className={classes['tab-active']}>Overall</li>
        {tabsContent}
      </ul>
    </div>
  );
};
export default SearchTabs;
