import React from 'react';
import Header from './Header.jsx';
 
const App = (props) => (
  <div>
    <Header />
    <div className="appChildren">
      { props.children } 
    </div>
  </div>
);

export default App;