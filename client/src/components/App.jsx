import React from 'react';
import Header from './Header.jsx';
 
const App = (props) => (
  <div className="container">
    <Header />
    <div>
      { props.children } 
    </div>
  </div>
);

export default App;