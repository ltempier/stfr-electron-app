import {
    SET_LANGUAGES,
    FIND_MOVIES_START,
    FIND_MOVIES_END,
    UPD_MOVIE,
    UPD_MOVIE_SUBTITLE
} from "../constants/actionTypes";

const rootReducer = (state, action) => {
    switch (action.type) {

        case FIND_MOVIES_START:
            return {
                ...state,
                findPath: action.findPath,
                movies: [],
                loadingMovies: true
            };

        case FIND_MOVIES_END:
            return {
                ...state,
                findPath: action.findPath,
                movies: action.movies,
                loadingMovies: false
            };


        case SET_LANGUAGES:
            return {
                ...state,
                languages: action.languages
            };


        case  UPD_MOVIE:

            return {
                ...state,
                movies: state.movies.map((movie) => {
                    if (movie.filepath !== action.moviePath)
                        return movie;

                    return {
                        ...movie,
                        ...action.payload
                    };
                })
            };

        case UPD_MOVIE_SUBTITLE:

            return {
                ...state,
                movies: state.movies.map((movie) => {
                    if (movie.filepath !== action.moviePath)
                        return movie;

                    movie.subtitles = movie.subtitles.map((subtitle) => {
                        if (subtitle.id !== action.subtitleId)
                            return subtitle;

                        return {
                            ...subtitle,
                            ...action.payload
                        };
                    });

                    return movie;
                })
            };

        default:
            return state;
    }
};

export default rootReducer;