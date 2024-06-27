## Project Documentation: File Server

### Project Title: File Server

### Project Objective
Lizzy runs a business that provides multiple users with a variety of documents, including wedding cards and admission forms, that she obtains on behalf of different businesses. In order to grow her company, Lizzy wants to create a digital platform where these documents can be viewed and downloaded from a distance. This platform will have features for administrators and users alike, including file downloads, email sharing, and account management.

### Application Overview
The application is designed to facilitate the sharing of documents via a web platform. In addition to sending files to an email address and viewing a list of available files, users can register and log in. Administrators may also see download data, upload files, and keep an eye on email shares, among other features.

### Features
- **User Features**:
  - Signup and login with email and password, including account verification.
  - Password recovery for lost passwords.
  - View a feed page containing a list of downloadable files.
  - Search the file server for specific documents.
  - Send files to an email through the platform.

- **Admin Features**:
  - Upload files with a title and description.
  - View the number of downloads and the number of emails sent for each file.

## Application URL
The application is live at [AT-File Server](https://at-file-server.onrender.com/)
### How to Clone and Get Started

1. **Clone the Repository**:
   ```sh
   git clone `https://github.com/chris-zano/AT_File-Server.git`
   cd at_file-server
   ```

2. **Install Dependencies**:
   Ensure you have Node.js and npm installed. Then run:
   ```sh
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add the necessary environment variables:
   ```env
   MONGO_DB_USERNAME=<your_mongo_db_username>
   MONGO_DB_PASSWORD=<your_mongo_db_password>
   CLUSTER_NAME=<your_cluster_name>
   APP_NAME=<your_app_name>
   DATABASE_NAME=<your_database_name>
   SYSTEM_EMAIL=<your_system_email>
   SYSTEM_EMAIL_PASSWORD=<your_system_email_password>
   PORT=<your_port>
   ```

4. **Run the Application**:
   - For development with automatic restarts:
     ```sh
     npm run dev
     ```
   - For production:
     ```sh
     npm start
     ```
   - For cluster mode:
     ```sh
     npm run cluster
     ```

5. **Access the Application**:
   The application will be live at `https://localhost:8080` (or the specified port in your `.env` file).

### Notable Features
- **Database**: The application uses MongoDB Atlas for database management, leveraging Mongoose for schema definitions and data modeling.
- **Security**: Passwords are hashed using `bcrypt` to ensure user data security.
- **Email Service**: Nodemailer is used for sending emails, enabling features such as file sharing via email and account verification.
- **File Uploads**: Multer is used for handling file uploads, ensuring efficient file management.
- **Rate Limiting**: Express Rate Limit is implemented to limit the number of requests per IP, enhancing security and preventing abuse.
- **Clustering**: The application utilizes Node.js clustering to handle multiple requests efficiently by leveraging multiple CPU cores.

### Dependencies
- bcrypt
- dotenv
- ejs
- express
- express-rate-limit
- loadtest
- mongodb
- mongoose
- multer
- nodemailer
- randomstring
- socket.io

### Development Dependencies
- nodemon

## Author
- Christian Solomon <cncs@chris.gmail.com>
