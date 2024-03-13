require('dotenv').config();
const mongoose = require('mongoose');
// const { bookipediaConnection } = require('./src/db/connections');
const app = require('./src/app');
require('./src/utils/scheduleTasks');

//to handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.log('✗ unhandledRejection', error.message);
});

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log('↪ connected to database ✔');
  })
  .catch((err) => console.log('✗ ', err));

app.get('/', (req, res) => {
  // This code will be executed when a GET request is made to the base URL
  res.send('welcome to bookipedia app!');
});

// deployment setup
const shell = require('shelljs');
app.post('/deploy', function(req, res) {
  const deployment_key_req = req.body.secret_key;

  if (deployment_key_req && deployment_key_req === process.env.DEPLOYMENT_KEY) {
    // Log the current working directory
    console.log('Current working directory:', process.cwd());

    // Make deploy.sh executable
    shell.chmod('+x', './deploy.sh');

    // Execute deploy.sh
    shell.exec('./deploy.sh', (code, stdout, stderr) => {
      console.log('Exit code:', code);
      console.log('Program output:', stdout);
      console.log('Program stderr:', stderr);
    });

    res.status(200).send('Deployment script executed');
  } else {
    res.status(403).send('Unauthorized');
  }
});

app.get('/deploy', (req, res) => {
  res.send('GET request to the /deploy endpoint');
});

// START SERVER
app.listen(process.env.PORT | 3000, () => {
  console.log(`↪ server is running on port ${process.env.PORT | 3000} 🚀`);
  console.log(`↪ NODE_ENV → ${process.env.NODE_ENV} 🔨`);
});
