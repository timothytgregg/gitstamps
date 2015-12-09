var StampView = function(stamp){
  this.stamp = stamp;
}

StampView.prototype = {
  render: function(stampsDiv){
    var langTotals = this.stamp.data.langTotals;

    var langArray = [];
    var langSum = 0;
    for (lang in langTotals){
      langArray.push([lang,langTotals[lang]])
      langSum += langTotals[lang];
    }
    langArray.sort(function(b,a){return a[1]-b[1]})
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
      // .on("mouseover",langHover)
      // .on("mousemove",langHover)
      // .on("mouseleave",langUnhover);
  }
}
