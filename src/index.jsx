// src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss'; // Assuming you have some global styles
import MainView from './components/main-view/main-view'; // Import MainView

// Render the MainView component
ReactDOM.render(<MainView />, document.getElementById('app'));
