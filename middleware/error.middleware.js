const errorMiddleware = (err, req, res, next) => {
    try{
        let error = {...err};
        error.message = err.message;

        console.log(err);
        
        // mongoose bad object id
        if(err.name == 'castError'){
            const message = `Resource not found. Invalid: ${err.path}`;
            error = new Error(message,);
            error.statusCode = 404;
        }

        // mongoose duplicate key
        if(err.code == 11000){
            const message = `Duplicate field value entered`;
            error = new Error(message);
            error.statusCode = 400;
        }

        // mongoose validation error
        if(err.name == 'validationError'){
            const message = Object.values(err.errors).map(val => val.message);
            error = new Error(message);
            error.statusCode = 400;
        }

        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || 'Server Error'
        });

    }catch(err){
        next(err);
    }
}

export default errorMiddleware;