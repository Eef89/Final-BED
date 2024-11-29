const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(300).json({ message: "Something went wrong!" });
};

export default errorHandler;
