var ProfileView = function(profile){
  var self = this;
  this.profile = profile;
  this.$el = $("<div class='profile'>");
  this.render();
  $(".profiles").append(this.$el);
};

ProfileView.prototype = {
  render: function(){
    var self = this;
    self.$el.html(self.profileTemplate(self.profile));

    var stampsDiv = self.$el.find(".stamps");
    self.appendStamps(self.profile.stamps,stampsDiv);

    var newStamp = self.$el.find(".addStamp");
    newStamp.on("click",function(){
      self.makeNewStamp(self.profile.id,stampsDiv);
    });

    var unfollow = self.$el.find(".unfollow");
    unfollow.on("click", function(){
      self.profile.unfollow().then(function(){
        self.$el.fadeOut(500,"linear",function(){
          self.$el.remove()
        })
      })
    });
  },
  profileTemplate:function(profile){
    var html = $("<div/>")
    html.append("<h3>" + profile.username + "</h3>");
    html.append("<button class='unfollow'>Unfollow</button>")
    html.append("<button class='addStamp'>Add Stamp</button>");
    html.append("<div class='stamps'></div>");
    return(html);
  },
  appendStamps:function(stamps,stampsDiv){
    stamps.forEach(function(stamp){
      var stampView = new StampView(stamp);
      stampView.render(stampView.$el)
      stampsDiv.append(stampView.$el)
    });
  },
  makeNewStamp:function(id,stampsDiv){
    Stamp.create(id,{})
      .then(function(newStamp){
        var newStampView = new StampView(newStamp);
        newStampView.render(newStampView.$el);
        stampsDiv.append(newStampView.$el);
      })
  }
};
