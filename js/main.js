
//Color Pallete
// var love_colors = ["#83AF9B", "#C8C8A9", "#FE4365"];	//http://www.colourlovers.com/palette/629637/(%E2%97%95%E3%80%9D%E2%97%95)
// var love_colors = ["#028F76", "#FFEAAD", "#D14334"];		//http://www.colourlovers.com/palette/1283145/The_Way_You_Love_Me
// var love_colors = ["#7E5686", "#A5AAD9", "#BA3C3D"];		//http://www.colourlovers.com/palette/2641140/Burning_Love
var love_colors = ["#7E5686", "#A5AAD9", "#FE4365"];		//http://www.colourlovers.com/palette/2641140/Burning_Love

	//d3.csv("./data/Pi-150-v2.csv", function(data) { console.log(data); });
	var w=700;
	var h=700;

	//Var for plotting
		var delta = 20;
		var xScale = w/(500+delta*2);				
		var rScale=4;	//Scale for day-circles

		var initDelay = 2000;	//Initial Delay before starting
		var aDelay=1200;	//Delay per day
		var fadeDay; //Timeout for fading day text
		var isAniOver = false;				

	var svg=d3.select("#svg-c")
				.append("svg")
				.attr("width",w)
				.attr("height",h);

	var myData;
	d3.csv("./data/500-days-data-v4.csv", function(error,data)
	{
	  if (error) {  
	  	//If error is not null, something went wrong.
  		console.log(error);  //Log the error.
    } else {      
      //If no error, the file loaded correctly. Yay!
      console.log("Dataset loaded!");
      // console.log(data[0].Scene+ " "+data[10].Day);   //Log the data.
		 	// console.log(data); 
		 	// return data; 
		 	myData = data.map(function(d) { return [ +d["Scene"], d["Day"] ]; });
		 	// console.log(myData);   //Log the data.
		 	generateViz(data);				 	
 		}
	 });



	function xPos(day) {

		if(day!="x")
		{
		// console.log(day*1+5);
		// dummy=d*1;
		return(delta+day*xScale);
		}
		else return 0;			
	}



	function generateViz(data) {				
		//////////////////////////////////////////////////////
		///*
		// Draw Arcs
///*
		var lastDay = -30;				

		var arcs = svg.selectAll("path")
									.data(data)
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
										'stroke-dasharray': "1, 3000"
									})
									.transition()
									.duration(aDelay*2)
									.ease("linear")
									.delay(function(d,i) {return i*aDelay + initDelay;})
									.attr({	
										'stroke': "rgb(210,220,240)",
										'stroke-width': "4",
										'stroke-dasharray': "3000, 1"
									})
									.transition()
									.duration(aDelay)
									.ease("linear")
									.delay(function(d,i) {return (i+1)*aDelay + initDelay;})
									.attr({	
										'stroke-width': "2",
										'opacity': 0.6,
										'stroke': love_colors[1]
									});
//*/
		//////////////////////////////////////////////////////
		///*
		// Draw Circles

		var circles = svg.selectAll("circles")
											.data(data)
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
														return 3;
													} 
													else return 0;
												},	
												fill: "rgb(200,200,200)",
												opacity: 0.3
											})
											.on("mouseover", function(d) {
											        d3.select(this)
											          .attr("opacity", 1);
											          if(isAniOver) {
											          	showFullText(d.Together*1, d.Day, d.Desc,d.Quote);
											          }
											})
											.on("mouseout", function() {
											        d3.select(this)
											          .attr("opacity", 0.7);
											          if(isAniOver) {
											          	showText(1, 530);
											          }													          
											})
											.transition()
											.duration(aDelay*2/3)
											.ease("linear")
											.delay(function(d,i) {return (i)*aDelay + initDelay +200;})
											.attr({
												r: function(d,i) {
													if(d.Day!="x")
													{
														setTimeout(function () {showText(d.Together*1, d.Day);},(i)*aDelay + initDelay + 200);
														console.log("R for "+d.Scene+" = "+d.Scene*rScale/250+3);
														return d.Scene*rScale/250+7;																
													} 
													else return 0;
												},
												fill: function(d) {
													return love_colors[d.Together*1+1];
												},
												opacity: 0.7
											});

		
		//*/
		////////////////////////////////////////////////////////
		/*
		//Add Labels

		var labels = svg.selectAll("text")
									   .data(data)
									   .enter()
									   .append("text");
		
		labels.text(function(d){
			return d.Day;
		})
		.attr("x", function(d) {			    
				if(d.Day!="x")
				{
				console.log(d.Day*1+5);
				// dummy=d*1;
				return(delta+d.Day*xScale);
				}
				else return 0;
	  })
	  .attr("y", h/2+20)
	  .attr("font-family", "sans-serif")
   	.attr("font-size", "11px")
   	.attr("fill", "blue")
   	.attr("text-anchor", "middle");
		//*/
	
	} //End generateViz()

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
			place_c.innerHTML = "("+t_desc+")";
			quote_c.innerHTML = "<pre style='background:"+love_colors[2]+"'>"+t_quote+"</pre>";
		}
		else if(t_status == -1) {
			day_c.innerHTML = "<span style='color:"+love_colors[0]+"'> ♡"+t_day+"</span>";
			place_c.innerHTML = "("+t_desc+")";
			quote_c.innerHTML = "<pre style='background:"+love_colors[0]+"'>"+t_quote+"</pre>";
		} 
		else {
			day_c.innerHTML = "<span style='color:"+love_colors[1]+"'> ♡"+t_day+"</span>";
			place_c.innerHTML = "("+t_desc+")";
			quote_c.innerHTML = "<pre style='background:"+love_colors[1]+"'>"+t_quote+"</pre>";
		}
		clearTimeout(fadeDay);
	}

	function showText(t_status, t_day) {
		var day_c = document.getElementById('day');
		var place_c = document.getElementById('place');
		var quote_c = document.getElementById('quote');

		place_c.style.opacity = 0;
		quote_c.style.opacity = 0;
		day_c.style.opacity = 1;

		if(t_day>500) {
			t_day = 1;
			place_c.style.opacity = 1;
			place_c.innerHTML = "(<em>Hover over the bubbles for scene description & quotes!</em>)"
			isAniOver = true;
			document.getElementById('heading-c').style.opacity = 1;
		}

		if(t_status == 1) {
			day_c.innerHTML = "<span style='color:"+love_colors[2]+"'> ❤"+t_day+"</span>";
		}
		else if(t_status == -1) {
			day_c.innerHTML = "<span style='color:"+love_colors[0]+"'> ♡"+t_day+"</span>";
		} else {
			day_c.innerHTML = "<span style='color:"+love_colors[1]+"'> ♡"+t_day+"</span>";
		}
		clearTimeout(fadeDay);
		fadeDay = setTimeout(function() { document.getElementById('day').style.opacity = 0.7;}, 500);
	}