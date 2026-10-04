import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopNav from './components/TopNav';
import Overview from './pages/Overview';
import Finding from './pages/Finding';
import Evidence from './pages/Evidence';
import Baseline from './pages/Baseline';
import Validation from './pages/Validation';
import Analyze from './pages/Analyze';
import Glossary from './pages/Glossary';

function App() {
  return (
    <Router>
      <TopNav />
      <Routes>
        <Route path="/"           element={<Overview />} />
        <Route path="/finding"    element={<Finding />} />
        <Route path="/evidence"   element={<Evidence />} />
        <Route path="/baseline"   element={<Baseline />} />
        <Route path="/validation" element={<Validation />} />
        <Route path="/analyze"    element={<Analyze />} />
        <Route path="/glossary"   element={<Glossary />} />
      </Routes>
    </Router>
  );
}

export default App;