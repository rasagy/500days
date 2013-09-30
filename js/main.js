//Color Pallete
// var love_colors = ["#83AF9B", "#C8C8A9", "#FE4365"];  //http://www.colourlovers.com/palette/629637/(%E2%97%95%E3%80%9D%E2%97%95)
// var love_colors = ["#028F76", "#FFEAAD", "#D14334"];    //http://www.colourlovers.com/palette/1283145/The_Way_You_Love_Me
// var love_colors = ["#7E5686", "#A5AAD9", "#BA3C3D"];    //http://www.colourlovers.com/palette/2641140/Burning_Love
var love_colors = ["#7E5686", "#A5AAD9", "#FE4365"];    //http://www.colourlovers.com/palette/2641140/Burning_Love

  //d3.csv("./data/Pi-150-v2.csv", function(data) { console.log(data); });
var w=700;
var h=700;

//Var for plotting
var delta = 50;
var xScale = w/(500+delta*2);        
var rScale=4;  //Scale for day-circles

var initDelay = 1500;  //Initial Delay before starting
var aDelay=750;  //Delay per day
var fadeDay; //Timeout for fading day text
var isAniOver = false;        

var svg=d3.select("#svg-c")
      .append("svg")
      .attr("width",w)
      .attr("height",h);

var myData;

d3.csv("./data/500-days-data.csv", function(error,data)
{
  if (error) {  
    //If error is not null, something went wrong.
    console.log(error);  //Log the error.
  } else {      
    //If no error, the file loaded correctly. Yay!
    console.log("Dataset loaded!");

    // myData = data.map(function(d) { return [ +d["Scene"], d["Day"] ]; });
    //console.log(myData);   //Log the data.
    myData=data;    
   }
 });

function generateViz() {
  setScale();
  document.getElementById('splash').style.visibility = "hidden";
  document.getElementById('info-footer').style.visibility = "visible";
  showText(0,0,"The movie starts with the Day #488, with Tom & Summer at the park…");
  //////////////////////////////////////////////////////
  ///*
  // Draw Arcs
  ///*
  var lastDay = -60;

  var arcs = svg.selectAll("path")
                .data(myData)
                .enter()
                .append("path")
                .attr({
                  d: function(d,i) {                          
                    var nextX = xPos(d.Day);
                    if(nextX>0)
                    {
                      var prevX = xPos(lastDay);
                      var r = Math.abs((nextX-prevX)/2);
                      lastDay = d.Day;
                      // console.log("M "+prevX+" "+(h/2)+" A "+r+" "+r+" 0 0 1 "+nextX+" "+(h/2));
                      return "M "+prevX+" "+(h/2)+" A "+r+" "+(r)+" 0 0 1 "+nextX+" "+(h/2);      
                    } else return "M 0 0";
                  },
                  'fill': 'none',
                  'opacity': 0.6,
                  'stroke': "rgb(10,20,40)", //250
                  'stroke-width': "2",
                  'stroke-dasharray': "0, 2500"
                })
                .transition()
                .duration(aDelay*2)
                .ease("linear")
                .delay(function(d,i) {return i*(aDelay-i*3) + initDelay;})
                .attr({  
                  'stroke': "rgb(210,220,240)",
                  'stroke-width': "4",
                  'stroke-dasharray': "2500, 0"
                })
                .transition()
                .duration(aDelay/2)
                .ease("linear")
                .delay(function(d,i) {return (i+1)*(aDelay-i*3) + initDelay;})
                .attr({  
                  'stroke-width': "1",
                  'stroke': love_colors[1]
                });
//*/
  //////////////////////////////////////////////////////
  ///*
  // Draw Circles

  var circles = svg.selectAll("circles")
                    .data(myData)
                    .enter()
                    .append("circle")
                    .attr({
                      cx: function(d, i) {
                        if(d.Day!="x")
                        {
                        // console.log(d.Day*1+5);
                        return(delta+d.Day*xScale);
                        }
                        else return 0;
                      },
                      cy: h/2,
                      r: function(d) {
                        if(d.Day!="x")
                        {
                          return 0;
                        } 
                        else return 0;
                      },  
                      fill: "rgb(200,200,200)",
                      opacity: 0.3
                    })
                    .on("mouseover", function(d) {
                            d3.select(this)
                              .attr("opacity", 0.7);
                              if(isAniOver) {
                                showFullText(d.Together*1, d.Day, d.Desc,d.Quote);
                              }
                    })
                    .on("mouseout", function() {
                            d3.select(this)
                              .attr("opacity", 0.5);
                              if(isAniOver) {
                                showText(1, 500,"(<em>Hover over the bubbles for scene description & quotes!</em>)");
                              }                                    
                    })
                    .transition()
                    .duration(aDelay*2/3)
                    .ease("linear")
                    .delay(function(d,i) {return (i)*(aDelay-i*3) + initDelay +200;})
                    .attr({
                      r: function(d,i) {
                        if(d.Day!="x")
                        {
                          setTimeout(function () {
                            showText(d.Together*1, d.Day, d.Summary);
                            console.log("Updated with: "+d.Summary+" on "+d.Day);                            
                          },(i)*(aDelay-i*3) + initDelay + 200);
                          //console.log("R for "+d.Scene+" = "+d.Scene*rScale/250+3);
                          return d.Scene*rScale/100+5;
                        } 
                        else return 0;
                      },
                      fill: function(d) {
                        return love_colors[d.Together*1+1];
                      },
                      opacity: 0.5
                    });

} //End generateViz()

