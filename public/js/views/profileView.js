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
    self.appendStamp(self.profile.stamps,stampsDiv);

    if(stampsDiv.children().length === 0){
      self.makeNewStamp(self.profile.id, stampsDiv)
    }

    var newStamp = self.$el.find(".addStamp");
    newStamp.on("click",function(){
      self.makeNewStamp(self.profile.id,stampsDiv);
    });

    var randomCommit = self.$el.find(".randomCommit");
    randomCommit.on("click", function(){
      self.getRandomCommit(self.profile.id)
    })

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
    if (profile.imageURL){
      html.append("<img class='profileIMG' src="+profile.imageURL+"></img>")
    }
    html.append("<button class='unfollow'>Unfollow</button>")
    html.append("<button class='addStamp'>Add Stamp</button>");
    html.append("<div class='stamps'></div>");
    return(html);
  },
  appendStamp:function(stamps,stampsDiv){
    if(stamps.length){
      var stamp = stamps.reduce(function(previous, current, index, array){
        if (Date.parse(current.createdAt) > Date.parse(previous.createdAt)){
          return current
        }else{
          return previous
        }
      })
      var stampView = new StampView(stamp)
      stampView.render(stampView.$el)
      stampsDiv.append(stampView.$el)
    }
  },
  makeNewStamp:function(id,stampsDiv){
    Stamp.create(id,{})
      .then(function(newStamp){
        var newStampView = new StampView(newStamp);
        newStampView.render(newStampView.$el);
        stampsDiv.append(newStampView.$el);
      })
  },
  getRandomCommit:function(id){
    console.log(this.$el.find('.stamps'));
    //takes in profile ID
    //finds all commit messages,
    //grabs one random commit message,
    //displays to page
    //  appends div
  }
};
