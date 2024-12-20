import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import authReducer from './state/index.js';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { PERSIST, FLUSH, REHYDRATE, PURGE, REGISTER, PAUSE, persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';

// Redux and redux-persist configuration
const persistConfig = { key: 'root', storage, version: 1 };
const persistedReducer = persistReducer( persistConfig, authReducer );

const store = configureStore( {
  reducer: persistedReducer,
  middleware: ( getDefaultMiddleware ) => getDefaultMiddleware( {
    serializableCheck: {
      ignoreActions: [ PERSIST, FLUSH, REHYDRATE, PURGE, REGISTER, PAUSE ]
    }
  } )
})


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
      </PersistGate>
    </Provider>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
