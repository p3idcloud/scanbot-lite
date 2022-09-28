import { combineReducers } from 'redux';
import { requestObject } from '../helper';
import constants from '../constants';

const scannerSettings = (state = {}, action) => {
    switch (action.type) {
        case constants.SET_SCANNER_SETTING:
            return {
                ...state,
                ...action.scannerSettings,
            };
    }
    return state;
};

const profileDefinitions = (state = {}, action) => {
    switch (action.type) {
        case constants.SET_PROFILE_DEFINITION:
            return {
                ...state,
                ...action.profileDefinition,
                activity: false,
            };

        case constants.SET_CREATE_PROFILE_DEFINITION:
            return {
                ...state,
                ...action.profileDefinition,
                activity: 'create',
            };

        case constants.SET_UPDATE_PROFILE_DEFINITION:
            return {
                ...state,
                ...action.profileDefinition,
                activity: 'update',
            };

        case constants.SET_DELETE_PROFILE_DEFINITION:
            return {
                ...state,
                ...action.profileDefinition,
                activity: 'delete',
            };
    }
    return state;
};


const scannerReducer = combineReducers({
    request: requestObject,
    scannerSettings,
    profileDefinitions,
});

export default scannerReducer;