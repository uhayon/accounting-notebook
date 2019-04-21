const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const { handleGetAllTransactions, handleGetSingleTransaction, handlePostTransaction } = require('./controllers/transactions');
const { handleGetGlobalStatus } = require('./controllers/globalStatus');

const accountState = {
  netBalance: 0,
  lockOperations: false,
  transactionsHistory: []
}

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  while(accountState.lockOperations) continue;

  next();
});

app.get('/globalStatus', (req, res) => handleGetGlobalStatus(req, res, accountState.netBalance))
app.get('/transactions', (req, res) => handleGetAllTransactions(req, res, accountState.transactionsHistory));
app.post('/transactions', handlePostTransaction(accountState));
app.get('/transactions/:id', (req, res) => handleGetSingleTransaction(req, res, accountState.transactionsHistory));

app.listen(3000, () => {
  console.log('App running on port 3000');
})