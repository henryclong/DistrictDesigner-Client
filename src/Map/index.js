import DisplayModal from './DisplayModal';
import React, { Component } from 'react';
import ToolModal from './ToolModal';

class Map extends Component {
    render() {
        return (
            <div>
                <h1>Map Component</h1>
                <DisplayModal />
                <ToolModal />
            </div>
        );
    }
}

export default Map;
