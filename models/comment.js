module.exports = (sequelize, Sequelize) => {
	const Comment = sequelize.define("comment", {
		name: {
			type: Sequelize.STRING
		},
		comment: {
			type: Sequelize.TEXT
		},
        idword: {
			type: Sequelize.INTEGER
		},
		replyid: {
			type: Sequelize.INTEGER,
		},
		replystatus: {
			type: Sequelize.BOOLEAN  
		},
		showstatus: {
			type: Sequelize.BOOLEAN  
		}
	});
	return Comment;
};