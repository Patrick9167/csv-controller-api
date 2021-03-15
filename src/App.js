import './App.css';
import CSVController from "./Components/CSVController";

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <p>
          CSV Uploader/Downloader
        </p>
        <p>Drag and drop a csv file to upload</p>
      </header>
      <CSVController />

    </div>
  );
}

export default App;
