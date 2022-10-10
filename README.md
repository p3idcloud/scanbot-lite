# Setting up and running

### Front end



# Implement Keycloak as IdP

### 1) Create a realm

A realm allows creating isolated groups of applications and users. By default there is a single realm in Keycloak called `master`. This realm is dedicated to manage Keycloak and should not be used for client applications.

1. Open the Keycloak admin console and login with admin access at `https://{keycloak-host}/admin/`
2. Click `Master` dropdown, then click `Create Realm` <details><summary>Example</summary><img src="./assets/1-create-a-realm-2.png"/></details>
3. Fill in the `Realm name` field, then click `Create` <details><summary>Example</summary><img src="./assets/1-create-a-realm-3.png"/></details>
4. Customize login screen in `Realm settings` section, and enable the necessary options <details><summary>Example</summary><img src="./assets/1-create-a-realm-4.png"/></details>

---

### 2) Add a client application

Secure application by registering it to the previously created realm.

1. Click `Clients` on the left sidebar, then click `Create client` <details><summary>Example</summary><img src="./assets/2-add-client-1.png"/></details>
2. Change the `Client type` to `SAML`, and fill in the `Client ID` field, then click `Save`. Then update `.env.development / .env.production`: 

```
KEYCLOAK_CLIENT_ID=`Your Client ID`
```

<details><summary>Example</summary><img src="./assets/2-add-client-2.png"/></details>
3. In the `Settings` tab, update the `Account settings` by adding the client application details <details><summary>Example</summary><img src="./assets/2-add-client-3.png"/></details>
4. In the `Keys` tab, click `Import key` on the `Signing keys config `section <details><summary>Example</summary><img src="./assets/2-add-client-4.png"/></details>
5. Before importing the key, genererate certificate/key pair for the signing keys config and archive it in `PKCS12` format. <details><summary>Example</summary><p>Command to generate certificate/key pair:</p><code>openssl req -newkey rsa:2048 -nodes -keyout key.pem -x509 -days 3650 -out cert.pem</code><p>Command to archive in pkcs12 format:</p><code>openssl pkcs12 -export -out cert.p12 -in cert.pem -inkey key.pem -passin pass:password -passout pass:password -name "test"</code></details>

Sample file output:
cert.pem
```
-----BEGIN CERTIFICATE-----
<mark>MIIE2DCCAsACCQCsLqBWPMe5TDANBgkqhkiG9w0BAQsFADAuMQswCQYDVQQGEwJJ
TjELMAkGA1UECAwCVVAxEjAQBgNVBAcMCU5ldyBEZWxoaTAeFw0yMTA3MTkxOTQ2
MTNaFw0yNDAxMDUxOTQ2MTNaMC4xCzAJBgNVBAYTAklOMQswCQYDVQQIDAJVUDES
MBAGA1UEBwwJTmV3IERlbGhpMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKC
AgEAysqyBFvsUzLncFqokSC/u7j6xhzoK0WnaQUfbDkfUMIN7AoYfHv6GUIgPKYT
GICzkuxsvDl2epK5uOZVdQtKbh4KpSxGN0Oln9vcEj+bfVXNfZZc6FeRsGkkiufK
xONB2KzYJ0xbNAFOjmHpA3psl0xxIS/jrc26YGzgkerrDatXZusKq7/VguuhLAaZ
8pdtTM0VFYi+wPVph2A4Re0hhYYMA/qAF64l2YNTJp8EXE4gvD5QQTCHRcKiY3jQ
Obp8L2dv6JGDFZrPgmeyo4xcG4zlcSqduBHgXhWNOb5ycHuGpozgqTu/lYOphDf2
ZpLaQHorSjy0XVsxTUKlBRYKVRuE28kbXRTUqOFEnV3nm5wVrhetREmagJzqAhWx
F/Ek1OwRXZUEp6CSJv8eqkXabaJWqutV8j6AlNkZSrA58NVX/ynFSy6iNjDUDaF3
QwjzSxTfiH4ndeFnSGljA1CD9aWl1esYYYHGHRIc84aYgktLb7EycAWrQmc50Bt6
2FGHyUveGXQkjGHlPchKNSBivjOifkIPwuUhIERqSnUgARJtwkZTPW4QF1Ens0Xv
ZASBVQYVsSIX8tM9xUnExn00nzhWuzaHg5GAN84BgxLM1dR251q0lzkDC8oK16GE
1OLSx4/wQxK6YYbjTbmFg3WrW1MO3XmxEYugCMblbhADBUcCAwEAATANBgkqhkiG
9w0BAQsFAAOCAgEAvrXa0EncnagdqgnlTE/ryU4Dv53+/Y5uJzUhv5KSihJeLkLo
rwNl9a4n5uu5RcCiVHWUeYHvd/I5K+QvigeQImo+QByXLeXo/H70FK1wlxFcXGnv
TLhlVXyjdw6OoHkVDK2j0GCYiM19olBWophNJL9Kzt+f9zGmCumDCGHls6bfEEnv
z5jXClZAKDZZ6eYxaUTRhyhGv4k0lH4wsCY6oIZFdtm7aK9ivWOMUp/fYWCtox7g
pjUfmXr0skgagx2lAaATmO/5aABlVfis3iX3b8/rOPYdVllg1kL1/Z6hlFvou3+L
b9sLgJAA0R9er9eyIBPogUiMjGmLxqOWzQ7Wm00EdwPVeKsPJSvDjPfpNdAwoHtW
UnPHvlG/eo6gafT7UWy9/MwLzp7z3V6LFYtCc5EefJrGlLijC0L/3XQ4cOLA3okJ
nMLwIzgYWgjnYmicFBzYuuTZWorBHRea0GuhWnFToz9+YA0FIVpVuexQLhxSFJbP
ZfwwS6Y8dz309OCiIQFVYcL8GdMun6/HWjCM8HD56MUHCtp4b2Um/HZBmhgwXIB+
1IGzk5wMNxKZ7BICOqhhe3RVxN3mUwKwCAFx7xNG8vMHNaz/Mn5vf////XiEIS+g
AgJQy5omxAz7kBbiz8oU/EwzAge5zS1udqoBm02g1cSrlo98EgUwXcF6emM=</mark>
-----END CERTIFICATE-----
```

