var Stamp = function(info){
  this.data = info.data;
  this.language = info.data.language;
  this.id = info.id
}

Stamp.create = function(profileId,stampData) {
  var self = this;
  var url = "http://localhost:4000/profiles/"+profileId+"/stamps";
  var request = $.ajax({
    url: url,
    method: "post",
    data: JSON.stringify(stampData),
    contentType : 'application/json'
  }).then(function(stampData) {
    var newS = new Stamp(stampData);
    return newS;
  });
  return request;
};
