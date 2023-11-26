const Schema = require('mongoose').Schema;
var ObjectId = Schema.Types.ObjectId;

const searchHistorySchema = new Schema ({
    userName : {type: String, required: true},
    query : {type: String, required: true}
})

module.exports = searchHistorySchema;