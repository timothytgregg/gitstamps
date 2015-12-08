var StampView = function(stamp){
  this.stamp = stamp;
}

StampView.prototype = {
  render: function(){
    console.log(this.stamp)
    var el = $("<p>" + this.stamp.data.totalLangs[0] + "</p>");
    return(el)
  }
}