key.pem
```
-----BEGIN PRIVATE KEY-----
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
aKJvoKt9iy36w1bMZ4sjHYWgNMjcWid2
-----END PRIVATE KEY-----
```

Copy and paste the following keys, encoded to base 64 into `.env.development / .env.production`:

```
KEYCLOAK_SIGNING_PRIVATE_KEY=`Your encoded key.pem`
KEYCLOAK_SIGNING_CERT=`Your encoded cert.pem`
```

6. Fill in the `Import key` form with the previously created `PKCS12` archive details <details><summary>Example</summary><img src="./assets/2-add-client-5.png"/></details>

---

### 3) Create a client scope for the client application

Client scopes are entities in Keycloak, which are referenced by their name when a request is sent to the Keycloak authorization endpoint with a corresponding value of the scope parameter.

1. Click `Clients scopes` on the left sidebar, then click `Create client scope` <details><summary>Example</summary><img src="./assets/3-create-a-client-scope-1.png"/></details>
2. Fill in the necessary fields, then click `Save` <details><summary>Example</summary><img src="./assets/3-create-a-client-scope-2.png"/></details>
3. Go to `Mappers` tab, then click `Configure a new mapper` <details><summary>Example</summary><img src="./assets/3-create-a-client-scope-3.png"/></details>
4. Choose `User Property` from the `Configure a new mapper` modal <details><summary>Example</summary><img src="./assets/3-create-a-client-scope-4.png"/></details>
5. Fill in all of the fields, then click `Save` <details><summary>Example</summary><img src="./assets/3-create-a-client-scope-5.png"/></details>
6. Repeat step 5 a few more times to add other `User Property` <details><summary>Example</summary><pre>
{
"name": "username",
"protocol": "saml",
"user.attribute": "username",
"friendly.name": "username",
"attribute.name": "username"
},
{
"name": "email",
"protocol": "saml",
"user.attribute": "email",
"friendly.name": "email",
"attribute.name": "email"
},
{
"name": "userid",
"protocol": "saml",
"user.attribute": "id",
"friendly.name": "userid",
"attribute.name": "userid"
},
{
"name": "firstname",
"protocol": "saml",
"user.attribute": "firstName",
"friendly.name": "firstname",
"attribute.name": "firstname"
},
{
"name": "lastname",
"protocol": "saml",
"user.attribute": "lastName",
"friendly.name": "lastname",
"attribute.name": "lastname"
}
</pre></details>

---

### 4) Get Keycloak public certificate

Keycloak public certificate will be needed for client application's configuration.

1. Go to `Realm settings` from the left sidebar, and click `SAML 2.0 Identity Provider Metadata` from `General` tab in the `Endpoints` section <details><summary>Example</summary><img src="./assets/4-get-idp-public-certificate-1.png"/></details>
2. Copy and store the `X509Certificate` to `.env.development / .env.production`.
- Update these values:

```
KEYCLOAK_IDP_CERT=`Your X509Certificate`
REQUIRE_CLIENT_SIGNATURE=true
```

---

### 5) Configure client application to use Keycloak authorization endpoint

- Update `.env.development / .env.production`:

```
BASE_URL = "https://localhost:3000/"
KEYCLOAK_SSO_LOGIN_URL = "https://kc.beta.lyrid.io/realms/test/protocol/saml"
```


- Example of payload data in jwt session token after successfully authenticated by Keycloak

```
{
  "user": {
    "name_id": "user1",
    "session_index": "ff166626-55a5-48d3-874e-f10bcb5c61a8::cbba7f95-6dcf-463f-9359-ff9ac80b87cf",
    "session_not_on_or_after": "2022-10-05T05:05:18.307Z",
    "attributes": {
      "username": ["user1"],
      "email": ["user1@test.com"],
      "userid": ["06bbb8da-eadc-4d3c-ac81-e2a7e742a5b4"],
      "firstname": ["User"],
      "lastname": ["One"],
      "role": ["default-roles-test"]
    }
  },
  "iat": 1664910320,
  "exp": 1665515120
}
```
