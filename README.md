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
# ENVIRONMENT SETUP
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

1. Open the Keycloak admin console and login with admin access at `https://kc-triy.myte.beta.lyr.id/admin/`
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
# Running Scanbot-Lite
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
