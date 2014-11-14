
exports.isAnArray = function(arr) {
  if( Object.prototype.toString.call( arr ) === '[object Array]' ) {
    return true;
  }
  return false;
};
