import styles from './FilterButton.module.css';
import { photoTags } from '../../../data/photoTags';

interface FilterButtonProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export const FilterButton: React.FC<FilterButtonProps> = ({ activeFilter, setActiveFilter }) => {
  return (
    <div className={styles.filterButton}>
      {['All', ...photoTags].map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={filter === activeFilter ? styles.active : ''}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};
