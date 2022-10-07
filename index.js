const { ApolloServer, gql } = require('apollo-server');
const jwt = require('jsonwebtoken');
const config = require('./config/confiq');
const db = require("./models");

db.sequelize.sync()
	.then(() => {
		console.log("sync db");
	})
	.catch((err) => {
		console.log("error: " + err.message);
	});

const User = db.users;


const {
	ApolloServerPluginLandingPageLocalDefault
} = require('apollo-server-core');

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.

const fs = require('fs');
const typeDefs = fs.readFileSync("./schema.graphql", "utf8").toString();
const resolvers = require('./resolvers/index')

const server = new ApolloServer({
	typeDefs,
	resolvers,
	csrfPrevention: true,
	cache: 'bounded',
	context: ({ req }) => {

		const token = req.headers.authorization || '';

		if(token){
			var payload = jwt.verify(token, config.secret)
			return User.findByPk(payload.userid)
					.then(data => {
						if(data){
							return {data};
						}else{
							return {};
						}						
					})
					.catch(err => {
						return {};
					});		
		}else{
			return {};
		}
	},	
	plugins: [
		ApolloServerPluginLandingPageLocalDefault({ embed: true }),
	],
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
	console.log(`🚀  Server ready at ${url}`);
});  