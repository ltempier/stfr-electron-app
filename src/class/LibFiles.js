import async from 'async';
import axios from 'axios';


import Video from './Video';

const electron = window.require("electron");
const fs = electron.remote.require('fs');
const mime = window.require("mime");
const path = electron.remote.require('path');

let instance = null;

class LibFiles {

    constructor() {
        if (instance)
            return instance;
        instance = this;

        this.maxDeep = 3;
        this.timeout = 10 * 1000;

        return instance;
    }

    findMovies(filePath, callback, _deep, _start) {

        _deep = _deep || 0;
        _start = _start || Date.now();

        if (_deep > this.maxDeep) {
            return callback(null, []);
        }

        if ((Date.now() - _start) > this.timeout) {
            return callback(new Error('timeout'), []);
        }

        fs.stat(filePath, (err, stats) => {
            if (err)
                callback(err);

            else if (stats.isFile()) {
                const type = mime.getType(filePath);
                if (type && type.toString().startsWith('video/')) {

                    const video = new Video(filePath);
                    callback(null, [video])

                } else
                    callback(null, [])
            }
            else if (stats.isDirectory()) {

                const dirPath = filePath;
                fs.readdir(dirPath, (err, names) => {
                    if (err)
                        callback(err);
                    else {
                        let res = [];
                        async.eachLimit(names, 10, (name, next) => {
                            const filePath = path.join(dirPath, name);
                            this.findMovies(filePath, (err, movies) => {
                                if (err)
                                    next(err);
                                else {
                                    res = res.concat(movies);
                                    next()
                                }
                            }, _deep + 1, _start)
                        }, function (err) {
                            callback(err, res)
                        });
                    }
                })
            } else
                callback(null, [])
        });
    }


    static download(url, filepath, callback) {
        const response = axios({
            url: url,
            method: 'GET'
        });

        response.then((res) => {
            fs.writeFile(filepath, res.data, callback);
        }).catch(callback)
    }


    static formatPath(filepath, maxLength) {

        const fileSep = path.sep;
        const etc = '...';

        while (filepath.length > (maxLength || 70)) {
            filepath = filepath.split(fileSep);
            if (filepath.length <= 4) {
                filepath = filepath.join(fileSep);
                break
            }

            while (filepath.indexOf(etc) >= 0)
                filepath.splice(filepath.indexOf(etc), 1);
            filepath[Math.round(filepath.length / 2)] = etc;
            filepath = filepath.join(fileSep);
        }

        return filepath
    }
}


export default LibFiles
