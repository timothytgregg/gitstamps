$(document).ready(function(){
  Profile.fetch().then(function(profiles){
    profiles.forEach(function(profile){
      var view = new ProfileView(profile)
      view.render();
    })
    new newProfileView();
  });
  Profile.fetchUnfollowed().then(function(unfollows){
    unfollows.forEach(function(unfollow){
      unfollow.render();
    })
  })
});
