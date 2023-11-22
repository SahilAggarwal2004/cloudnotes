import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import ToggleState from './context/ToggleState';
import NoteState from './context/NoteState';
import App from './App';
import registersw from './registersw';
import './index.css';

const client = new QueryClient({ defaultOptions: { queries: { staleTime: 15000, retry: 1 } } })
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={client}>
                <ToggleState>
                    <NoteState>
                        <App tab="home" />
                    </NoteState>
                </ToggleState>
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>
);

registersw();