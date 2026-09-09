"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const errorHandler = (err, req, res, _next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    logger_1.logger.error({
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        statusCode,
    });
    // Don't leak error details in production
    const response = {
        success: false,
        error: {
            code: err.code || 'INTERNAL_ERROR',
            message: process.env.NODE_ENV === 'production' && statusCode === 500
                ? 'Internal Server Error'
                : message,
        },
    };
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }
    res.status(statusCode).json(response);
};
exports.errorHandler = errorHandler;
const createError = (message, statusCode = 500, code) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.code = code;
    error.isOperational = true;
    return error;
};
exports.createError = createError;
//# sourceMappingURL=errorHandler.js.map