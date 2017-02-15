Query = {
    'filter': function(route, name, value) {
        let query = Session.get('query');
        if (value || value === false) {
            query[name] = value;
        }
        else {
            delete query[name];
        }
        let queryParam = {query: $.param(query)};
        if (Object.keys(query).length == 0) {
            queryParam = {};    
        }
        Router.go(route, {}, queryParam);
    }
};
