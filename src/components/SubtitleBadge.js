import React, {Component} from 'react';
import {downloadSubtitle} from "../actions";
import connect from "react-redux/es/connect/connect";

import {green, yellow} from "../constants/colors";
import {loading} from "../constants/states";

import './SubtitleBadge.css';

const mapDispatchToProps = (dispatch, props) => {
    return {
        download: () => {
            if (props.state === loading)
                return;
            dispatch(downloadSubtitle(props))
        }
    };
};


class SubtitleBadge extends Component {

    render() {
        const divStyle = {backgroundColor: this.props.exist ? green : yellow};
        return (
            <div>
                <div className={["sub-badge", this.props.state === loading ? "loading" : ""].join(" ")}
                     onClick={() => this.props.download()}
                     style={divStyle}>
                    {this.props.langcode}
                </div>

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
