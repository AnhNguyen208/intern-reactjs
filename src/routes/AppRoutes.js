import { Routes, Route } from 'react-router-dom';
import Home from '../components/Home';
import TableCountries from '../components/countries/TableCountries';

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/countries" element={<TableCountries/>} />
      </Routes>
      
    </>
  );
}
export default AppRoutes;