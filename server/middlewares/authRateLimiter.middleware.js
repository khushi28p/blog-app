import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
    windowMs: 15*60*1000,
    max: 10,
    message: {
        message:"Too many attempts from this IP, please try again after 15 minutes."
    },
    statusCode: 429,
    headers: true
});

export const apiLimiter = rateLimit({
    windowMs: 60*60*1000,
    max: 1000,
    message: {
        message: "Too many requests from this IP, please try again after an hour."
    },
  statusCode: 429,
  headers: true,
})