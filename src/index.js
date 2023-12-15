import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import { HashRouter} from 'react-router-dom';
import { FilterProvider } from './FilterContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <HashRouter>
    <FilterProvider>
        <App />
      </FilterProvider>
    </HashRouter>

);
