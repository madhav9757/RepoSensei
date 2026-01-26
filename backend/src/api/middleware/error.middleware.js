import * as Sentry from "@sentry/node";

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        // Programming or other unknown error: don't leak error details
        console.error("ERROR 💥", err);

        res.status(500).json({
            status: "error",
            message: "Something went wrong!",
        });
    }
};

export const globalErrorHandler = (err, req, res, _next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    } else {
        // Log to Sentry in production
        if (process.env.SENTRY_DSN) {
            Sentry.captureException(err);
        }

        sendErrorProd(err, res);
    }
};
