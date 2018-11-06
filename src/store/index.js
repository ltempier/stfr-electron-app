import {compose, createStore, applyMiddleware} from "redux";
import rootReducer from "../reducers/index";

import thunk from 'redux-thunk';
import persistState from 'redux-localstorage'

const middleware = compose(
    applyMiddleware(thunk),
    persistState()
);


const store = createStore(
    rootReducer,
    {
        movies: [],
        languages: [],
        findPath: '',
    },
    middleware
);


export default store;