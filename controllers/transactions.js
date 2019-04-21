const uuidv1 = require('uuid/v1');

/***** GET ALL *****/
const handleGetAllTransactions = (req, res, transactionsHistory) => {
  console.log(transactionsHistory)
  return res.json(transactionsHistory);
}
/*******************/

/***** GET BY ID *****/
const handleGetSingleTransaction = (req, res, transactionsHistory) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json('Invalid ID supplied');
  }

  const foundTransaction = transactionsHistory.find(transaction => transaction.id === id);
  if (foundTransaction) {
    return res.json(foundTransaction);
  } else {
    return res.status(404).json('Transaction not found');
  }
}
/*********************/

/***** CREATE TRANSACTION *****/
const handlePostTransaction = accountState => (req, res) => {
  const transactionBody = req.body;
  if (!validateTransactionBody(transactionBody)) {
    return res.status(400).json('Invalid Input');
  }

  accountState.lockOperations = true;

  const amountMultiplier = (transactionBody.type.toLowerCase() === 'credit') ? -1 : 1;
  const newNetBalance = accountState.netBalance + (amountMultiplier * Number(transactionBody.amount));

  if (newNetBalance < 0) {
    return res.status(400).json(`Invalid amount. Can't have negative balance`);
  }

  const newTransaction = createNewTransaction(transactionBody);
  accountState.transactionsHistory = [...accountState.transactionsHistory, newTransaction];
  accountState.netBalance = newNetBalance;
  accountState.lockOperations = false;
  
  return res.json(newTransaction);
};

const validateTransactionBody = ({ type, amount }) => {
  if (!type || !amount) {
    return false;
  }

  const lowerCaseType = type.toLowerCase();
  const typeValid = lowerCaseType === 'credit' || lowerCaseType === 'debit';
  
  const numericAmount = Number(amount);
  const amountValid = !isNaN(numericAmount);

  return typeValid && amountValid;
}

const createNewTransaction = ({ type, amount }) => {
  return {
    id: uuidv1(),
    type,
    amount,
    effectiveDate: new Date().toISOString()
  };
}
/******************************/

module.exports = {
  handleGetAllTransactions,
  handleGetSingleTransaction,
  handlePostTransaction
};