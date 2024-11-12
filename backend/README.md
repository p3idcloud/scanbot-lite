# Deployment to Lyrid Platform

This documentation contains technical documentation related to the setup and deployment of your application at Lyrid platform.

## Prerequisite

1. Lyrid account. If you don't have it yet, you can register a new account [here](https://app.lyrid.io/register/).
2. Lyrid client. The executable is readily made for [Windows](https://api.lyrid.io/client/dl/win), [Linux](https://api.lyrid.io/client/dl/linux), and [Mac](https://api.lyrid.io/client/dl/mac).
3. Lyrid default config. Follow these instructions for [adding default config](https://docs.lyrid.io/initialization#adding-default-config)

## Express.js deployment

Firstly, double check file named `.lyrid-definition.yml` at your Express.js root directory. Here's an example of the file:

```
# path: ./.lyrid-definition.yml

name: scanbotlite-backend-express
description: Backend service for Scanbot project built with Express.js
ignoreFiles: .git node_modules
modules:
- name: nodejs
  language: nodejs18.x
  web: express
  description: NodeJS v18.x module using Express web framework v4.x
  functions:
  - name: entry
    entry: entry.js
    description: the entry point for the function
```

Then, upload your code to Lyrid platform by running the following command:

```
lc code submit
```

Once it's done uploading, you should be able to see the public endpoint for your application at the end of the command output:

```
✅ App build and deployment completed: LYR
🚀 Run your endpoint at: https://api.lyrid.io/x/scanbot-backend-express/nodejs14-express4/latest/entry/
🚀 Try our new subdomain at: https://wnxb.lyr.id
```

After the initial upload, create `.env.production` by copying contents of `.env.development` and update your `.env.production` file with the Lyrid public URL, like so:

```
# BASE_URL -> your backend url
# FRONTEND_URL -> your frontend url
BASE_URL=https://wnxb.lyr.id/
FRONTEND_URL=https://s22d.lyr.id/
```

Also update the `NODE_ENV` to `production` for production environment variable

```
NODE_ENV=production
```

Once you did that, run the following command to update your application at Lyrid platform:

```
lc code submit
```

### Note:
To avoid running confusing deployment orders.
It is recommended to take this approach:

1. Submit Frontend & Backend first
2. Retrieve  `BASE_URL` and `FRONTEND_URL`
3. Store it in `.env.production` of respective apps
4. Re run `lc code submit` for both apps

## Notes on Dependency
Dont update pdf-merger-js, canvas, or c2pa-node as there could be dependency incompatibilities
