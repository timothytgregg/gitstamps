var StampView = function(stamp){
  this.stamp = stamp;
}

StampView.prototype = {
  render: function(){
    var el = $("<p>" + this.stamp.data.language + "</p>");
    return(el)
  }
}