function setScale() {

  svg.append("line")
      .attr({x1: delta, y1:h/2, x2: delta+500*xScale, y2:h/2, stroke: "#fafafa"});

  for(i=0; i<=10; i++) {
    svg.append("circle")
        .attr({
          cx: delta+i*xScale*50,
          cy: h/2,
          r: 1,
          fill: "rgba(50,50,50,0.3)"
        });
  }

  svg.append("text")
      .text("Day #0")
      .attr({
        x: delta-40,
        y: h/2+3,
        'font-family': "sans-serif",
        'font-size': "10px",
        'fill': "#999"
        });
  svg.append("text")
      .text("Day #250")
      .attr({
        x: delta+250*xScale-24,
        y: h/2+20,
        'font-family': "sans-serif",
        'font-size': "10px",
        'fill': "#999"
        });
  svg.append("text")
      .text("Day #500")
      .attr({
        x: delta+500*xScale+8,
        y: h/2+3,
        'font-family': "sans-serif",
        'font-size': "10px",
        'fill': "#999"
        });

////////////////////////////////////////////////////
//Legend      


  svg.append("text")
      .text("Scene Length")
      .attr({
        x: 610,
        y: h*3/4-55,
        'font-family': "Helvetica, Arial, sans-serif",
        'font-size': "14px",
        'font-style': 'italic',
        'fill': "#333"
        });

  svg.append("circle")
     .attr({
       cx: 615,
       cy: h*3/4-40,
       r: 10*rScale/100+5,
       fill: "#A5AAD9"
     });

  svg.append("text")
      .text("10 sec")
      .attr({
        x: 625,
        y: h*3/4-37,
        'font-family': "sans-serif",
        'font-size': "10px",
        'fill': "#999"
        });

  svg.append("circle")
     .attr({
       cx: 615,
       cy: h*3/4-10,
       r: 400*rScale/100+5,
       fill: "#A5AAD9"
     });

  svg.append("text")
      .text("400 sec")
      .attr({
        x: 640,
        y: h*3/4-7,
        'font-family': "sans-serif",
        'font-size': "10px",
        'fill': "#999"
        });     
}

function showFullText(t_status, t_day, t_desc, t_quote) {

  var day_c = document.getElementById('day');
  var place_c = document.getElementById('place');
  var quote_c = document.getElementById('quote');

  if(t_day>500) {
    t_day = 1;
  }
  if(quote_c.style.opacity <0.5) quote_c.style.opacity = 0.8;

  if(t_status == 1) {
    day_c.innerHTML = "<span style='color:"+love_colors[2]+"'> ❤"+t_day+"</span>";    
    quote_c.innerHTML = "<pre style='background:"+love_colors[2]+"'>"+t_quote+"</pre>";
  }
  else if(t_status == -1) {
    day_c.innerHTML = "<span style='color:"+love_colors[0]+"'> ♡"+t_day+"</span>";
    quote_c.innerHTML = "<pre style='background:"+love_colors[0]+"'>"+t_quote+"</pre>";
  } 
  else {
    day_c.innerHTML = "<span style='color:"+love_colors[1]+"'> ♡"+t_day+"</span>";
    quote_c.innerHTML = "<pre style='background:"+love_colors[1]+"'>"+t_quote+"</pre>";
  }
  
  place_c.innerHTML = "("+t_desc+")";

  clearTimeout(fadeDay);
}

function showText(t_status, t_day, t_desc) {
  var day_c = document.getElementById('day');
  var place_c = document.getElementById('place');
  var quote_c = document.getElementById('quote');

  place_c.style.opacity = 1;
  quote_c.style.opacity = 0;
  day_c.style.opacity = 1;

  clearTimeout(fadeDay);

  if(t_day>500) {
    fadeDay = setTimeout(function () { showText(1, 500, "(<em>Hover over the bubbles for scene description & quotes!</em>)"); },1500);
    isAniOver = true;
    document.getElementById('heading-c').style.opacity = 1;
  } else {
    if(t_status == 1) {
      day_c.innerHTML = "<span style='color:"+love_colors[2]+"'> ❤"+t_day+"</span>";
    }
    else if(t_status == -1) {
      day_c.innerHTML = "<span style='color:"+love_colors[0]+"'> ♡"+t_day+"</span>";
    } else {
      day_c.innerHTML = "<span style='color:"+love_colors[1]+"'> ♡"+t_day+"</span>";
    }

    if(t_desc!="x") {place_c.innerHTML = t_desc;}
    fadeDay = setTimeout(function() { document.getElementById('day').style.opacity = 0.7;}, 500);
  }
  
}

function xPos(day) {

  if(day!="x")
  {
  // console.log(day*1+5);
  // dummy=d*1;
  return(delta+day*xScale);
  }
  else return 0;      
}