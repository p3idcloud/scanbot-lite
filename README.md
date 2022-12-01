# Scanbot Exercise
Get more familiar with Scanbot-Lite app by trying out some exercise that we prepared. Compare to `main` branch to see 
code changes for each implementation.

---
Exercise for Backend service
---
`Scanner history id` can be used to retrieve the job history of a scanner, and also get information about the stored files for that specific job. Due to the nature of the application, each page of the scanned file is stored as a separate object, so we can use this as an exercise to create a new feature.

As an exercise to get more familiar with the application, create new endpoints and implement logic to check if the scanner history exist and the user has access to the scanner history before processing the request.
### 1) Endpoint to combine several pdf documents
This can be achieved by using the `pdf-merger-js` library. The endpoint should accept the scanner history id as url parameter and return the combined pdf document.

### 2) Endpoint to save pdf document to Google Drive
This can be achieved by using the `googleapis` library. The endpoint should accept the scanner history id as url parameter and return the combined pdf document.

---
Exercise for Frontend service
---
For the frontend service, we will create a new feature to allow the user to make their account more secure by adding 2FA (Two Factor Authentication) to their account. One of the ways to achieve this is by implementing the iValt 2FA service using the `ivalt-api-js` library.

---
Exercise for Deploying to Cloud
---
Deploying an application to cloud is as simple as setting up Lyrid Account. To deploy your application, simply go
through [Lyrid Documentation](https://docs.lyrid.io/registration) from Registration up to Deploying Function.

To deploy your application to cloud, first you need to submit both frontend and backend to Lyrid Platform. It will
return you the endpoint for each application (ex: wxyz.lyr.id for backend and abcd.lyr.id for frontend). Application
wouldn't work for now. Then clone a .env file (in frontend and backend) based on the environment that you have 
(remove .env.development and .env.production), update the values on .env that you created before: 

Variables: BASE_URL
, FRONTEND_URL or BACKEND_URL (depending on frontend or backend application). 

After updating .env file, do a resubmit on both frontend and backend application. It will update your env file on 
cloud and on finish, your cloud version of Scanbot-Lite is ready.


# LOCAL SETUP
## Setting up and running
### This can be skipped. User will get environment file that can be imported. Start from Environment Setup.

---

This repo has 5 services total to run:

1. emqx
2. mongodb
3. minio
4. frontend
5. backend

## Setting up docker containers

### 1. EMQX
```
docker run -d --name emqx -p 1883:1883 -p 8083:8083 -p 8883:8883 -p 8084:8084 -p 18083:18083 emqx/emqx
```

### 2. Mongodb
```
docker run --name mongodb -d -p 27017:27017 mongo
```

### 3. Minio
```
docker run  -p 9000:9000  -p 9001:9001  -e "MINIO_ROOT_USER=minioadmin"  -e "MINIO_ROOT_PASSWORD=minioadmin"  quay.io/minio/minio server /data --console-address ":9001"
```

### Additional Notes:
Scanbot-lite uses Keycloak SAML to login, steps to setup are shown below.
For setting up the front end and back end, refer to the README.md at their respective root directories.

---
ENVIRONMENT SETUP
---

### 0) Prerequisites : Node.js 18, Yarn

1. Installing Node. Download Node and install normally
2. Installing Yarn. Run terminal / cmd / powershell as admin then run command

```
npm install -g yarn
```
3. In case error (Windows) : yarn.ps1 cannot be loaded because running scripts is disabled on this system, run terminal with admin access
```
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
```
or if you don't have admin permission
```
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 1) Import Scanbot Realm to Keycloak

A realm allows creating isolated groups of applications and users. By default there is a single realm in Keycloak called `master`. This realm is dedicated to manage Keycloak and should not be used for client applications.

1. Open the Keycloak admin console and login with admin access. Example of admin url: `https://kc-triy.myte.beta.lyr.id/admin/`
2. Click `Master` dropdown, then click `Create Realm` 
3. In the `Resource file` field, click `Browse` and import `scanbot-realm.json` from the `assets` folder, then click `Create` 

### 2) Import JSON Config
Run the loadenv script: (Make sure file is in LF (CRLF will break the script))
```
bash loadenv.sh
```
Then input your data when prompted. Example of prompt and input:
```
Enter the path to your env.json: assets/env-triy.json
Enter your ip for env: 172.19.45.99
```

---
Running Scanbot-Lite
---
### 1) Running BackEnd
To run backend services, first install all the dependency in /backend folder
```
yarn install
```
After installation is done, run:
```
yarn dev
```

### 2) Running Frontend
To run frontend services, open another terminal. First install all the dependency in /frontend folder
```
yarn install
```
After installation is done, run:
```
yarn dev
```
---
Exercise
---
`Scanner history id` can be used to retrieve the job history of a scanner, and also get information about the stored files for that specific job. Due to the nature of the application, each page of the scanned file is stored as a separate object, so we can use this as an exercise to create a new feature.

As an exercise to get more familiar with the application, create new endpoints and implement logic to check if the scanner history exist and the user has access to the scanner history before processing the request.
## 1) Endpoint to combine several pdf documents
This can be achieved by using the `pdf-merger-js` library. The endpoint should accept the scanner history id as url parameter and return the combined pdf document.

## 2) Endpoint to save pdf document to Google Drive
This can be achieved by using the `googleapis` library. The endpoint should accept the scanner history id as url parameter and return the combined pdf document.