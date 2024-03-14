// deployment setup
const shell = require('shelljs');

exports.postDeploy = (req, res) => {
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
};

exports.getDeploy = (req, res) => {
  res.send('GET request to the /deploy endpoint..');
};
