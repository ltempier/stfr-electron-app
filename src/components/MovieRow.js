import React, {Component} from 'react';
import {connect} from "react-redux";
import Ionicon from 'react-ionicons'

import LibFiles from '../class/LibFiles';
import * as STATE from '../constants/states';
import Checkbox from './Checkbox';
import SubtitleBadge from './SubtitleBadge';
import {updMovie, downloadSubtitle} from "../actions";
import './MovieRow.css';

const mapDispatchToProps = (dispatch, props) => {

    return {
        upd: (obj) => dispatch(updMovie(props.filepath, obj)),
        download: (subtitle) => {
            dispatch(downloadSubtitle(props, subtitle))
        }
    };
};

class MovieRow extends Component {

    render() {

        const select = this.props.select;
        let subtitles = this.props.subtitles;

        let iconDiv = '';
        if (this.props.state === STATE.loading)
            iconDiv = <Ionicon icon={"ios-sync"} rotate/>

        return (
            <div className={["row", "movie-row", (select ? "" : "disabled")].join(" ")}>

                <div className="col-xs-1 movie-checkbox">
                    <Checkbox value={select} onChange={(select) => (this.props.upd({select}))}/>
                </div>

                <div className="col-xs-8 movie-name">
                    <div className="name">{this.props.name}</div>
                    <div className="path">{LibFiles.formatPath(this.props.filepath, 80)}</div>
                </div>

                <div className="col-xs movie-status">

                    <div className="row center-xs">
                        {
                            subtitles.map((subtitle, idx) => {
                                return (
                                    <div className="col-xs" key={idx}>
                                        <SubtitleBadge {...subtitle}/>
                                    </div>


                                )
                            })
                        }
                        {iconDiv}
                    </div>

                </div>

            </div>
        )
    }
}

export default connect(null, mapDispatchToProps)(MovieRow)

