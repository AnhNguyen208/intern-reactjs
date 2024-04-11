import SideBar from './components/Sidebar';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';

function App() {
  return (    
    <>
      <div className="container-fluid">
        <div className="row flex-nowrap">
          <SideBar/>
          <AppRoutes />
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>

     
    </>
  );
}

export default App;
