const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

var userSchema = new Schema({
    "email": {
        "type":String,
        "unique":true
    },
    "password":String,
});

let User;

exports.initialize = () => {
    return new Promise((resolve,reject) => {
        let db = mongoose.createConnection("mongodb+srv://zijunli:lzj656893@senecaweb.s0q27vh.mongodb.net/web322_week8?retryWrites=true&w=majority", { useNewUrlParser: true });
        db.on('error', (err) => {
            reject(err);
        })
        db.once('open', () => {
            User = db.model("finalUsers",userSchema);
            resolve("connected to mongodb");
        })
    })
};

exports.registerUser = (userData) => {
    return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(userData.password, salt, function(err, hash) {
                    if (err) {
                        reject("error encrypting password");
                    }
                    else {
                        userData.password = hash;
                        let newUser = new User(userData);
                        newUser.save((err) => {
                            if (err) {
                                if (err.code === 11000) {
                                    reject("Error: email already exists" + err);
                                }
                                else {
                                    reject("Error: cannot create the user: " + err);
                                }
                            }
                            else {
                                resolve();
                            }
                        })
                    }
                })
            })
    })
};

exports.checkUser = (userData) => {
    return new Promise((resolve, reject) => {
        User.find({email: userData.email})
        .exec()
        .then(users => {
            bcrypt.compare(userData.password, users[0].password).then(res => {
                if(res === true) {}
                else {
                    reject("Incorrect Password for user: " + userData.email); 
                }
            })
        })
        .catch(() => { 
            reject("Cannot find the user: " + userData.email); 
        }) 
    })
};