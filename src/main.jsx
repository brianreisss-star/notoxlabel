import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { SpeedInsights } from "@vercel/speed-insights/react"

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
        <Toaster
            position="top-center"
            toastOptions={{
                duration: 4000,
                style: {
                    borderRadius: '16px',
                    padding: '12px 20px',
                    fontSize: '14px',
                    fontWeight: '600',
                },
                success: {
                    style: { background: '#10B981', color: '#fff' },
                },
                error: {
                    style: { background: '#EF4444', color: '#fff' },
                },
            }}
        />
        <SpeedInsights />
    </BrowserRouter>,
)
