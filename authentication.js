module.exports = function (req, res, next) {
    const token = req.cookies['token']

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

        return res.status(403).send('Error! Token is invalid.');
    }


    return res.send('auth')
}