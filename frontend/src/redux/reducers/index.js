import { combineReducers } from 'redux';

import users from './accountsReducer';
import scanner from './scannerReducer';

const rootReducer = combineReducers({
    users,
    scanner,
});

export default rootReducer;