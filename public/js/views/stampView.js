var StampView = function(stamp){
  this.stamp = stamp;
  this.$el = $("<div class='stamp'><form><input class='commitBox' type='textbox' placeholder='Random Commit Message'></input><button class='randomCommit'>Get Random Commit!</button></form></div>")
}

StampView.prototype = {
  getLangData:function(){
    var langSum = 0;
    var langArray = d3.entries(this.stamp.data.langTotals)
      .map(function(d){
        langSum += d.value;
        return d;
      })
    langArray.map(function(d){
      var v = d.value;
      d.value = {
        total: v,
        avg: v/langSum*100
      }
      return d;
    })
    langArray.sort(function(b,a){return a.value.total-b.value.total})
    return {langArray:langArray,langSum:langSum};
  },
  makeScale:function(domainMax,rangeMax){
    return d3.scale.linear().domain([0,domainMax]).range([0,rangeMax])
  },
  makeStampSvg:function(stampsDiv){
    return d3.select(stampsDiv[0]).append('svg').attr('height',400).attr('width',500);
  },
  makeLangComposite:function(g,langArray,langSum){
    var xScale = this.makeScale(langSum,500);
    g.selectAll('rect').data(langArray).enter().append('rect')
      .attr('transform',function(d,i){
        var offset = 0;
        for (var b=0;b<i;b++){
          offset += xScale(langArray[b].value.total);
        }
        return 'translate('+offset+',0)'
      })
      .style('height',20)
      .style('width',function(d){
        var w = xScale(d.value.total);
        return w;
      })
      .style('fill',function(d){
        return githubColors[d.key];
      })
      .on("mouseover",langHover)
      .on("mousemove",langHover)
      .on("mouseleave",langUnhover);
  },
  getRepoLangData:function(){
    var data = d3.entries(this.stamp.data.languages)
      .map(function(d){
        var values = d3.entries(d.value).filter(function(a){return a.key!=='meta'})
          .sort(function(a,b){return a.value - b.value})
        return {
          key: d.key,
          meta: d.value.meta,
          value: values
        }
      });
    var repoMax = 0;
    var repoLangs = data
      .filter(function(d){return d.value.length>0})
      .sort(function(a,b){
        return Date.parse(a.meta['last-modified']) - Date.parse(b.meta['last-modified'])
      })
    repoLangs.forEach(function(repo){
      var thisSum = 0;
      for (var i=0;i<repo.value.length;i++){
        thisSum+=repo.value[i].value;
      }
      if(thisSum > repoMax){repoMax = thisSum}
    });
    return {repoLangs:repoLangs, repoMax:repoMax};
  },
  makeRepoComposite:function(g,data,repoMax){
    var xScale = this.makeScale(data.length,500);
    var yScale = this.makeScale(repoMax,300);
    var w = 500/data.length;
    var repos = g.selectAll('.repo').data(data).enter().append('g').attr('class','repo')
      .attr('transform',function(d,i){return 'translate('+xScale(i)+',0)'});
    repos.selectAll('rect').data(function(d){return d.value}).enter().append('rect')
      .attr('height',function(d){
        return yScale(d.value)
      })
      .attr('width',w)
      .attr('transform',function(d,i){
        var vals = d3.select(this.parentNode).datum().value;
        var offset = 0;
        for (var b=0;b<i;b++){
          offset += yScale(vals[b].value);
        }
        return 'translate(0,'+(300-offset-yScale(d.value))+')'
      })
      .style('fill',function(d){return githubColors[d.key]})
      .on("mouseover",repoHover)
      .on("mousemove",repoHover)
      .on("mouseleave",repoUnhover);
  },
  render: function(stampsDiv){
    var self = this;
    var svg = this.makeStampSvg(stampsDiv);
    var langSummary = this.getLangData();
    var langArray = langSummary.langArray;
    var langSum = langSummary.langSum;
    var langComposite = svg.append('g').attr('class','languageComposite')
      .attr('transform','translate(0,20)');

    var repoSummary = this.getRepoLangData();
    var repoLangs = repoSummary.repoLangs;
    var repoMax = repoSummary.repoMax;
    var langRepos = svg.append('g').attr('class','languageRepos')
      .attr('transform','translate(0,60)');
    this.makeLangComposite(langComposite,langArray,langSum);
    this.makeRepoComposite(langRepos,repoLangs,repoMax);

    var randomCommitButton = this.$el.find('.randomCommit');
    randomCommitButton.on("click", function(e){
      e.preventDefault();
      self.getRandomCommit();
    })


  },
  getRandomCommit:function(){
    repos = this.stamp.data.commitMessages;
    var commits = [];
    for (repo in repos){
      array = repos[repo];
      for (var i=0;i<array.length;i++){
        commits.push(array[i]);
      }
    };
    randomCommit = commits[Math.round(commits.length*Math.random(),0)];
    $('.commitBox').val(randomCommit);
  },
  makeButtons:function(stampsDiv){
    // var contain = $("<div class='inputContainer'></div>");
    // contain.append('<input class='stats' type="radio" value="seasonal" id="r3"name="optradio2" checked>');
    // contain.append('<label for="r3">Year-by-Year</label>');
    // contain.append('<input class='stats' type="radio" value="cumulative" id="r4"name="optradio2">')
    // contain.append('<label for="r4">Cumulatively</label>')
    // stampsDiv.append(contain);
  }
}

function langHover(d){
  d3.select('.tooltip')
    .style('top',(d3.event.pageY+10)+"px")
    .style('left',(d3.event.pageX+10)+"px")
    .text(d.key+": "+d.value.total+ " bytes, "+d3.round(d.value.avg,2)+"%")
    .style('opacity',1)
}
function langUnhover(d){
  d3.select('.tooltip').style('opacity',0)
}
function repoHover(d){
  var repo = d3.select(this.parentNode).datum().key;
  d3.select('.tooltip')
    .style('top',(d3.event.pageY+10)+"px")
    .style('left',(d3.event.pageX+10)+"px")
    .text(repo+": "+d.key+": "+d.value+" bytes")
    .style('opacity',1)
}
function repoUnhover(d){
  d3.select('.tooltip').style('opacity',0)
}
