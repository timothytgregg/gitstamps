$(document).ready(function(){
  Profile.fetch().then(function(profiles){
    profiles.forEach(function(profile){
      new ProfileView(profile);
    })
    new newProfileView();
  });
  Profile.fetchUnfollowed().then(function(unfollows){
    unfollows.forEach(function(unfollow){
      console.log(unfollow);
      new UnfollowedProfileView(unfollow);
    })
  })
});
