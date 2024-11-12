# Scanbot Exercise
Get more familiar with Scanbot-Lite app by trying out some exercise that we prepared. Compare to `main` branch to see 
code changes for each implementation.

---
Setup tutorial
---

1. Git clone [this repo](https://github.com/p3idcloud/scanbot-lite)
2. Copy paste the environments supplied
    - `.env.development` for development, and `.env.production` for build
    - You need two environment files (one in backend and one in frontend)
3. Get your local IP Address
    - Use `ipconfig` or a similar command to figure out your local IP address and use that instead of `localhost`
    - For production use (deploying) you should use environment variables in `.env.development` with only changes to `BASE_URL`, `FRONTEND_URL` and `BACKEND_URL` to the urls you would use (local ip for testing in device and actual domain for deployment for production).



# LOCAL SETUP
## Setting up and running
### This can be skipped. User will get environment file that can be imported. Start from Environment Setup.

---

This repo has 5 services total to run:

1. emqx
2. keycloak
3. mongodb
4. minio
5. frontend
6. backend

## Setting up docker containers

### 1. EMQX
```
docker run -d --name emqx -p 1883:1883 -p 8083:8083 -p 8883:8883 -p 8084:8084 -p 18083:18083 emqx/emqx
```

### 2. Keycloak
```
https://www.keycloak.org/server/containers
```

### 3. Mongodb
```
docker run --name mongodb -d -p 27017:27017 mongo
```

### 4. Minio
```
docker run -d -p 9000:9000 -p 9001:9001 -e "MINIO_ROOT_USER=minioadmin"  -e "MINIO_ROOT_PASSWORD=minioadmin" --name minio quay.io/minio/minio server /data --console-address ":9001"
```

### Additional Notes:
Scanbot-lite uses Keycloak SAML to login, steps to setup are shown below.
For setting up the front end and back end, refer to the README.md at their respective root directories.

---
ENVIRONMENT SETUP
---

### 0) Prerequisites : Node.js 18 or 20, Yarn

1. Installing Node. Download Node and install normally
2. Installing Yarn. Run terminal / cmd / powershell as admin then run command

```
npm install -g yarn
```
3. In case of error (Windows) : yarn.ps1 cannot be loaded because running scripts is disabled on this system, run terminal with admin access
```
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
```
or if you don't have admin permission
```
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 1) Import Scanbot Realm to Keycloak (Skip this)

A realm allows creating isolated groups of applications and users. By default there is a single realm in Keycloak called `master`. This realm is dedicated to manage Keycloak and should not be used for client applications.

1. Open the Keycloak admin console and login with admin access. Example of admin url: `https://kc-triy.myte.beta.lyr.id/admin/`
2. Click `Master` dropdown, then click `Create Realm` 
3. In the `Resource file` field, click `Browse` and import `scanbot-realm.json` from the `assets` folder, then click `Create` 

### 2) Import JSON Config (Deprecated)
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
Exercise 1: Register and Scan
---

## 1) Register Scanner
1. Identify the scanner IP Address and connect to Web UI for Scanner
2. Navigate to Cloud
3. Add the backend url (example 192.168.0.1:8000, scanbotlite.lyr.id)
4. Finish Registration process

## 2) Initiate a Scan
1. Select your newly registered Scanner
2. Start Session > Start Capturing

---
Exercise 2: Test out Plugins
---

## 1) OpenText
#### Updating Opentext Plugin
1. Open scanbotlite dashboard
2. Open Settings in the top right corner ⚙ (Cog Icon).
3. Navigate to Plugin Tab
4. Fill the Opentext forms
5. Test the connection first, before saving to make sure your connection to opentext are successfull.
6. Click Update

#### Generate a new Opentext Client API
To generate a new Client API you can follow this guides
[https://developer.opentext.com/cloud-platform/tutorials/create-your-first-application/1](https://developer.opentext.com/cloud-platform/tutorials/create-your-first-application/1)

Until you received `opentext_url` , `tenant_id`, `client_id`, `client_secret`

## 2) C2PA
#### There are two ways to download C2PA files:
1. **During Document Scanning:**
    When you scan a new document, the PDF viewer will pop up on your screen. In the viewer, you will find a button labeled **C2PA Download**.

2. **From Scan History:**

   Open your scan history. In the action column, you will see a [D] icon for details. Click on this icon to open the PDF viewer, where you will find the new **C2PA Download** button.

#### Generate a New Certificate for C2PA
If you want to generate a new certificate for C2PA, you will need to create a new one. For the specifications, please follow these guidelines: [C2PA Signing Manifest](https://opensource.contentauthenticity.org/docs/manifest/signing-manifests).

You should have two files with the extensions `.key` and `.pem`. 

Replace the following files with your key:
- `/backend/src/certs/p3idtech.com.scanbot.pem`
- `/backend/src/certs/tls_server.key`

---
Exercise 3: Deploying to Cloud
---
Deploying an application to cloud is as simple as setting up Lyrid Account. To deploy your application, simply go
through [Lyrid Documentation](https://docs.lyrid.io/registration) from Registration up to Deploying Function.

To deploy your application to cloud, first you need to submit both frontend and backend to Lyrid Platform. It will
return you the endpoint for each application (ex: wxyz.lyr.id for backend and abcd.lyr.id for frontend). Application
wouldn't work for now. Then clone a .env file (in frontend and backend) based on the environment that you have 
(remove .env.development and .env.production), update the values on .env that you created before: 

Variables: BASE_URL, FRONTEND_URL or BACKEND_URL (depending on frontend or backend application). 

After updating .env file, do a resubmit on both frontend and backend application. It will update your env file on 
cloud and on finish, your cloud version of Scanbot-Lite is ready.

For more information you can visit corresponding `README.md` documents within frontend and backend directories.