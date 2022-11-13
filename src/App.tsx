import './App.css';
import EventListing from './components/EventListing';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2 className='App-title'>Event listing</h2>
      </header>
      <EventListing />
    </div>
  );
}

export default App;
