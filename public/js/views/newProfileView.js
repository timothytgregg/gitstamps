var newProfileView = function(profile){
  var self = this;
  self.$el = $(".newProfileView");
  $(".newProfile").on("submit", function(){
    event.preventDefault();
    self.createProfile();
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
  }
};
