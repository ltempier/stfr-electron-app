import libHash from './lib/hash';
import async from 'async';
import _ from 'lodash';
import axios from 'axios';

import * as STATE from "../constants/states"

const electron = window.require("electron");
const fs = electron.remote.require('fs');
const path = electron.remote.require('path');

export default class Video {

    constructor(filepath) {
        this.filepath = filepath;
        this.name = path.basename(filepath);

        this.hash = null;
        this.select = true;
        this.subtitles = [];

        this.state = STATE.loading
    }

    static fetchSubtitles(video, languages, callback) {
        async.auto({
            hash: (cb) => {
                if (video.hash)
                    cb(null, video.hash);
                else
                    libHash.computeHash(video.filepath, cb)
            },
            subtitles: ['hash', (results, cb) => {

                const url = 'http://51.15.143.226:2018/search';
                // const url = 'http://localhost:3333/search/test';

                axios.request({
                    method: 'get',
                    url,
                    params: {
                        languages: languages.split(',').join(''),
                        hash: results.hash,
                        query: Video.getQuery(video.name)
                    }
                }).then((response) => {
                    const subtitles = (response.data || []).map((subtitle) => Video.formatSubtitle(video, subtitle));
                    cb(null, subtitles)
                }).catch(cb)
            }]
        }, callback)
    }

    static mergeSubtitles(subtitles1, subtitles2, update) {
        let res = subtitles1;

        subtitles2.forEach((subtitle) => {
            const idx = _.findIndex(res, ['id', subtitle.id]);
            if (idx >= 0) {
                if (update === true)
                    res[idx] = {...res[idx], ...subtitle};
                else
                    res[idx] = {...subtitle, ...res[idx]}
            }
            else
                res.push(subtitle)
        });

        return res
    }


    static formatSubtitle(movie, subtitle) {
        const filepath = Video.getSubtitleFilepath(movie.filepath, subtitle.filename);
        return {
            ...subtitle,
            filepath,
            exist: fs.existsSync(filepath),
            moviePath: movie.filepath
        }
    }

    static getSubtitleFilepath(videoFilepath, subtitleFilename) {
        return path.resolve(videoFilepath, '..', subtitleFilename)
    }

    static getQuery(filename) {
        return path.parse(filename).name.replace(/\W+/g, " ")
    }
}

