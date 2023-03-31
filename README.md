## How to run the Harry Gu modified project:

### Database setup

1. From the root folder, navigate to the `./Backend/DataAccessLayer` folder.
2. Run the `createdb.sql` script on your local SQL instance. If you don't have SQL Server Management Studio (SSMS), you can download it [here](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver15).

    **Note:** To avoid creating data in the wrong database, run the first part of the script below before running the rest of the script.

    ```
    USE master ;  
    GO  
    CREATE DATABASE MEDFAR_DEV_INTERVIEW  
    GO
    ```

### API setup

1. Get your {{ConnectionStrings}} for the SQL Server instance.
   - If you're not sure how to get the connection strings, you can follow the instructions [here](https://www.c-sharpcorner.com/article/get-connectionstring-for-sql-server/#:~:text=A%20%2D%20Get%20Connection%20String%20by%20SSMS,-Although%20the%20first&text=Open%20SSMS%2C%20right%20click%20a,get%20the%20database%20Connection%20String.).
2. Replace the connection strings in the `appsettings.json` file located in `./Backend`.
"ConnectionStrings": {
"DefaultConnection": "your {{ConnectionStrings}} here!"
},
    appsettings.json:
    ```
        "ConnectionStrings": {
            "DefaultConnection": "your {{ConnectionStrings}} here!"
        },
    ```

3. Build and run the project!

### Front-end setup
1. Set up the proxy in the `./Frontend/package.json` file to match the URL of the back-end.
2. Change the constant `API_BASE_URL` in the `./Frontend/src/shared/Constants/apiConstants.ts` file to match the URL of the back-end.
3. Download the latest version of [Node.js](https://nodejs.org/en/).
4. Open a command prompt and navigate to the `./Frontend` folder.
5. Use the following commands to start the application:

    ```
    npm install
    ```

    ```
    npm start
    ```



Feel free to reach out to me(harry.guapi@gmail.com) if you need any further assistance!


  ####################################################################################

# MedfarCodingTestV2
The medfar coding test (version 2.0) for new employees
---
## Introduction
This project is a simple web application using the following technologies:
- Backend - ASP.NET in C#
- Frontend - React with Typescript
- Database - SQL
---
## How to run
### Database setup
From the root folder, navigate to the `./Backend/DataAccessLayer` folder. The `createdb.sql` script can be run on your local sql instance. SSMS can be found [here](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver16).

### Backend setup
Open the solution (`MedfarTest.sln`) in the latest version of visual studio. Run the Application project using IIS Express. A swagger UI should appear with only 1 route defined.

### Frontend setup
1. Download the latest version of [Node](https://nodejs.org/en/)
2. Open a command prompt and navigate to the `./Frontend` folder
3. Use the following commands to start the application
    - Install the necessary front end package using: `npm install`
    - Start the development server using: `npm start`
---

<p style="color:lightblue;font-size:24px;text-align:center;">Happy Coding!</p>

---
## F.A.Q.
1. If you get an error connection when loading users, make sure to properly setup the proxy in the `./Frontend/package.json` file to match the URL of the backend (can be found on the swagger UI page)
