var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/confiq');
const db = require('../models');
const Comment = db.comments;
const Word = db.words;
const User = db.users;

const resolvers = {
    Query: {
        words: () => {
            return Word.findAll()
                .then(data => {
                    return data;
                })
                .catch(err => {
                    return err;
                });
        },
        users: (parent, args, context) => {
            if (!context.data)
                return [];
            else
                return User.findAll()
                    .then(data => {
                        return data;
                    })
                    .catch(err => {
                        return err;
                    });
        },
        comments: () => {
            return Comment.findAll()
                .then(data => {
                    return data;
                })
                .catch(err => {
                    return err;
                });
        },

    },

    Mutation: {
        register: (parent, { name, email, username, password }) => {
            var hashpass = bcrypt.hashSync(password, 8);
            var user = {
                name: name,
                email: email,
                username: username,
                password: hashpass
            }
            return User.create(user)
                .then(data => {
                    return data;
                })
                .catch(err => {
                    return {};
                });
        },
        login: (parent, { username, password }) => {

            return User.findOne({ where: { username: username } })
                .then(data => {
                    if (data) {
                        var loginValid = bcrypt.compareSync(password, data.password);
                        if (loginValid) {

                            var payload = {
                                userid: data.id,
                                username: username
                            };
                            let token = jwt.sign(
                                payload,
                                config.secret, {
                                expiresIn: '3h'
                            }
                            );
                            let dt = new Date(); // now
                            dt.setHours(dt.getHours() + 3); // now + 3h

                            return {
                                success: true,
                                token: token,
                                expired: dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString()
                            };
                        } else {
                            return {};
                        }
                    } else {
                        return {};
                    }
                })
                .catch(err => {
                    return {};
                });
        },
        addNews: (parent, { title, author, image, content }, context) => {
            if (!context.data)
                return [];
            else {
                var news = {
                    title: title,
                    author: author,
                    image: image,
                    content: content
                }
                return Word.create(news)
                    .then(data => {
                        return data;
                    })
                    .catch(err => {
                        return {};
                    });
            }
        },
        detailNews: (parent, { id }) => {
            var id = id;
            return Word.findOne({
                //include: [Comment],
                include: [{
                    model: Comment,
                    include: [{
                        model: Comment,
                        include: [{
                            model: Comment,
                            include: [{
                                model: Comment,
                                include: [{
                                    model: Comment,
                                    include: [Comment]
                                }]
                            }]
                        }]
                    }]
                }],
                where: { id: id }
            })
                .then(data => {
                    if (data) {
                        return data;
                    } else {
                        return {};
                    }
                })
                .catch(err => {
                    return {};
                });
        },
        updateNews: (parent, { id, title, author, image, content }, context) => {
            if (!context.data)
                return [];
            else {
                var id = id;
                var news = {
                    title: title,
                    author: author,
                    image: image,
                    content: content
                }

                return Word.update(news, {
                    where: { id: id }
                })
                    .then(data => {
                        return data;
                    })
                    .catch(err => {
                        return {};
                    });
            }

        },
        deleteNews: (parent, { id }, context) => {
            if (!context.data)
                return [];
            else {
                var id = id;
                return Word.destroy({
                    where: { id: id }
                })
                    .then(data => {
                        return data;
                    })
                    .catch(err => {
                        return {};
                    });
            }
        },
        restoreNews: (parent, { id }, context) => {
            if (!context.data)
                return [];
            else {
                var id = id;
                return Word.restore({
                    where: { id: id }
                })
                    .then(data => {
                        return data;
                    })
                    .catch(err => {
                        return {};
                    });
            }
        },
        addComment: (parent, { name, comment, idword, replyid }) => {
            var comment = {
                name: name,
                comment: comment,
                idword: idword,
                replyid: replyid,
                replystatus: 1,
                showstatus: 1
            }
            return Comment.create(comment)
                .then(data => {
                    return data;
                })
                .catch(err => {
                    return {};
                });
        },

    }
};

module.exports = resolvers;