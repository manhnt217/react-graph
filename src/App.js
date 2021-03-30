import { Graph } from './graph/graph'
import { Rect } from './graph/rect'
import './App.css'

const App = () => (
    <div className="app">
        <Graph size="100%">
            <Rect x="10" y="10" width="20" height="10" color="red" />
            <Rect x="10" y="90" width="10" height="10" color="wheat" />
            <line x1="5" y1="5" x2="120" y2="120" stroke="#529fca" />
        </Graph>
    </div>
);

export default App;
