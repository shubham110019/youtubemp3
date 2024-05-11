const express = require('express');
const app = express();
const youtubeMp3Routes = require('./youtubeMp3Routes');
const PORT = process.env.PORT || 3000;

app.use(youtubeMp3Routes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

