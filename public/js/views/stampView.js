var StampView = function(stamp){
  this.stamp = stamp;
}

StampView.prototype = {
  render: function(){
    var el = $("<p>" + this.stamp.data.totalLangs[0] + "</p>");
    return(el)
  }
}
