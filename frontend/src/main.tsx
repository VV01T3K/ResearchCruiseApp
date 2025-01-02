import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import '@styles/app.scss';
import App from './ToBeMoved/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
