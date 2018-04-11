module.exports = {
    handleError: (errMsg) => {
        console.log(errMsg);
        return { message: errMsg };
    },
    verifyToken: () => {
    }
};