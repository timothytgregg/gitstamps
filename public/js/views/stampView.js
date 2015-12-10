var StampView = function(stamp){
  this.stamp = stamp;
}

StampView.prototype = {
  getLangData:function(){
    var langTotals = this.stamp.data.langTotals;
    var langSum = 0;
    var langArray = [];
    for (lang in langTotals){
      langArray.push([lang,langTotals[lang]])
      langSum += langTotals[lang];
    }
    for (var i=0;i<langArray.length;i++){
      langArray[i].push(langArray[i][1]/langSum*100)
    }
    langArray.sort(function(b,a){return a[1]-b[1]})
    return {langArray:langArray,langSum:langSum};
  },
  makeScale:function(domainMax,rangeMax){
    return d3.scale.linear().domain([0,domainMax]).range([0,rangeMax])
  },
  makeStampSvg:function(stampsDiv){
    return d3.select(stampsDiv[0]).append('svg').attr('height',400).attr('width',500);
  },
  makeLangComposite:function(svg,langArray,langSum, g){
    var xScale = this.makeScale(langSum,500);
    g.selectAll('rect').data(langArray).enter().append('rect')
      .attr('transform',function(d,i){
        var offset = 0;
        for (var b=0;b<i;b++){
          offset += xScale(langArray[b][1]);
        }
        return 'translate('+offset+',20)'
      })
      .style('height',20)
      .style('width',function(d){
        var w = xScale(d[1]);
        return w;
      })
      .style('fill',function(d){
        return githubColors[d[0]]
      })
      .on("mouseover",langHover)
      .on("mousemove",langHover)
      .on("mouseleave",langUnhover);
  },
  render: function(stampsDiv){
    var svg = this.makeStampSvg(stampsDiv);
    var langSummary = this.getLangData();
    var langArray = langSummary.langArray;
    var langSum = langSummary.langSum;
    var langComposite = svg.append('g').attr('class','languageComposite');
    this.makeLangComposite(svg,langArray,langSum,langComposite);
  }
}

function langHover(d){
  d3.select('.tooltip')
    .style('top',(d3.event.pageY+10)+"px")
    .style('left',(d3.event.pageX+10)+"px")
    .text(d[0]+": "+d[1]+ " bytes, "+d3.round(d[2],2)+"%")
    .style('opacity',1)
}
function langUnhover(d){
  d3.select('.tooltip').style('opacity',0)
}
