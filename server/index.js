const searchHistorySchema = require('./db/schema')
const {connect, mongoose} = require("./db/index")
const {postSearchHistoryHandler, getRecommendationHandler} = require('./handlers')
const express = require("express")
const TEST_PORT = 81
const PORT = 80
const CORS_HEADER = "Access-Control-Allow-Origin"
const CORS_TARGET = "*"
const CONTENT_HEADER = "Access-Control-Allow-Headers"
const HEADER = "Content-Type, Authorization"
const app = express()

const SearchHistory = mongoose.model("SearchHistory", searchHistorySchema)

const RequestWrapper = (handler, SchemaAndDBForwarder) => {
    return (req, res) => {
        handler(req, res, SchemaAndDBForwarder)
    }
}

app.use(express.json());
app.use((req, res, next) => {
    res.header(CORS_HEADER, CORS_TARGET)
    res.header(CONTENT_HEADER, HEADER)
    next()
})

app.post("/", RequestWrapper(postSearchHistoryHandler, SearchHistory))
app.get("/", RequestWrapper(getRecommendationHandler, SearchHistory))

app.listen(PORT, () => {
    connect()
    mongoose.connection.on('error', console.error)
        .on('disconnected', connect)
        .once('open', () => {
            console.log(`server is running at port ${PORT}`)
        })
})
