module.exports = (errorasync) => (request, response, next) => {
  Promise.resolve(errorasync(request, response, next)).catch(next);
};
