module.exports = (sequelize, Sequelize) => {
	const Word = sequelize.define("word", {
		title: {
			type: Sequelize.TEXT
		},
		author: {
			type: Sequelize.STRING
		},
		image: {
			type: Sequelize.STRING
		},
        content: {
			type: Sequelize.TEXT
		}, 
	}, {
		paranoid: true,
		deleteAt: 'deletedAt'
	});
	return Word;
};