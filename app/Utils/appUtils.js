module.exports = {
    handleError: (errMsg) => {
        console.log(errMsg);
        return { IsError: true, Msg: errMsg };
    }
};