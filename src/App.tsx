import { RouterProvider } from '@/features/router';

import { LazyAnimate } from './features/animate';
import { AntdContextHolder, AntdProvider } from './features/antdConfig';
import { ThemeProvider } from './features/theme';

const App = () => (
  <ThemeProvider>
    <AntdProvider>
      <AntdContextHolder>
        <LazyAnimate>
          <RouterProvider />
        </LazyAnimate>
      </AntdContextHolder>
    </AntdProvider>
  </ThemeProvider>
);

export default App;
