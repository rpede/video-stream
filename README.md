# VideoStream

Not a very efficient video streaming web app.

Performance is intentionally bad, since it was supposed to be a tool used for teaching about scalability. 

## Prerequisite

- node.js v16 to v19
- npm 8.x or newer

On Linux you need to install **handbrak-cli** manually.

## Commands

Setup after cloning:
```
npm run setup
```

Run server
```
npm start
```

After modification of `prisma/schema.prisma`
```
npm run sync
```
