exports.ErrorResponse = class ErrorResponse{
    constructor(code,data,flag = false){
        this.code = code
        this.data = data
        this.flag = flag
    }
}