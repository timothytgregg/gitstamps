var Stamp = function(info){
  this.createdAt = info.createdAt;
  this.data = info.data;
  this.id = info._id;
}

Stamp.create = function(profileId,stampData) {
  var self = this;
  var url = "https://gitstamps.herokuapp.com/profiles/"+profileId+"/stamps";
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
