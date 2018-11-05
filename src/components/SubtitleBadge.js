import React, {Component} from 'react';
import {downloadSubtitle} from "../actions";
import connect from "react-redux/es/connect/connect";

import {green, yellow} from "../constants/colors";

import './SubtitleBadge.css';

const mapDispatchToProps = (dispatch, props) => {
    return {
        download: () => {
            dispatch(downloadSubtitle(props))
        }
    };
};


class SubtitleBadge extends Component {

    render() {
        const divStyle = {backgroundColor: this.props.exist ? green : yellow};
        return (
            <div className="sub-badge"
                 onClick={() => this.props.download()}
                 style={divStyle}>
                {this.props.langcode}
            </div>
        )
    }
}

SubtitleBadge.defaultProps = {
    langcode: "",
    url: "",
    filepath: "",
    exist: false
};

export default connect(null, mapDispatchToProps)(SubtitleBadge)
