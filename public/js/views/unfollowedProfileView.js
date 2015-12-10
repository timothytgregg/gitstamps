var UnfollowedProfileView = function(profile){
  this.$el = $("<div/>");
  this.username = profile.username;
  this.id = profile._id;
};

UnfollowedProfileView.prototype = {
  render:function(){
    self = this;
    console.log(this)
    this.$el.append("<span>"+this.username+"</span>")
    this.$el.append("<button>Follow</button>")
    $('.unfollows').append(this.$el);

    this.$el.find("button").on("click", function(e){
      e.preventDefault();
      var data = {username:self.username};
      Profile.create(data).then(function(newProfile){
        var view = new ProfileView(newProfile); // create the new profile view (renders)
      });
      self.$el.fadeOut(500,"linear",function(){
        self.$el.remove()
      })
    });
  }
}
