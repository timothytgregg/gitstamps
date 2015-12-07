var Profile = function(info){
  this.username = info.username;
  this.id = info._id;
  this.stamps = info.stamps;
};

Profile.fetch = function(){
  var request = $.getJSON("http://localhost:4000/profiles")
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
  var url = "http://localhost:4000/profiles";
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

Profile.prototype.getRepos = function(){
  var user = this.username;
  var request = $.getJSON("https://api.github.com/users/"+user+"/repos?access_token="+ghKey)
    .then(function(repos){
      var urls = [];
      repos.forEach(function(repo){
        urls.push(Profile.getRepoLanguage(repo.languages_url));
      })
      return urls;
    })
  return request;
}

Profile.getRepoLanguage = function(lang_url){
  var request = $.getJSON(lang_url+"?access_token="+ghKey)
    .then(function(lang){return lang})
  return request;
}

Profile.prototype.getLanguages = function(){
  var self = this;
  var repos = this.getRepos()
    .then(function(urls){
      urls.forEach(function(url){
        url.then(function(l){console.log(l)})
      })
    })

}
