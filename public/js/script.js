$(document).ready(function(){
  Profile.fetch().then(function(profiles){
    profiles.forEach(function(profile){
      profile.getLanguages()
      var view = new ProfileView(profile)
      view.render();
    })
    new newProfileView();
  });
})
