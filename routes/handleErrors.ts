import {Request, Response, NextFunction} from 'express';

// Define a type for route handlers
type RouteHandler = (req: Request, res: Response) => Promise<void>;

// This function is used to wrap route handlers in a try/catch block in order to catch any errors that may be thrown from the route handler.
export const handleErrors = (routeHandler: RouteHandler) => {

    return async (req: Request, res: Response, next: NextFunction) => {
        try {

            // Call the route handler
            await routeHandler(req, res);

        } catch (err) {

            // If the route handler throws an error, it will be caught here and passed to the next() function.
            next(err);
        }
    };
};