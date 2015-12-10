var Profile = function(info){
  this.createdAt = info.createdAt;
  this.username = info.username;
  this.id = info._id;
  this.stamps = info.stamps;
};

Profile.fetch = function(){
  var request = $.getJSON("https://gitstamps.herokuapp.com/profiles.json")
  .then(function(response) {
    var profiles = [];
    for(var i = 0; i < response.length; i++){
      profiles.push(new Profile(response[i]));
    }
    return profiles;
    })
  .fail(function(response){
      console.log("js failed to load");
    });
  return request;
};

Profile.create = function(profileData) {
  var self = this;
  var url = "https://gitstamps.herokuapp.com/profiles.json";
  var request = $.ajax({
    url: url,
    method: "post",
    data: JSON.stringify(profileData),
    contentType : 'application/json'
  }).then(function(profileData) {
    var newP = new Profile(profileData);
    return newP;
  });
  return request;
};

Profile.prototype.delete = function(){
  var url = "https://gitstamps.herokuapp.com/profiles/" + this.id;
  var request = $.ajax( {url: url, method: "delete"} );
  return request;
}

Profile.prototype.unfollow = function(){
  var url = "https://gitstamps.herokuapp.com/profiles/"+this.id+"/unfollow";
  var request = $.ajax( {url: url, method: "delete"} );
  return request;
}
