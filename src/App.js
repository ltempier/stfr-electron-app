import React, {Component} from 'react';
import {connect} from "react-redux";

import InputFile from './components/InputFile';
import MovieRow from './components/MovieRow';
import InputLanguage from './components/InputLanguage';

import {findMovies, updLanguages, downloadAllSubtitles} from "./actions";
import store from "./store";


import 'flexboxgrid/dist/flexboxgrid.css';
import './App.css';

const mapStateToProps = state => {
    return {
        load: state.loadingMovies,
        movies: state.movies,
        languages: state.languages,
        findPath: state.findPath
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updFindPath: (path) => dispatch(findMovies(path)),
        updLanguages: (languages) => dispatch(updLanguages(languages)),
        downloadAll: () => dispatch(downloadAllSubtitles())
    };
};

class App extends Component {

    componentWillMount() {
        const path = store.getState().findPath;
        if (path && path.length)
            store.dispatch(findMovies(path));
    }

    render() {

        return (
            <div className="app">

                <div className="app-header">

                    <div className="app-title">Subtitles App</div>

                    <div className="app-form">
                        <InputFile path={this.props.findPath} onChange={this.props.updFindPath}/>
                        <InputLanguage value={this.props.languages} onChange={this.props.updLanguages}/>
                    </div>

                </div>

                <div className="app-content">

                    <div className="rows-container">

                        {
                            this.props.load ? <div className="message">searching movies ...</div> : ''
                        }

                        {
                            this.props.movies.map((movie, idx) => {
                                return <MovieRow key={idx} {...movie}/>
                            })
                        }
                    </div>
                </div>

                <div className="app-footer">
                    <div className="btn yellow" onClick={this.props.downloadAll}>Download</div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
