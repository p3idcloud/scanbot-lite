import { combineReducers } from 'redux';
import { requestObject } from '../helper';
import constants from '../constants';

const user = (state = {}, action) => {
    switch (action.type) {
        case constants.SET_USER_DATA:
            return {
                ...state,
                ...action.user,
            };
    }
    return state;
};

const profilePicture = (state = '', action) => {
    switch (action.type) {
        case constants.SET_PROFILE_PICTURE:
            return action.profile_picture.url;
    }
    return state;
};

const usersReducer = combineReducers({
    request: requestObject,
    user,
    profilePicture,
});

export default usersReducer;