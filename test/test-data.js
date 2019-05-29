/**
 * These objects are used in tests.
 */
module.exports = {
    fetchTest: {
        successResponse: { 
            Errors: [], 
            success: true, 
            stringVal: 'ok'
        },
        errorResponse: {
            body: {
                Errors: [
                    { Title: 'Authentication failed.', HappenedAt: "2019-01-19T18:46:51.0808761Z" } 
                ]
            },
            status: 400
        },
        internalErrorResponse: {
            body: { Message: 'An error has occurred.' },
            status: 500
        },
        notJsonResponse: '<html></html>',
        networkErrorResponse: {
            throws: 'Failed to fetch data'
        }
    }
};
