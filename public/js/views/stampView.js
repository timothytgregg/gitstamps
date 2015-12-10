var StampView = function(stamp){
  this.stamp = stamp;
  this.$el = $("<div class='stamp'><button class='randomCommit'>Get Random Commit</button></div>")
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
  makeScale:function(domainMax,rangeMax,direction){
    var scale = d3.scale.linear();
    if (direction == 'asc'){
      scale.domain([0,domainMax]).range([0,rangeMax])
    }else{
      scale.domain([0,domainMax]).range([rangeMax,0])
    }
    return scale;
  },
  makeStampSvg:function(stampsDiv){
    return d3.select(stampsDiv[0]).append('svg').attr('height',400).attr('width',500);
  },
  makeLangComposite:function(svg,langArray,langSum){
    var xScale = this.makeScale(langSum,500,'asc');
    var g = svg.append('g').attr('transform','translate(0,20)')
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
  makeRepoComposite:function(svg,data,repoMax){
    var xScale = this.makeScale(data.length,450,'asc');
    var yScale = this.makeScale(repoMax,300,'asc');
    var yAxisScale = this.makeScale(repoMax,300,'desc')
    var w = 450/data.length;

    var yAxis = d3.svg.axis().orient('left').scale(yAxisScale)
      .tickFormat(d3.format('s'));
    svg.append('svg:g').attr('class','yaxis').call(yAxis)
      .attr('transform','translate(45,50)')

    var repos = svg.selectAll('.repo').data(data).enter().append('g').attr('class','repo')
      .attr('transform',function(d,i){return 'translate('+(xScale(i)+50)+',0)'});
    repos.selectAll('rect').data(function(d){return d.value}).enter().append('rect')
      .attr('height',function(d){
        return yScale(d.value)
      })
      .attr('width',w)
      .attr('transform',function(d,i){
        var vals = d3.select(this.parentNode).datum().value;
        var offset = (-50);
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

    var langSummary = this.getLangData();
    var langArray = langSummary.langArray;
    var langSum = langSummary.langSum;
    var langSvg = d3.select(stampsDiv[0]).append('svg').attr('class','languageComposite')
      .attr('height',60).attr('width',500);

    var repoSummary = this.getRepoLangData();
    var repoLangs = repoSummary.repoLangs;
    var repoMax = repoSummary.repoMax;
    var repoSvg = d3.select(stampsDiv[0]).append('svg').attr('class','languageRepos')
      .attr('height',400).attr('width',500);

    this.makeLangComposite(langSvg,langArray,langSum);
    this.makeRepoComposite(repoSvg,repoLangs,repoMax);
    this.makeChartButtons(stampsDiv);

    var randomCommitBtn = this.$el.find('.randomCommit');
    randomCommitBtn.on("click", function(e){
      e.preventDefault();
      self.getRandomCommit();
    });

    var chartInputs = this.$el.find('input[name=chartFields]');
    chartInputs.on("change", function(e){
      e.preventDefault();
      self.transitionRepoComposite(this.value, repoSvg,repoMax);
    });
  },
  transitionRepoComposite:function(field, svg, repoMax){
    var max = (field=='percent')?1:repoMax;
    var yScale = this.makeScale(max,300,'asc');
    var yAxisScale = this.makeScale(max,300,'desc');
    var tickFormat = (field=='percent')?'p':'s';
    var yAxis = d3.svg.axis().orient('left').scale(yAxisScale)
      .tickFormat(d3.format(tickFormat));
    svg.select('.yaxis').transition().duration(500).call(yAxis);
    var repos = svg.selectAll('.repo');
    repos.selectAll('rect').transition().duration(500)
      .style('height',function(d){
        var vals = d3.select(this.parentNode).datum().value;
        var sum = d3.sum(vals, function(d) { return d.value; });
        var val = (field=='percent')?d.value/sum:d.value;
        var h = (field=='percent')?yScale(d.value/sum):yScale(d.value);
        return h;
      })
      .attr('transform',function(d,i){
        var vals = d3.select(this.parentNode).datum().value;
        var sum = d3.sum(vals, function(d) { return d.value; });
        var offset = (-50);
        for (var b=0;b<i;b++){
          var off = (field=='percent')?yScale(vals[b].value/sum):yScale(vals[b].value);
          offset += off;
        }
        var h = (field=='percent')?yScale(d.value/sum):yScale(d.value);
        return 'translate(0,'+(300-offset-h)+')'
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
    alert(randomCommit);
  },
  makeChartButtons:function(stampsDiv){
    var btnForm = $("<form/>");
    var btnFieldset = $("<fieldset/>");
    btnFieldset.append('<input type="radio" value="bytes" name="chartFields" checked>');
    btnFieldset.append('<label for="input-bytes">Bytes</label>');
    btnFieldset.append('<input type="radio" value="percent" name="chartFields">')
    btnFieldset.append('<label for="input-percent">Percentage</label>');
    btnForm.append(btnFieldset);
    stampsDiv.append(btnForm);
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
