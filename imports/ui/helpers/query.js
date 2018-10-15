Query = {
    filter(route, name, value) {
        let query = Session.get('query')
        if (value || value === false) {
            query[name] = value
        } else {
            delete query[name]
        }
        if (name == 'country') {
            delete query['city']
        }
        queryUrl = ''
        if (Object.keys(query).length > 0) {
            queryUrl = '?' + $.param(query)
        }
        Router.go(route + queryUrl)
    }
};
