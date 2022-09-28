import { 
    getUserData,
    updateUserData,
    getProfilePicture,
    uploadProfilePicture
} from 'services/axios/account';
import constants from '../constants';
import {
    handleHttpResponse,
    requestProcess,
    requestError
} from '../helper';

export const getUser = () => (dispatch) => {
    dispatch(requestProcess(constants.GET_USER_DATA));
    getUserData()
        .then((response) => handleHttpResponse(constants.GET_USER_DATA, response, dispatch, dispatchGetUserData))
        .catch((error) => dispatch(requestError(constants.GET_USER_DATA, error)));
};

export const updateUser = ({ id, email, fullname, username }) => (dispatch) => {
    dispatch(requestProcess(constants.UPDATE_USER_DATA));
    updateUserData({ id, email, fullname, username })
        .then((response) => handleHttpResponse(constants.UPDATE_USER_DATA, response, dispatch, dispatchGetUserData))
        .catch((error) => dispatch(requestError(constants.UPDATE_USER_DATA, error)));
};

export const getUserProfilePicture = () => (dispatch) => {
    dispatch(requestProcess(constants.GET_PROFILE_PICTURE));
    getProfilePicture()
        .then((response) => handleHttpResponse(constants.GET_PROFILE_PICTURE, response, dispatch, dispatchSetUploadProfilePicture))
        .catch((error) => dispatch(requestError(constants.GET_PROFILE_PICTURE, error)));
};

export const postProfilePicture = (profilePicture) => (dispatch) => {
    dispatch(requestProcess(constants.UPLOAD_PROFILE_PICTURE));
    uploadProfilePicture(profilePicture)
        .then((response) => handleHttpResponse(constants.UPLOAD_PROFILE_PICTURE, response, dispatch, dispatchSetUploadProfilePicture))
        .catch((error) => dispatch(requestError(constants.UPLOAD_PROFILE_PICTURE, error)));
};

const dispatchSetUploadProfilePicture = (profile_picture) => ({
    type: constants.SET_PROFILE_PICTURE,
    profile_picture,
});

const dispatchGetUserData = (user) => ({
    type: constants.SET_USER_DATA,
    user,
});