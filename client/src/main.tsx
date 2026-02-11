import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './stylesheets/css/site.min.css'
import { BookmarkProvider } from './context/BookmarkContext';
import { BasketProvider } from './context/BasketContext';
import { BrowserRouter } from 'react-router-dom';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <BasketProvider>
        <BookmarkProvider>
          <App />
        </BookmarkProvider>
      </BasketProvider>
    </BrowserRouter>
  </StrictMode>,
)
