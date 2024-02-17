### How we handle large files with MongoDB/Express and our problems


#### The main components we use:
 - multer &rarr; upload file handler - npm package
 - mongoose &rarr; mongodb driver - npm package
 - GridFSBucket &rarr; from `mongodb` node modules
 ```js
  const mongoose = require('mongoose');
  const multer = require('multer');
  const { GridFSBucket } = require('mongodb');
 ```

#### The main solution we apply:
1. multer handle the request that carry the file
2. GridFSBucket to apply gridfs feature functionallity to the uploaded file, like fs.files, fs.chuncks.
3. GridFSBucket streaming to stream the upload and download
4. mongoose as a driver above mongodb to make it more easy to integrate 

#### The problems we face: 
After deploying the application with vercel, there is some errors raise. The main two errors is 
- request payload large size [link](https://vercel.com/guides/how-to-bypass-vercel-body-size-limit-serverless-functions#upload-directly-to-the-source)
- request timeout [link](https://vercel.com/guides/how-to-bypass-vercel-body-size-limit-serverless-functions#upload-directly-to-the-source)