const AsyncHandler = (reqFunc) => {
    return(
        async(req, res, next) => {
            try {
                await reqFunc(req, res, next)
            } catch (error) {
                console.log(error)
                res
                .status(error.code || 500)
                .json({
                    succes: false,
                    message : error.message
                })
            }
        }
    )
}

export default AsyncHandler;