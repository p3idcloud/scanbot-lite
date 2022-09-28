export const saveToLocal = (state) => {
    let stateCopy = { ...state };
    delete stateCopy.mobile;
    localStorage.setItem("settings", JSON.stringify(stateCopy));
};

export const handleHttpResponse = (request, responseData, dispatch, dispatchData = null, successCode = 200, params = []) => {
    if (responseData.status === successCode) {
        if (dispatchData) {
            dispatch(dispatchData(responseData.data, ...params));
        }
        dispatch(requestCompleted(request, responseData.meta));
    }
    else {
        dispatch(requestFailed(request, responseData));
    }
};

export const REQUEST_IDLE = 'REQUEST_IDLE';
export const REQUEST_PROCESS = 'REQUEST_PROCESS';
export const REQUEST_COMPLETED = 'REQUEST_COMPLETED';
export const REQUEST_FAILED = 'REQUEST_FAILED';
export const REQUEST_ERROR = 'REQUEST_ERROR';
export const REQUEST_UNAUTHORIZED = 'REQUEST_UNAUTHORIZED';

export const requestIdle = fetch => ({ type: REQUEST_IDLE, fetch });
export const requestProcess = fetch => ({ type: REQUEST_PROCESS, fetch });
export const requestCompleted = (fetch, meta) => ({
    type: REQUEST_COMPLETED,
    fetch,
    meta
});
export const requestFailed = (fetch, response) => ({ type: REQUEST_FAILED, fetch, response });
export const requestError = (fetch, error) => ({ type: REQUEST_ERROR, fetch, error });
export const requestUnauthorized = (fetch, error) => ({ type: REQUEST_UNAUTHORIZED, fetch, error });

export const requestObject = (state = {}, action) => {
    switch (action.type) {
        case REQUEST_COMPLETED:
            return {
                ...state,
                [action.fetch]: {
                    status: REQUEST_COMPLETED,
                    meta: action.meta
                }
            };

        case REQUEST_IDLE:
            return {
                ...state,
                [action.fetch]: { status: REQUEST_IDLE }
            };

        case REQUEST_PROCESS:
            return {
                ...state,
                [action.fetch]: { status: REQUEST_PROCESS }
            };

        case REQUEST_UNAUTHORIZED:
            return {
                ...state,
                [action.fetch]: {
                    status: REQUEST_UNAUTHORIZED,
                    error: action.error.response
                }
            };

        case REQUEST_FAILED:
            return {
                ...state,
                [action.fetch]: {
                    status: REQUEST_FAILED,
                    response: action.response
                }
            };

        case REQUEST_ERROR:
            return {
                ...state,
                [action.fetch]: {
                    status: REQUEST_ERROR,
                    error: action.error.response
                }
            };

        default:
            return state;
    }
};