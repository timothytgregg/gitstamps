var newProfileView = function(profile){
  var self = this;
  self.$el = $(".newProfileView");
  $(".newProfile").on("submit", function(){
    event.preventDefault();
    self.checkProfile().then(function(result){
      if (result.exists){
        self.createProfile();
      }
    })
  })
};

newProfileView.prototype = {
  createProfile: function() {
    var self = this;
    var data = {username:self.$el.find('input[name=username]').val()};
    Profile.create(data).then(function(newProfile){
      self.$el.find("input").val('');  // clear the input
      var view = new ProfileView(newProfile); // create the new profile view (renders)
    });
  },
  checkProfile:function(){
    var self = this;
    var username = self.$el.find('input[name=username]').val();
    url = "http://localhost:3000/profiles/check?username="+username;
    return $.getJSON(url);
  }
};
