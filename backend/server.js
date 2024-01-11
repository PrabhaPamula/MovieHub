import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import config from './config.js';
const salt = 10;

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "DELETE"],
    credentials: true
}));
app.use(cookieParser());

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "moviehub",
});

const verifyUser = (req,res,next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.json({Error: "You are not authenticated"});
    } else {
        jwt.verify(token, config.jwtSecretKey, (err,decoded) => {
            if(err) {
                return res.json({Error: "Token is not okay"});
            } else {
                // req.name = decoded.name;
                req.user = {
                    name: decoded.name,
                    userId: decoded.userId,
                };
                next();
            }
        })
    }
}

app.get("/watchlist", verifyUser, (req,res) => {
    const userId = req.user.userId;
    console.log(userId);
    const sql = "SELECT movieid FROM watchlist WHERE uid = ?";
    db.query(sql,[userId], (err,result) => {
        if(err) {
            console.error("Error executing SQL query:", err);
            return res.json({ Error: "Error fetching watchlist in server" });
        }
        console.log("Watchlist result:", result);
        const movieIds = result.map(entry => entry.movieid);
        console.log(movieIds);
        if(movieIds.length === 0) {
            return res.json({Status: "Success", Watchlist: []});
        }
        return res.json({Status:"Success", Watchlist: movieIds});
    })
})

app.post("/addToWatchlist", verifyUser, (req,res) => {
    const userName = req.user.name;
    const userId = req.user.userId;
    const movieId = req.body.id;
    const sqlCheck = "SELECT * FROM watchlist WHERE uid = ? AND movieid = ?";
    const sql = "INSERT INTO watchlist (uid,movieid) VALUES (?,?)";
    db.query(sqlCheck, [userId,movieId], (err,result) => {
        if(err) {
            return res.json({Error: "Error checking watchlist in server"});
        }
        if(result.length > 0) {
            return res.json({Error: "Duplicate entry - Movie already in watchlist"});
        }

        db.query(sql,[userId,movieId], (err,result) => {
            if(err) {
                return res.json({Error: "Error adding to watchlist in server"});
            }
            return res.json({Status:"Success"});
        })
    })

})

app.delete("/WatchlistMovieDelete", verifyUser, (req,res) => {
    const userId = req.user.userId;
    console.log(userId)
    const movieId = req.body.id;
    console.log(movieId);

    const sql = "DELETE FROM watchlist WHERE uid = ? AND movieid = ?";
    db.query(sql, [userId,movieId], (err,result) => {
        if(err) {
            return res.json({Error: "Error deleting movie from watchlist in server"});
        }
        return res.json({Status: "Success"});
    })
})

app.get("/", verifyUser, (req,res) => {
    return res.json({Status: "Success"});
})

app.post("/signup", (req, res) => {
    const { username, email, password } = req.body;
    const sqlCheck = "SELECT COUNT(*) AS count FROM users WHERE email = ?";
    const sql = "INSERT INTO users (username,email,password) VALUES (?,?,?)";

    db.query(sqlCheck, [email], (err, result) => {
        if(err) {
            return res.json({Error: "Error checking for duplicate entries"});
        }
        const count = result[0].count;
        if(count > 0) {
            return res.json({Error: "Email already exists"});
        }

        bcrypt.hash(password.toString(),salt,(err,hash) => {
            if(err) return res.json({Error: "Error for hashing password"});
            db.query(sql,[username,email,hash],(err,result) => {
                if(err) {
                    return res.json({Error:"Error inserting data"});
                }
                return res.json({Status:"Success"});
            })
        }) 
    })
     
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    console.log("email:", req.body.email);
    console.log("Password:", req.body.password);
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql,[email], (err,data) => {
        if(err) return res.json({Error: "Login error in serrver"});
        if(data.length > 0) {
            bcrypt.compare(password, data[0].password, (err,response) => {
                console.log("bcrypt.compare response:", response);
                if(err) return res.json({Error: "Password compare error"});
                if(response) {
                    const name = data[0].username;
                    const userId = data[0].id;
                    const token = jwt.sign({name, userId}, config.jwtSecretKey, {expiresIn: '1d'});
                    res.cookie("token", token);
                    return res.json({Status:"Success"});
                } else {
                    return res.json({Error:"Password not matched"});
                }
            })
        }
        else {
            return res.json({Error: "No user existed"});
        }
    })
});

app.get("/logout", (req,res) => {
    res.clearCookie("token");
    console.log("logout");
    return res.json({Status: "Success"});
})

app.listen(8001, () => {
    console.log("running backend server!!")
})