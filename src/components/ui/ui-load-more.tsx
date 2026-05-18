// Components
import { UiLoader } from '@/components/ui';

type UiLoadMoreProps = {
  hasNextPage?: boolean;
  loading?: boolean;
  onLoadMore: () => void;
  label?: string;
  endLabel?: string;
};

export const UiLoadMore = ({
  hasNextPage = false,
  loading = false,
  onLoadMore,
  label = 'Загрузить ещё',
  endLabel = 'Все проекты загружены',
}: UiLoadMoreProps) => {
  if (!hasNextPage) {
    return <div className="ui-load-more ui-load-more--end">{endLabel}</div>;
  }

  return (
    <div className="ui-load-more">
      <button
        className="ui-load-more__button"
        type="button"
        disabled={loading}
        onClick={onLoadMore}
      >
        {loading ? <UiLoader size="tiny" variant="light" inline /> : label}
      </button>
    </div>
  );
};

export default UiLoadMore;
