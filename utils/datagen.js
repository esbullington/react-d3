

exports.generateArrayOfPoints = function(n) {
  var data = [];
  for (var i = 0; i < n; i++) {
    var x = i;
    var y = Math.random() * 100;
    var point = {x: x, y:y};
    data.push(point);
  } 
  return data;
};

exports.generateArrayOfNumbers = function(n) {
  var data = [];
  for (var i = 0; i < n; i++) {
    var j = Math.floor(Math.random() * 100);
    data.push(j);
  } 
  return data;
};
