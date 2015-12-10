var UnfollowedProfileView = function(profile){
  this.$el = $("<div/>");
  this.username = profile.username;
  this.id = profile._id;
};

UnfollowedProfileView.prototype = {
  render:function(){
    
  }
}
