import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import PageTransition from '../ui/PageTransition';

const DashboardLayout = ({ children }) => {
  const [isCollapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      <Sidebar isCollapsed={isCollapsed} setCollapsed={setCollapsed} />
      
      <div className="flex-1 flex flex-col w-full h-full relative z-0">
        <Topbar />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6 lg:p-8">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
