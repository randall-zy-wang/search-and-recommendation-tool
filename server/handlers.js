const postSearchHistoryHandler = async (req, res, SearchHistory) => {
    let newSearchData = req.body

    const query = new SearchHistory(newSearchData)
    query.save((err, response) => {
        if (err) {
            console.log(err)
            res.status(500).send("Error in saving data to DB")
            return
        } 
        res.status(201).send(response)
    })
}

const getRecommendationHandler = async (req, res, SearchHistory) => {
    let givenUserName = req.query.userName
    let givenQuery = req.query.query

    console.log(`User ${givenUserName} searched the query ${givenQuery}`)

    try {

        // get all docs that match the given query 
        let history = await SearchHistory.find({query: givenQuery}).exec()

        // get all users from history, except user U
        let usersWhoSearchedTheGivenQuery = history.map((doc) => {
            return doc.userName
        }).filter((name) => {
            return name != givenUserName
        })

        // get all queries search by users who searched the given query
        let allQueriesFromUsersWhoSearchedTheGivenQuery = await SearchHistory
            .find({userName: usersWhoSearchedTheGivenQuery})
            .exec()

        allQueriesFromUsersWhoSearchedTheGivenQuery = 
        allQueriesFromUsersWhoSearchedTheGivenQuery.filter((doc) => {
            return doc.query != givenQuery
        })

        // sort the query based on frequency
        const recommendedQueries = 
            sortRecommendationBasedOnFrequency(allQueriesFromUsersWhoSearchedTheGivenQuery)
        
        console.log(recommendedQueries)
        res.status(201).send(recommendedQueries)
    } catch (err) {
        console.log(err)
        res.status(500).send("error in fetching recommendation")
    }
}

function sortRecommendationBasedOnFrequency(queries) {
    const queryFrequencyMap = new Map();
    queries.forEach((doc) => {
        const query = doc.query
        if (queryFrequencyMap.has(query)) {
            let count = queryFrequencyMap.get(query)
            queryFrequencyMap.set(query, count + 1)
        } else {
            queryFrequencyMap.set(query, 1)
        }
    })

    // sort recommendation query based on occurance 
    let sortedRecomListBasedOnFrequency = [...queryFrequencyMap.entries()].sort((a, b) => {
        return b[1] - a[1]
    })

    let recommQueryList = sortedRecomListBasedOnFrequency.map((query) => {
        return query[0]
    })

    return recommQueryList
}

module.exports = {
    postSearchHistoryHandler,
    getRecommendationHandler
}