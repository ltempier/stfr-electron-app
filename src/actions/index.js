import _ from 'lodash';
import async from 'async';

import LibFiles from '../class/LibFiles';
import Video from "../class/Video";
import * as STATE from '../constants/states'

import {
    FIND_MOVIES_END,
    FIND_MOVIES_START,
    SET_LANGUAGES,
    UPD_MOVIE,
    UPD_MOVIE_SUBTITLE
} from "../constants/actionTypes";


const startFindMovies = (findPath) => ({type: FIND_MOVIES_START, findPath});
const endFindMovies = (findPath, movies) => ({type: FIND_MOVIES_END, findPath, movies});

export const findMovies = (path) => {

    console.log('findMovies');

    return (dispatch, getState) => {

        return new Promise((resolve, reject) => {

            const oldMovies = getState().movies;
            path = path || getState().findPath;

            dispatch(startFindMovies(path));

            const libFiles = new LibFiles();
            libFiles.findMovies(path, (err, movies) => {
                if (err && err.message !== 'timeout') {
                    console.log('TODO process error', err);
                    movies = [];
                    reject(err.message)
                }

                movies = movies.map(function (movie) {
                    const idx = _.findIndex(oldMovies, {filepath: movie.filepath});
                    if (idx >= 0) {
                        movie = {
                            ...movie,
                            select: oldMovies[idx].select
                        };
                    }
                    return movie
                });

                dispatch(endFindMovies(path, movies));

                dispatch(processMovies());

                resolve(movies)
            });
        });


    };
};


const setLanguages = (languages) => ({type: SET_LANGUAGES, languages});

export const updLanguages = (languages) => {
    return (dispatch, getState) => {
        dispatch(setLanguages(languages));
        dispatch(processMovies());
    }
};

export const updMovie = (moviePath, obj) => ({type: UPD_MOVIE, moviePath, payload: obj});

export const processMovies = () => {

    console.log('processMovies');

    return (dispatch, getState) => {

        const movies = getState().movies;
        const languages = getState().languages;

        async.eachLimit(movies, 20, function (movie, next) {

            dispatch(updMovie(movie.filepath, {
                subtitles: [],
                state: STATE.loading
            }));

            Video.fetchSubtitles(movie, languages, function (err, res) {

                if (err) {
                    console.log(err)

                } else {
                    const subtitles = Video.mergeSubtitles(movie.subtitles, res.subtitles, true);
                    dispatch(updMovie(movie.filepath, {
                        hash: res.hash,
                        subtitles,
                        state: STATE.ready
                    }))
                }

                next()
            })
        }, function (err) {

        })
    }
};


export const updMovieSubtitle = (subtitle, obj) => ({
    type: UPD_MOVIE_SUBTITLE,
    moviePath: subtitle.moviePath,
    subtitleId: subtitle.id,
    payload: obj
});

export const downloadSubtitle = (subtitle) => {
    return (dispatch, getState) => {

        dispatch(updMovieSubtitle(subtitle, {
            state: STATE.loading
        }));


        LibFiles.download(subtitle.url, subtitle.filepath, (err) => {
            if (err)
                dispatch(updMovieSubtitle(subtitle, {
                    exist: false,
                    state: STATE.error
                }));
            else
                dispatch(updMovieSubtitle(subtitle, {
                    exist: true,
                    state: STATE.done
                }))
        })
    }
};

export const downloadAllSubtitles = () => {
    return (dispatch, getState) => {
        const movies = getState().movies;
        async.eachLimit(movies, 20, (movie, next) => {

            if (!movie.select)
                return next();

            async.eachSeries(movie.subtitles, (subtitle, cb) => {
                LibFiles.download(subtitle.url, subtitle.filepath, (err) => {
                    if (err)
                        dispatch(updMovieSubtitle(subtitle, {exist: false, error: err}));
                    else
                        dispatch(updMovieSubtitle(subtitle, {exist: true}));
                    cb()
                })
            }, next)
        }, (err) => {

        })
    }
};