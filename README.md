#LOCAL SETUP
## Setting up and running

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
#PROD SETUP
## Implement Keycloak as IdP

---

### 1) Import Scanbot Realm to Keycloak

A realm allows creating isolated groups of applications and users. By default there is a single realm in Keycloak called `master`. This realm is dedicated to manage Keycloak and should not be used for client applications.

1. Open the Keycloak admin console and login with admin access at `https://kc-triy.myte.beta.lyr.id/admin/`
2. Click `Master` dropdown, then click `Create Realm` 
3. In the `Resource file` field, click `Browse` and import `scanbot-realm.json` from the `assets` folder, then click `Create` 

---

### 2) Get Keycloak Public Certificate and Configure Scanbot Application

Keycloak public certificate will be needed for client application's configuration.

1. Go to `Realm settings` from the left sidebar, and click `SAML 2.0 Identity Provider Metadata` from `General` tab in the `Endpoints` section 
2. Copy the content of `X509Certificate` and the `Location` of `SingleSignOnService` to `.env.development / .env.production`.

```
KEYCLOAK_IDP_CERT = "MIICnTCCAYUCBgGD+GUy+jANBgkqhkiG9w0BAQsFADASMRAwDgYDVQQDDAdzY2FuYm90MB4XDTIyMTAyMTAyMzM0NVoXDTMyMTAyMTAyMzUyNVowEjEQMA4GA1UEAwwHc2NhbmJvdDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMC/ZkwXLhWV4lH8NpXo3/3SUv2icoySCAJs5rVCwo5g1F9layywpaZGwu36SjqBd7C3jQuJxbGSaKS1Tq5OCImhGAM5u/sVq0gmXkQ8Up2k0JJlvDNzgYNHHIaQ90doLg3bSB8bC+V8ckZ69udtw88bTRvnfEm8QYP8RMdyRzP+EpwpBqt3BvrBGOtr4V5EV57HI4Y08Wo0grNvrVQp1feOME0iiMImi5x5eKKgMPUpJm3a8s8+RBY5dgMP8GAAlQVjbxVpJ0bwI3JkpLzPXxgrG/CRa1Yx8tn68xMTYkdlb18gDlSXPEzOkNLeTEs9fEZj+feCA7SL0SclCNrEPQcCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAnKnNNcjr5fUnGwKugp/1q0RDU3/toG3HvpTLtLdJJRkg9+jNhSnwghJLaoiAvvDa1iWV3fgtCym+APFEGwF+Rthhg3/IXsGIFX/z6A0FwvFmssBqvoBwbSQXkdND0+hl2DilOBM4x1OAKo0KV+ifSNLg46fkI34bRfYXvCKAu+h71hBn1rYAWzQyfHZeWSZYb/5h2ZsmDFZaFWt031oS2q93hGIPzWt4ST21DelnUyVlSW0v+mz4Mg4EJfWvY1ejC9u91ldwSz4N8OiO98rFTEFDoWhFx6H4WS52WihpDktwx90wKqdvSiUka5T88L+dl5IOG+Ot9oV+VCYJ8AXAzw=="

KEYCLOAK_SSO_LOGIN_URL = "https://kc-triy.myte.beta.lyr.id/realms/scanbot/protocol/saml"
```

# IMPORTING JSON CONFIG
Run the loadenv script:
```
bash loadenv.sh PATH_TO_FILE.json
```
Example:
```
bash loadenv.sh assets/env-mjif.json
```
