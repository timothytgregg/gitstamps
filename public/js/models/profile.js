var Profile = function(info){
  this.username = info.username;
  this.id = info._id;
  this.stamps = info.stamps;
};

Profile.fetch = function(){
  var request = $.getJSON("http://localhost:3000/profiles.json")
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

Profile.delete = function(id){
  var self = this;
  var url = "http://localhost:3000/profiles/"+id;
  var request = $.ajax({
    url:url,
    method:"delete"
  }).then(function(bool){
    console.log(bool)
  });
  return request;
}

Profile.fetchAll = function(){
  $('.profiles').html('');
  Profile.fetch().then(function(profiles){
    profiles.forEach(function(profile){
      var view = new ProfileView(profile)
      view.render();
    })
    new newProfileView();
  });
}
