const mongoose = require("mongoose");
const url = process.env.DB_URL;


const Main = async () => {
    try {
        await mongoose.connect(url);
        console.log('database is connected');
    } catch (error) {
        console.log('There is one Error in Mongodb : Main() ');
    }
}
Main();

const UserShema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, ' Please Fill Name 👀 '],
    },
    email: {
        type: String,
        required: [true, ' Please Fill Email 😒 '],
    },
    password: {
        type: String,
        required: [true, ' Please Fill Password ✔ '],
    },
    token: String
});


const UserModel = mongoose.model('users', UserShema);

module.exports = UserModel;