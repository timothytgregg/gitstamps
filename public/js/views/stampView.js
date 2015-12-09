var StampView = function(stamp){
  this.stamp = stamp;
}

StampView.prototype = {
  getLangSummary:function(){
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
  render: function(stampsDiv){
    var langSummary = this.getLangSummary();
    var langArray = langSummary.langArray;
    var langSum = langSummary.langSum;
    //get sum of total languages
    var xScale = d3.scale.linear().domain([0,langSum]).range([0,500])
    var el = $("<svg/>")[0];
    var svg = d3.select(stampsDiv[0]).append('svg').attr('height',60).attr('width',500);
    var g = svg.append('g').attr('class','group')
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
  }
}

function langHover(d){
  d3.select('.tooltip')
    .style('top',(d3.event.pageY+10)+"px")
    .style('left',(d3.event.pageX+10)+"px")
    .text(d[0]+": "+d[1]+ " bytes, "+d3.round(d[2],2)+"%")
    .transition().duration(500).style('opacity',1)
}
function langUnhover(d){
  d3.select('.tooltip').transition().duration(500).style('opacity',0)
}
