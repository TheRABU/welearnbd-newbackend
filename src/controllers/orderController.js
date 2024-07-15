const placeOrder = async (req, res) => {
  const { order } = req.body;
  try {
    console.log(order);
  } catch (error) {
    console.log(error.message);
    throw new Error();
  }
};

module.exports = { placeOrder };
