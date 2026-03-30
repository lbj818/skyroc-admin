import { useBoolean } from 'ahooks';
import { Suspense } from 'react';

const SearchModal = lazy(() => import('./components/SearchModal'));

const GlobalSearch = memo(() => {
  const [show, { setFalse, toggle }] = useBoolean();

  return (
    <>
      <ButtonIcon
        className="px-12px"
        tooltipContent="搜索"
        onClick={toggle}
      >
        <IconUilSearch />
      </ButtonIcon>

      <Suspense>
        <SearchModal
          show={show}
          onClose={setFalse}
        />
      </Suspense>
    </>
  );
});

export default GlobalSearch;
