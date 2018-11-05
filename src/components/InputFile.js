import React, {Component} from 'react';
import LibFiles from '../class/LibFiles';
import './InputFile.css';


const electron = window.require("electron");
const dialog = electron.remote.dialog;

class InputFile extends Component {

    constructor(props) {
        super(props);

        this.openDialog = this.openDialog.bind(this);
    }

    openDialog() {
        dialog.showOpenDialog(null, {
            properties: ['openDirectory', 'openFile'] // TODO multiSelections
        }, (filePaths) => {
            if (filePaths && filePaths.length)
                this.props.onChange(filePaths[0])
        })
    }

    render() {

        return (
            <div className="input-file-container">
                <label className="input-file-label">{this.props.label}</label>

                <div className="input-file" onClick={this.openDialog}>
                    <div className="input-file-path">{LibFiles.formatPath(this.props.path, 70)}</div>
                    <div className="btn green input-file-btn">Choose Movies</div>
                </div>

            </div>
        )
    }
}

InputFile.defaultProps = {
    path: '',
    label: 'Movies path',
    onChange: function (path) {
        console.log('new path', path)
    }
};

export default InputFile;
