import styles from './FilterButton.module.css';

const filters = ['All', 'Landscape', 'City', 'Animals', 'Events', 'Portraits'];

interface FilterButtonProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  activeFilter,
  setActiveFilter,
}) => {
  return (
    <div className={styles.filterButton}>
      {filters.map((filter) => (
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
