import STATUS_CODES from './statusCodes';

const defaultErrorMessage = 'Invalid Request!';
const defaultStatusCode = STATUS_CODES.BAD_REQUEST;

class ExceptionHandler {

    throwError(errorMessage = defaultErrorMessage, statusCode = defaultStatusCode) {
        const err = { message: errorMessage, statusCode };
        throw err;
    }

    handleDbError(error) {
        console.log("Db error occured: ", error)
        const err = { message: `${error.name || "MongoError"}: ${error.errmsg || "Validation failed"}`, statusCode: defaultStatusCode };
        throw err;
    }
}

export default new ExceptionHandler();
