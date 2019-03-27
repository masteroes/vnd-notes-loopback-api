module.exports = () => (error, req, res, next) => {
  let statusCode = error.statusCode;

  statusCode = statusCode >= 404 || !statusCode ? 500 : statusCode;
  console.log("hello______");
  res.status(statusCode).send();
};
