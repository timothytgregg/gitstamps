var Profile = function(info){
  this.username = info.username;
  this.id = info._id;
  this.stamps = info.stamps;
};

Profile.fetch = function(currentUser){
  var request = $.getJSON("http://localhost:3000/profiles.json")
  .then(function(response) {
    console.log(response)
    if(response.length === 0){
      var url = "http://localhost:3000/profiles.json";
      var url = "http://localhost:3000/profiles.json";
      var request = $.ajax({
        url: url,
        method: "post",
        data: JSON.stringify({username: "currentUser"}),
        contentType : 'application/json'
      }).then(function(profileData){
        var newP = new Profile(profileData);
        return newP
      })

    }
    var profiles = [];
    for(var i = 0; i < response.length; i++){
      profiles.push(new Profile(response[i]));
    }
    console.log(profiles)
    return profiles;
    })
  .fail(function(response){
      console.log("js failed to load");
    });
  return request;
};

Profile.create = function(profileData) {
  var self = this;
  var url = "http://localhost:3000/profiles.json";
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
  var url = "http://localhost:3000/profiles/" + this.id;
  var request = $.ajax( {url: url, method: "delete"} );
  return request;
}

Profile.prototype.unfollow = function(){
  var url = "http://localhost:3000/profiles/"+this.id+"/unfollow";
  var request = $.ajax( {url: url, method: "delete"} );
  return request;
}
