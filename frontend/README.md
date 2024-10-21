# Deployment to Lyrid Platform

This documentation contains technical documentation related to the setup and deployment of your application at Lyrid platform.

## Prerequisite

1. Lyrid account. If you don't have it yet, you can register a new account [here](https://app.lyrid.io/register/).
2. Lyrid client. The executable is readily made for [Windows](https://api.lyrid.io/client/dl/win), [Linux](https://api.lyrid.io/client/dl/linux), and [Mac](https://api.lyrid.io/client/dl/mac).
3. Lyrid default config. Follow these instructions for [adding default config](https://docs.lyrid.io/initialization#adding-default-config)

## Next.js deployment

Firstly, create a new file named `.lyrid-definition.yml` at your Next.js root directory. Here's an example of the file:

```
# path: ./.lyrid-definition.yml

name: scanbot-frontend-nextjs
description: Frontend service for Scanbot project built with Next.js
ignoreFiles: .git .next node_modules
modules:
  - name: nextjs12
    language: nodejs16.x
    web: nextjs
    description: NodeJS v16.x module using Next.js v12.x
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
🚀 Run your endpoint at: https://api.lyrid.io/x/scanbot-frontend-nextjs/nextjs12/latest/entry/
🚀 Try our new subdomain at: https://s22d.lyr.id
```

After the initial upload, update your `.env` file with the Lyrid public URL, like so:

```
BASE_URL=https://s22d.lyr.id/
BACKEND_URL=https://wnxb.lyr.id/
```

Once you did that, run the following command to update your application at Lyrid platform:

```
lc code submit
```

## Notes on Dependency
Dont update react-pdf it will break the pdf viewer
