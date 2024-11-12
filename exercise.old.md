---
(Deprecated)
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
