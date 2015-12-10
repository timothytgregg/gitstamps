var StampView = function(stamp){
  this.stamp = stamp;
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
  makeRepoComposite:function(g){
    // console.log(this.stamp.data)
    var data = d3.entries(this.stamp.data.languages).map(function(d){return d})
    // console.log(data)
  },
  render: function(stampsDiv){
    var svg = this.makeStampSvg(stampsDiv);
    var langSummary = this.getLangData();
    var langArray = langSummary.langArray;
    var langSum = langSummary.langSum;
    var langComposite = svg.append('g').attr('class','languageComposite')
      .attr('transform','translate(0,20)');
    var langRepos = svg.append('g').attr('class','languageRepos')
      .attr('transform','translate(0,60)');
    this.makeLangComposite(langComposite,langArray,langSum);
    this.makeRepoComposite(langRepos);
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
