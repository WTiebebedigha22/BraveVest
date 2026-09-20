import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './DashboardLayout.css';

export default function DashboardLayout() {
  return (
    <div className="dash">
      <Sidebar />
      <main className="dash__main">
        <div className="dash__inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
