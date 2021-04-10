exports.SuccessResponse = class SuccessResponse{
    constructor(code,data,flag = true){
        this.code = code
        this.data = data
        this.flag = flag
    }
}