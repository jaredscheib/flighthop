const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require('dotenv').config();

const fbIsTokenValid = (accessToken) => {
  const appId = process.env.FB_APP;
  const appSecret = process.env.FB_SECRET;
  const path = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${appId}|${appSecret}`;

  return axios.get(path)
  .then((resp) => {
    console.log('FB access token is valid?', resp.data.data.is_valid);
    return resp.data.data.is_valid;
  })
  .catch((error) => {
    console.error(error);
  });
};

app.use(express.static(`${__dirname}/public`));

app.post('/login', (req, res) => {
  console.log('/login');
  fbIsTokenValid(req.body.accessToken)
  .then((isValid) => {
    if (isValid) res.sendStatus(200);
    else res.sendStatus(401);
  });
});

app.post('/flight', (req, res) => {
  console.log('/flight', req.body);
  fbIsTokenValid(req.body.accessToken)
  .then((isValid) => {
    if (isValid) {
      console.log('Authorized request. Getting flight data..');
      const { codeFrom, codeTo, date } = req.body;
      axios.post(`https://www.googleapis.com/qpxExpress/v1/trips/search?key=${process.env.API_QPX_KEY}`, {
        request: {
          slice: [
            {
              origin: codeFrom,
              destination: codeTo,
              date,
            }
          ],
          passengers: {
            adultCount: 1,
            infantInLapCount: 0,
            infantInSeatCount: 0,
            childCount: 0,
            seniorCount: 0
          },
          solutions: 20,
          refundable: false
        }
      })
      .then(({ data }) => {
        console.log('QPX response', data);
        res.send(data);
      });
    } else {
      console.log('Unauthorized request.');
      res.sendStatus(401);
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening at ${PORT}..`);
});
