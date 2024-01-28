const express = require('express');

const router = express();

router.get('/', (req, res) => {
    res.send('authentication route');
  });


module.exports = router;