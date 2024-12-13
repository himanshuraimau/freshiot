export class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    }
}

export const handleError = (err, res) => {
    const { statusCode = 500, message } = err;
    res.status(statusCode).json({
        success: false,
        status: err.status || 'error',
        message
    });
};
