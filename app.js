const express = require("express");
const app = express();
const ejs = require("ejs");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();
app.set('views engine', 'ejs');
app.set(express.static(path.join(__dirname, './views')));
app.use(express.static(path.join(__dirname, './public')));

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("./Routes/useRouter"));


app.listen(process.env.PORT || 4000, () => {
    console.log(`server is ruining ${process.env.PORT}`);
});