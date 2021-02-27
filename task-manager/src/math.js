const calculateTip = (total, tipPercent = 0.2) => total + (total * tipPercent);

module.exports = {
  calculateTip
}