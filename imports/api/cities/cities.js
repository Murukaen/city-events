export const Cities = new Mongo.Collection('cities');

CitiesSchema = new SimpleSchema({
    country: {
        type: String,
        unique: true
    },
    cities: {
        type: [String]
    }
})

Cities.attachSchema(CitiesSchema)