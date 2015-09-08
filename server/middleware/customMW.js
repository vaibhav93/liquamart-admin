module.exports = function() {
  return function myMiddleware(req, res, next) {
    console.log('custom MW running');
    console.log(res);
    next();
  }
}