import {combineReducers, createStore} from 'redux'
import userReducers from './reducers/userReducers'
import {composeWithDevTools} from 'redux-devtools-extension'


const rootReducers = combineReducers({
    userLogin: userReducers
})

const store = createStore(rootReducers, composeWithDevTools())

export default store