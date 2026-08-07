import type { FC } from 'react';
import { Route, Routes } from 'react-router';
import Sidebar from './components/Sidebar.tsx';
import Home from './pages/Home.tsx';
import Report from './pages/Report.tsx';

const App: FC = () => {
  return (
    <div className='main_wrapper flex min-h-screen  '>
      <Sidebar />
      <main className='flex-1 overflow-x-hidden overflow-y-hidden  '>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/report/:id' element={<Report />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
