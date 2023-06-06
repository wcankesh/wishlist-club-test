import { legacy_createStore as createStore } from 'redux';
import rootreducer from './redux/reducer/rootReducer';



const store = createStore(rootreducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;