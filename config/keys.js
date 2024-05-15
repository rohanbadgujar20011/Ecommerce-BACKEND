module.exports = {
    port: process.env.PORT || 5000,
    database: {
        url: process.env.MONGO_URI
    },
    app: {
        apiURL: `${process.env.BASE_API_URL}`,
        clientURL: process.env.CLIENT_URL
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        tokenLife: '7d'
    },
    
}