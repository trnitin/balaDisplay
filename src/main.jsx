import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Page from './page.jsx'
import TablesPage from './tablesPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    {/* <TablesPage /> */}
    <Page />
  </StrictMode>,
)
