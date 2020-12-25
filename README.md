# JWT-example

This repository is the Example Project of JWT authentication implementation in NodeJs.


### Dependencies:

This project works on following `npm` packages:
* [`express`](https://www.npmjs.com/package/express) : NodeJs Server Framework
* [`bcrypt`](https://www.npmjs.com/package/bcrypt) : For Hashing Passwords
* [`jsonwebtoken`](https://www.npmjs.com/package/jsonwebtoken) : For generating Access and Refresh Tokens

### Run On Local:
1. Please star and fork the repo

![](./asset/fork.png)

2. Then clone the repo in the local environment using the following command in the Terminal:
```sh
git clone https://github.com/prashant1k99/JWT-example.git
```

3. Install the dependencies with the following command:
```sh
npm install
```

4. Run the Server:
```
npm run start
```

### File Structure:
* [index.js](https://github.com/prashant1k99/JWT-example/blob/main/index.js) : This file is used to setup the basic express server.
* [data](https://github.com/prashant1k99/JWT-example/tree/main/data)
  - [`index.js`](https://github.com/prashant1k99/JWT-example/blob/main/data/index.js)
  - [`posts.js`](https://github.com/prashant1k99/JWT-example/blob/main/data/posts.js) : For storing post data
  - [`refreshTokens.js`](https://github.com/prashant1k99/JWT-example/blob/main/data/refreshTokens.js) : For Storing refresh tokens
  - [`users.js`](https://github.com/prashant1k99/JWT-example/blob/main/data/users.js) : For Storing user information
* [helpers](https://github.com/prashant1k99/JWT-example/tree/main/helpers)
  - [`index.js`](https://github.com/prashant1k99/JWT-example/blob/main/helpers/index.js)
  - [`jwt.js`](https://github.com/prashant1k99/JWT-example/blob/main/helpers/jwt.js) : This file holds all the token methods
    * `generateAccessToken` : This function is called to generate the Access Token
    * `generateRefreshToken` : This function is called to generate the Refresh Token
    * `verifyRefreshToken` : This function is called to check the Refresh Token is valid or not
* [middleware](https://github.com/prashant1k99/JWT-example/tree/main/middleware)
  - [`index.js`](https://github.com/prashant1k99/JWT-example/blob/main/middleware/index.js)
  - [`validateToken.js`](https://github.com/prashant1k99/JWT-example/blob/main/middleware/validateToken.js) : This file contains the middleware to authenticate the request by checking the token attached in the header of the Request
* [routes](https://github.com/prashant1k99/JWT-example/tree/main/routes)
  - [`index.js`](https://github.com/prashant1k99/JWT-example/blob/main/routes/index.js)
  - [`auth`](https://github.com/prashant1k99/JWT-example/tree/main/routes/auth) : This is the Auth Module
    - [`index.js`](https://github.com/prashant1k99/JWT-example/tree/main/routes/auth/index.js) : This file contains all the routes for the Authentication:
      - GET `/auth/users` : This route send all the list of the users which are registered on the application
      - POST `/auth/signup` : This route is used to register a user in application by sending `name`, `email` and `password` in the json body.
      - POST `/auth/token` : This route is used to generate access token from the refresh token. User needs to send the refresh token in the json body with key as `token`.
      - POST `/auth/login` : This route is used to authenticate user. User needs to send the `email` and `password` in the json body and will get the `accessToken` and `refreshToken` as the response.
      - DELETE `/auth/logout` : This route is for removing the RefreshToken from the application storage, so that no more refreshTokens can be generated.
  - [`posts`](https://github.com/prashant1k99/JWT-example/tree/main/routes/posts) : This is the Post Module
    - [`index.js`](https://github.com/prashant1k99/JWT-example/tree/main/routes/posts/index.js) : This file contains all the routes required for accessing user specific posts.
      - GET `/posts/` : *This is an authenticated route.* This route will send all the posts of the authenticated user.
      - POST `/posts/` : *This is an authenticated route.* This route is used to create posts for the authenticated user.
      - DELETE `/posts/` : *This is an authenticated route.* This route is used to delete the post of the authenticated user.