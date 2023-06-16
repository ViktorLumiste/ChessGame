# Example backend for ITA21

This backend serves as a reference implementation for ITA21 projects. It is a basic HTTP server, built using the Express framework in JavaScript,designed solely for testing and development purposes. Please note that it is not intended for production use and lacks security, speed, scalability, and aesthetics. Its purpose is solely to support the testing of the frontend and serves as an example of a backend for ITA21 projects.

## Prerequisites

To begin working with this project, you need to have Node.js installed on your machine. You can download it from the official Node.js website (https://nodejs.org/en/download/).


## Getting Started

Once you have installed Node.js, follow these steps:

1. Install files from this repository to your computer.
2. Run `npm install` to install all the necessary dependencies for the project.
3. Create the necessary database (see below).
4. Run `npm start` to start the server on port 3000 (or whatever port you have specified in the .env file).
5. Navigate to [http://localhost:3000](http://localhost:3000) to access the webpage.

## Database
1. Install MySQL server 
2. Open mysql command line and enter the following commands: `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'yourrootpassword';` and `flush privileges;`
3. Create schema called `logins` by entering the following command: `create schema logins;`
4. Create database called `logininfo` by entering the following command: `create table logininfo
(
userID    int auto_increment
primary key,
email     varchar(50)             not null,
password  varchar(100)            not null,
sessionId varchar(100) default '' not null
);`

   

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- [Express](https://expressjs.com/) for the web framework.
- [Node.js](https://nodejs.org/en/) for the JavaScript runtime.
- [NPM](https://www.npmjs.com/) for the package manager.
- [Dotenv](https://www.npmjs.com/package/dotenv) for the environment variables.
- [Bcrypt](https://www.npmjs.com/package/bcrypt) for the password hashing.
-
