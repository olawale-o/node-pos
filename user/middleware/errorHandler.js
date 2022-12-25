const handleError = (err, res) => {
  console.error(err);
  // sendCriticalErrorNotification()
  
  if (!err.isOperational) {
    // Shut down the application if it's not an AppError
  }
  return res.status(err.statusCode).json({
    message: err.message,
  });
};
  
module.exports = handleError;
