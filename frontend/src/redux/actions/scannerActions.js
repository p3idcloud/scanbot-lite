import {
    getProfileDefinition,
    getScannerSettings,
    updateProfileDefinition,
    createProfileDefinition,
    removeProfileDefinition
} from 'services/axios/scanner';
import constants from '../constants';
import {
    handleHttpResponse,
    requestProcess,
    requestError
} from '../helper';

export const getUserProfileDefinition = () => (dispatch) => {
    dispatch(requestProcess(constants.GET_PROFILE_DEFINITION));
    getProfileDefinition()
        .then((response) => handleHttpResponse(constants.GET_PROFILE_DEFINITION, response, dispatch, dispatchGetUserProfileDefinition))
        .catch((error) => dispatch(requestError(constants.GET_PROFILE_DEFINITION, error)));
};

export const getAllScannerSettings = () => (dispatch) => {
    dispatch(requestProcess(constants.GET_SCANNER_SETTING));
    getScannerSettings()
        .then((response) => handleHttpResponse(constants.GET_SCANNER_SETTING, response, dispatch, dispatchGetAllScannerSettings))
        .catch((error) => dispatch(requestError(constants.GET_SCANNER_SETTING, error)));
};

export const updateDefinition = (data) => (dispatch) => {
    dispatch(requestProcess(constants.UPDATE_PROFILE_DEFINITION));
    updateProfileDefinition(data)
        .then((response) => handleHttpResponse(constants.UPDATE_PROFILE_DEFINITION, response, dispatch, dispatchUpdateDefinition))
        .catch((error) => dispatch(requestError(constants.UPDATE_PROFILE_DEFINITION, error)));
};

export const createDefinition = (data) => (dispatch) => {
    dispatch(requestProcess(constants.CREATE_PROFILE_DEFINITION));
    createProfileDefinition(data)
        .then((response) => handleHttpResponse(constants.CREATE_PROFILE_DEFINITION, response, dispatch, dispatchCreateDefinition))
        .catch((error) => dispatch(requestError(constants.CREATE_PROFILE_DEFINITION, error)));
};

export const removeDefinition = (data) => (dispatch) => {
    dispatch(requestProcess(constants.DELETE_PROFILE_DEFINITION));
    removeProfileDefinition(data)
        .then((response) => handleHttpResponse(constants.DELETE_PROFILE_DEFINITION, response, dispatch, dispatchRemoveDefinition))
        .catch((error) => dispatch(requestError(constants.DELETE_PROFILE_DEFINITION, error)));
};

const dispatchCreateDefinition = (profileDefinition) => ({
    type: constants.SET_CREATE_PROFILE_DEFINITION,
    profileDefinition,
});

const dispatchUpdateDefinition = (profileDefinition) => ({
    type: constants.SET_UPDATE_PROFILE_DEFINITION,
    profileDefinition,
});

const dispatchRemoveDefinition = (profileDefinition) => ({
    type: constants.SET_DELETE_PROFILE_DEFINITION,
    profileDefinition,
});

const dispatchGetUserProfileDefinition = (profileDefinition) => ({
    type: constants.SET_PROFILE_DEFINITION,
    profileDefinition,
});

const dispatchGetAllScannerSettings = (scannerSettings) => ({
    type: constants.SET_SCANNER_SETTING,
    scannerSettings,
});