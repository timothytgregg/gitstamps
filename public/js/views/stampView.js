var StampView = function(stamp){
  this.stamp = stamp;
}

StampView.prototype = {
  render: function(){
    var langTotals = this.stamp.data.langTotals;
    var el = $("<ul/>");
    for (lang in langTotals){
      el.append("<li>"+lang+": "+langTotals[lang]+" bytes")
    }
    return(el)
  }
}
