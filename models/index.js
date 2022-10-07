const { Sequelize, DataTypes } = require('sequelize');

// sql server
const sequelize = new Sequelize('NodeDBnew', 'test1', '1234', {
	dialect: 'mssql',
	//host: "192.168.xx",
	dialectOptions: {
	  // Observe the need for this nested `options` field for MSSQL
	  options: {
		// Your tedious options here
		useUTC: false,
		dateFirst: 1,
	  },
	},
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.words = require('./news')(sequelize, Sequelize);
db.users = require('./user')(sequelize, Sequelize);
db.comments = require('./comment')(sequelize, Sequelize);

db.words.hasMany(db.comments, {foreignKey: 'idword'})
db.comments.belongsTo(db.words, {foreignKey: 'idword'})

db.comments.hasMany(db.comments, {foreignKey: 'replyid'}, {useJunctionTable: false})
//db.comments.belongsTo(db.comments, {foreignKey: 'replyid'})

module.exports = db;