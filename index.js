// Importing modules
const express = require("express");
const cors = require('cors');
const fileUpload = require('express-fileupload');
const output = require('./test')



const cookieParser = require('cookie-parser');

const jwt = require("jsonwebtoken");

const app = express();
const authentication = require('./authentication')

app.use(express.json());
app.use(cookieParser());
app.set("trust-proxy",1)
// app.use(authentication)//(req, res, next) => authentication(req, res, next));
// app.use(authentication)
app.use(fileUpload())
app.set('view engine', 'pug')


// app.use(()=>{
//     //this fuction will 
// })

app.use('/uploads', express.static('uploads'))


// app.configure(function(){
//     app.use('/uploads', express.static(__dirname + '/uploads'));
//     app.use(express.static(__dirname + '/public'));
//   });

// var corsOptions = {
//     origin: 'http://127.0.0.1:3000/',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }



app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

// app.use(function (req, res, next) {
//     // check if client sent cookie
//     var cookie = req.cookies.cookieName;
//     if (cookie === undefined) {
//         // no: set a new cookie
//         var randomNumber = Math.random().toString();
//         randomNumber = randomNumber.substring(2, randomNumber.length);
//         res.cookie('cookieName', randomNumber, { maxAge: 900000, httpOnly: true });
//         console.log('cookie created successfully');
//     } else {
//         // yes, cookie was already present 
//         console.log('cookie exists', cookie);
//     }
//     next(); // <-- important!
// });

// const secreteKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTU0OWIwMTIwMWUyZjMzZWE3NmFkZjYiLCJlbWFpbCI6InNtdHdpbmtsZTQ1MkBnbWFpbC5jb20iLCJpYXQiOjE2MzI5MzQ2NTgsImV4cCI6MTYzMjkzODI1OH0._oHr3REme2pjDDdRliArAeVG_HuimbdM5suTw8HI7uc'
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhYmNAYWJjLmNvbSIsImVtYWlsIjoiYWJjQGFiYy5jb20iLCJpYXQiOjE2NTY1MjQwMjAsImV4cCI6MTY1NjUyNzYyMH0.S3XpH64iT1-t90yQhvCHy0SEdmfPFFKJkz4r6AtzdYU'
const secreteKey = 'ajsdkfjklsadjfkljasdkljfkljsadkfjklasdjfkljsadk'


// Handling post request


app.post('/upload', function (req, res) {
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.sampleFile;
    uploadPath = './uploads/' + sampleFile.name;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function (err) {
        if (err)
            return res.status(500).send(err);

        res.json({
            success: true,
            fileUrl: '/uploads/' + sampleFile.name,
            message: 'File uploaded!'
        });
    });
});



app.post("/login", async (req, res, next) => {
    let { email, password } = req.body;
    try {
        //Creating jwt token
        token = jwt.sign(
            { userId: email, email: email },
            secreteKey,
            { expiresIn: "1h" }
        );
    } catch (err) {
        console.log(err);
        const error = new Error("Error! Something went wrong.");
        return next(error);
    }

    return res
        .status(200)
        .json({
            success: true,
            data: {
                userId: email,
                email: email,
                token: token,
            },
        });
});


app.get('/accessResource1', (req, res) => {
    res.send('heey')
})
app.get('/accessResource', authentication, (req, res) => {
    //const token = req.headers.authorization.split(' ')[1];

    // return res.redirect('login')
    return res.render('index', {
        title: 'first pug',
        message: 'hi there!'
    })
    return res.send(output)

    console.log(req.cookies['token'])
    const token = req.cookies['token']
    //Authorization: 'Bearer TOKEN'
    if (!token) {
        return res.status(403).json({ success: false, message: "Error! Token was not provided." });
    }
    //Decoding the token
    try {
        console.log('inside try')
        const decodedToken = jwt.verify(token, secreteKey); // {userId,email}            
        return res.status(200).json(
            {
                success: true,
                data: {
                    userId: decodedToken.userId,
                    email: decodedToken.email
                }
            });
    } catch (error) {
        console.log('inside catch')

        return res.status(403).send('Error! Token was not provided.');
    }

});



app.get('/users', (req, res) => {
    // const token = req.headers.authorization.split(' ')[1];
    const token = req.headers.token;
    //Authorization: 'Bearer TOKEN'
    if (!token) {
        res.status(200).json({ success: false, message: "Error! Token was not provided." });
    }
    //Decoding the token
    const decodedToken = jwt.verify(token, secreteKey); // {userId,email}
    return res.status(200).json(
        {
            success: true,
            data: {
                userId: decodedToken.userId,
                email: decodedToken.email
            }
        });


    //create post
});

// middleware

app.get('/users', (req, res) => {
    // const token = req.headers.authorization.split(' ')[1];
    const token = req.cookies.token || req.headers.token;
    //Authorization: 'Bearer TOKEN'
    if (!token) {
        res.status(200).json({ success: false, message: "Error! Token was not provided." });
    }
    //Decoding the token
    const decodedToken = jwt.verify(token, secreteKey); // {userId,email}
    return res.status(200).json(
        {
            success: true,
            data: {
                userId: decodedToken.userId,
                email: decodedToken.email
            }
        });
});


app._router.stack.forEach(function (r) {
    if (r.route && r.route.path) {
        console.log(r.route.path)
    }
})

app.listen(process.env.PORT, () => {
    console.log("Server is listening on port "+process.env.PORT);
});

