import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ResourcePage from './pages/ResourcePage';
import Contribute from './pages/Contribute';
import About from './pages/About';
import Admin from './pages/Admin';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="pyqs" element={<ResourcePage resourceType="pyqs" />} />
        <Route path="notes" element={<ResourcePage resourceType="notes" />} />
        <Route path="assignments" element={<ResourcePage resourceType="assignments" />} />
        <Route path="solutions" element={<ResourcePage resourceType="solutions" />} />
        <Route path="contribute" element={<Contribute />} />
        <Route path="about" element={<About />} />
        <Route path="admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}
