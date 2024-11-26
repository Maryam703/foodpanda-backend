class ApiFeature {
    constructor(query, queryStr){
        this.query = query,
        this.queryStr = queryStr
    }

    search(){
        const keyword = this.queryStr.keyword ? {
            name : {
                $regex : this.queryStr.keyword, //for regular expression
                $options : "i" //case insensitive
            }
        } : {}


        this.query = this.query.find({...keyword}) //exchange query
        return this;
    }
}

export default ApiFeature;