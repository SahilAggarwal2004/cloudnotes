import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import ToggleState from './context/toggle/ToggleState';
import NoteState from './context/notes/NoteState';
import App from './App';
import registersw from './registersw';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <StrictMode>
        <BrowserRouter>
            <ToggleState>
                <NoteState>
                    <App tab="home" />
                </NoteState>
            </ToggleState>
        </BrowserRouter>
    </StrictMode>
);

registersw();