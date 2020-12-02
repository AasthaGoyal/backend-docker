var express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const config = require("./config.js");
const mongoose = require("mongoose");

const userRouter = require("./routes/users");

var app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "client/build")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());

const url = config.mongoURI;
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//connect to the database
try {
  const db = mongoose.connection;
  console.log(db);
  db.on("error", console.error.bind(console, "connection error"));

  db.once("open", function () {
    console.log("we are connected");
  });
} catch (error) {
  console.log("some error", error);
}

// corsOptions = {
//   origin: "http://127.0.0.1/3000",
//   optionSuccessStatus: 200
// };
// const storage = new GridFsStorage({
// 	url: config.mongoURI,
// 	file: (req, file) => {
// 		return new Promise((resolve, reject) => {
// 			crypto.randomBytes(16, (err, buf) => {
// 				if (err) {
// 					return reject(err);
// 				}
// 				const filename = buf.toString("hex") + path.extname(file.originalname);
// 				const fileinfo = {
// 					filename: filename,
// 					bucketName: "uploads",
// 				};
// 				resolve(fileinfo);
// 			});
// 		});
// 	},
// });

// const upload = multer({ storage });

app.use("/public", express.static("public"));

app.use("/users", userRouter);
//app.use("/items", itemRouter(upload));

//app.use(cors(corsOptions));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// const url = config.mongoURI;
// const connect = mongoose.connect(url, {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true,
// });

// // connect to the database
// connect.then(
// 	() => {
// 		console.log("Connected to database");
// 	},
// 	(err) => console.log(err)
// );

// Error handling
app.use(function (req, res, next) {
  // catch 404 and forward to error handler
  next(createError(404));
});
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
