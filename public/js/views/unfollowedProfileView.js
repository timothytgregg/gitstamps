var UnfollowedProfileView = function(profile){
  this.profile = {username:profile.username,id:profile.id};
  this.$el = $("<div class='unfollowed'></div>");
  this.render();
  $(".unfollows").append(this.$el);
};

UnfollowedProfileView.prototype = {
  render:function(){
    var self = this;
    this.$el.append(this.unfollowTemplate());

    this.$el.find("button").on("click", function(e){
      e.preventDefault();
      var data = {username:self.profile.username};
      Profile.create(data).then(function(newProfile){
        var view = new ProfileView(newProfile); // create the new profile view (renders)
      });
      self.$el.fadeOut(500,"linear",function(){
        self.$el.remove()
      })
    });
    $('.unfollows').append(this.$el);
  },
  unfollowTemplate:function(){
    var p = document.createElement('p');
    var b = document.createElement('button');
    b.textContent = 'Follow!';
    p.textContent = this.profile.username;
    p.appendChild(b)
    return $(p);
  }
}
