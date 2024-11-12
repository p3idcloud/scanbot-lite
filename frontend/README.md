# Deployment to Lyrid Platform

This documentation contains technical documentation related to the setup and deployment of your application at Lyrid platform.

## Prerequisite

1. Lyrid account. If you don't have it yet, you can register a new account [here](https://app.lyrid.io/register/).
2. Lyrid client. The executable is readily made for [Windows](https://api.lyrid.io/client/dl/win), [Linux](https://api.lyrid.io/client/dl/linux), and [Mac](https://api.lyrid.io/client/dl/mac).
3. Lyrid default config. Follow these instructions for [adding default config](https://docs.lyrid.io/initialization#adding-default-config)

## Next.js deployment

Firstly, double check file named `.lyrid-definition.yml` at your Next.js root directory. Here's an example of the file:

```
# path: ./.lyrid-definition.yml

name: scanbot-frontend-nextjs
description: Frontend service for Scanbot project built with Next.js
ignoreFiles: .git .next node_modules
modules:
  - name: nextjs
    language: nodejs20.x
    web: next.standalone
    description: NodeJS v18.x module using Next.js v13.x
    functions:
      - name: entry
        description: the entry point for the function
```

Then, upload your code to Lyrid platform by running the following command:

```
lc code submit
```

Once it done uploading, you should be able to see the public endpoint for your application at the end of the command output:

```
✅ App build and deployment completed: LYR
🚀 Run your endpoint at: https://api.lyrid.io/x/scanbot-frontend-nextjs/nextjs/latest/entry/
🚀 Try our new subdomain at: https://s22d.lyr.id
```

After the initial upload, create `.env.production` by copying contents of `.env.development` and update your `.env.production` file with the Lyrid public URL, ensuring the Frontend and the Backend are connected to correct urls:

```
# BASE_URL -> your frontend url
# BACKEND_URL -> your backend url
BASE_URL=https://s22d.lyr.id/
BACKEND_URL=https://wnxb.lyr.id/
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
2. Retrieve  `BASE_URL` and `BACKEND_URL`
3. Store it in `.env.production` of respective apps
4. Re run `lc code submit` for both apps

## Notes on Dependency
Dont update react-pdf as there could be version incompatibilities with the app
