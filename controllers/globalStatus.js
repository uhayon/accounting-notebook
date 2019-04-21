const handleGetGlobalStatus = (req, res, netBalance) => {
  res.json({ netBalance });
}

module.exports = {
  handleGetGlobalStatus
}