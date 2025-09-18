import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
import { Calendar } from './Calendar.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Calendar month='9' year='2025' />
  </StrictMode>,
)
