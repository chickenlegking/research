$(function(){

	var modes = [true, false, false]; // nmode, mgmode, and wamode
	var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

	var currZoom = 15;
    var center = ol.proj.fromLonLat([-88.227166, 40.108813]);

    var twitStyle = new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: '#4271AE'
            }),
            stroke: new ol.style.Stroke({
                color: '#000000',
                width: 2
            }),
            radius: 7
        })
    });

    var yelpStyle = new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: '#FF0000'
            }),
            stroke: new ol.style.Stroke({
                color: '#000000',
                width: 2
            }),
            radius: 7
        })
    });

    var normalstyle = {
    	'Polygon': [new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255,255,255,0)'
            }),
            stroke: new ol.style.Stroke({
                width: 1,
                color: 'rgba(255,255,0,0)'
            })
        })],
    	'Point': [new ol.style.Style({
            image: new ol.style.Circle({
                fill: new ol.style.Fill({ 
                    color: 'rgba(255,255,255,0)'
                }),
                stroke: new ol.style.Stroke({ 
                    color: 'rgba(0,0,0,1)'
                }),
                radius: 5
            })
        })]
    }

    var uiucGEOJSON = new ol.layer.Image({
        name: 'uiuc',
        source: new ol.source.ImageVector({
            source: new ol.source.Vector({
                url: 'data/uiuc.geojson',
                format: new ol.format.GeoJSON({
                    defaultDataProjection :'EPSG:4326', 
                    projection: 'EPSG:3857'
                })
            }),
            style: function(feature, resolution){
            	if (feature.get("natural") !== "tree"){
	                var geom = feature.getGeometry().getType();
	                return normalstyle[geom];
            	}
            }         
        })
    });

    var statestyles = {
	    'Polygon': [new ol.style.Style({
	        fill: new ol.style.Fill({
	            color: 'rgba(0,0,255,0)'
	        }),
	        stroke: new ol.style.Stroke({
	            color: '#00f',
	            width: 1
	        })
	    })],
	    'MultiPolygon': [new ol.style.Style({
	        fill: new ol.style.Fill({
	            color: 'rgba(0,0,255,0)'
	        }),
	        stroke: new ol.style.Stroke({
	            color: '#00f',
	            width: 1
	        })
	    })]
	};

	var citystyles = {
	    'Polygon': [new ol.style.Style({
	        fill: new ol.style.Fill({
	            color: 'rgba(128,0,128,0)'
	        }),
	        stroke: new ol.style.Stroke({
	            color: '#800080',
	            width: 1
	        })
	    })],
	    'MultiPolygon': [new ol.style.Style({
	        fill: new ol.style.Fill({
	            color: 'rgba(128,0,128,0)'
	        }),
	        stroke: new ol.style.Stroke({
	            color: '#800080',
	            width: 1
	        })
	    })]
	};

	var countystyles = {
	    'Polygon': [new ol.style.Style({
	        fill: new ol.style.Fill({
	            color: 'rgba(0,128,0,0)'
	        }),
	        stroke: new ol.style.Stroke({
	            color: '#008000',
	            width: 1
	        })
	    })],
	    'MultiPolygon': [new ol.style.Style({
	        fill: new ol.style.Fill({
	            color: 'rgba(0,128,0,0)'
	        }),
	        stroke: new ol.style.Stroke({
	            color: '#008000',
	            width: 1
	        })
	    })]
	};

    var statesGEOJSON = new ol.layer.Image({
        name: 'states',
        source: new ol.source.ImageVector({
            source: new ol.source.Vector({
                url: 'data/US_states.geojson',
                format: new ol.format.GeoJSON({
                    defaultDataProjection :'EPSG:4326', 
                    projection: 'EPSG:3857'
                })
            }),
            style: function(feature, resolution){
	            var geom = feature.getGeometry().getType();
	            return statestyles[geom];
            }         
        })
    });

    var cityGEOJSON = new ol.layer.Image({
        name: 'cities',
        source: new ol.source.ImageVector({
            source: new ol.source.Vector({
                url: 'data/US_cities.geojson',
                format: new ol.format.GeoJSON({
                    defaultDataProjection :'EPSG:4326', 
                    projection: 'EPSG:3857'
                })
            }),
            style: function(feature, resolution){
	            var geom = feature.getGeometry().getType();
	            return citystyles[geom];
            }         
        })
    });

    var countiesGEOJSON = new ol.layer.Image({
        name: 'counties',
        source: new ol.source.ImageVector({
            source: new ol.source.Vector({
                url: 'data/US_counties.geojson',
                format: new ol.format.GeoJSON({
                    defaultDataProjection :'EPSG:4326', 
                    projection: 'EPSG:3857'
                })
            }),
            style: function(feature, resolution){
	            var geom = feature.getGeometry().getType();
	            return countystyles[geom];
            }         
        })
    });

	var statehighlightstyles = {
	    'Polygon': [new ol.style.Style({
	        fill: new ol.style.Fill({
	            color: 'rgba(0,0,255,0.3)'
	        }),
	        stroke: new ol.style.Stroke({
	            color: '#00f',
	            width: 1
	        })
	    })],
	    'MultiPolygon': [new ol.style.Style({
	        fill: new ol.style.Fill({
	            color: 'rgba(0,0,255,0.3)'
	        }),
	        stroke: new ol.style.Stroke({
	            color: '#00f',
	            width: 1
	        })
	    })]
	};

	var cityhighlightstyles = {
	    'Polygon': [new ol.style.Style({
	        fill: new ol.style.Fill({
	            color: 'rgba(128,0,128,0.3)'
	        }),
	        stroke: new ol.style.Stroke({
	            color: '#800080',
	            width: 1
	        })
	    })],
	    'MultiPolygon': [new ol.style.Style({
	        fill: new ol.style.Fill({
	            color: 'rgba(128,0,128,0.3)'
	        }),
	        stroke: new ol.style.Stroke({
	            color: '#800080',
	            width: 1
	        })
	    })]
	};

	var countyhighlightstyles = {
	    'Polygon': [new ol.style.Style({
	        fill: new ol.style.Fill({
	            color: 'rgba(0,128,0,0.3)'
	        }),
	        stroke: new ol.style.Stroke({
	            color: '#008000',
	            width: 1
	        })
	    })],
	    'MultiPolygon': [new ol.style.Style({
	        fill: new ol.style.Fill({
	            color: 'rgba(0,128,0,0.3)'
	        }),
	        stroke: new ol.style.Stroke({
	            color: '#008000',
	            width: 1
	        })
	    })]
	};

	var highlightstyles = {
	    'Point': [new ol.style.Style({
	        image: new ol.style.Circle({
	            fill: new ol.style.Fill({ 
	                color: 'rgba(255,0,0,0.3)'
	            }),
	            stroke: new ol.style.Stroke({ 
	                color: '#f00'
	            }),
	            radius: 5
	        })
	    })],
	    'Polygon': [new ol.style.Style({
	        fill: new ol.style.Fill({
	            color: 'rgba(255,0,0,0.3)'
	        }),
	        stroke: new ol.style.Stroke({
	            color: '#f00',
	            width: 1
	        })
	    })]
	};

	var imagery = new ol.layer.Tile({ source: new ol.source.OSM() })

    var map = new ol.Map({      
        layers: [imagery, uiucGEOJSON],
        target: document.getElementById('map'),
        view: new ol.View({
            center: center,
            zoom: currZoom
        })
    });

    var socket = io.connect();
	var viewportLonlatBound = ol.proj.transformExtent(map.getView().calculateExtent(map.getSize()), 'EPSG:3857', 'EPSG:4326');
	var viewportMileBound = getDistFromLon(viewportLonlatBound[0], viewportLonlatBound[2]);
	var canvasRadiusUnit = viewportWidth / viewportMileBound;
	var canvasRadius = $('#magnifying-glass-radius').val() * canvasRadiusUnit;

	$('.dropdown').on('show.bs.dropdown', function(e) {
		$(this).find('.dropdown-menu').first().stop(true, true).slideDown();
	});
	$('.dropdown').on('hide.bs.dropdown', function(e) {
		$(this).find('.dropdown-menu').first().stop(true, true).slideUp();
	});
	$('#tmg').on('click', function(e) {
		$('#tmg').addClass('active');
		$('#bmg').removeClass('active');
		$('#ymg').removeClass('active');
		socket.emit('preload_mag', {bound: viewportLonlatBound, type: 'tweet'});	
	});
	$('#bmg').on('click', function() {
		$('#tmg').removeClass('active');
		$('#bmg').addClass('active');
		$('#ymg').removeClass('active');
		socket.emit('preload_mag', {bound: viewportLonlatBound, type: 'both'});	
	});
	$('#ymg').on('click', function() {
		$('#tmg').removeClass('active');
		$('#bmg').removeClass('active');
		$('#ymg').addClass('active');
		socket.emit('preload_mag', {bound: viewportLonlatBound, type: 'yelp'});	
	});
	$('#twm').on('click', function(e) {
		$('#twm').addClass('active');
		$('#bwm').removeClass('active');
		$('#ywm').removeClass('active');
		socket.emit('preload_wm', {bound: viewportLonlatBound, type: 'twitter'});
	});
	$('#bwm').on('click', function() {
		$('#twm').removeClass('active');
		$('#bwm').addClass('active');
		$('#ywm').removeClass('active');
		socket.emit('preload_wm', {bound: viewportLonlatBound, type: 'both'});
	});
	$('#ywm').on('click', function() {
		$('#twm').removeClass('active');
		$('#bwm').removeClass('active');
		$('#ywm').addClass('active');
		socket.emit('preload_wm', {bound: viewportLonlatBound, type: 'yelp'});
	});

	$('.dropdown-submenu button.submenu-trigger').on("click", function(e){
		e.stopPropagation();
		e.preventDefault();
		let modesObj = [$('#n-mode'), $('#mg-mode'), $('#wa-mode')];
		for (let i in modes) {
			if (modesObj[i][0] === $(this)[0]) {
				$(this).next('ul').toggle();
				$(this).addClass('active');
				modes[i] = true;
				if (i == 1) {
					if ($('#bmg').hasClass('active')) {	
		            	socket.emit('preload_mag', {bound: viewportLonlatBound, type: 'both'});
		            } else if ($('#tmg').hasClass('active')) {
		            	socket.emit('preload_mag', {bound: viewportLonlatBound, type: 'tweet'});
		            } else if ($('#ymg').hasClass('active')) {
						socket.emit('preload_mag', {bound: viewportLonlatBound, type: 'yelp'});		            
					}
		        }
		        else if (i == 2) {
		        	if ($('#bwm').hasClass('active')) {	
		            	socket.emit('preload_wm', {bound: viewportLonlatBound, type: 'both'});
		            } else if ($('#twm').hasClass('active')) {
		            	socket.emit('preload_wm', {bound: viewportLonlatBound, type: 'twitter'});
		            } else if ($('#ywm').hasClass('active')) {
						socket.emit('preload_wm', {bound: viewportLonlatBound, type: 'yelp'});		            
					}
		        }
			} else {
				if (modes[i]) {
					if (modesObj[i].next('ul').css('display') === 'block') {
						modesObj[i].next('ul').toggle();
					}
					modesObj[i].removeClass('active');
					modes[i] = false;
				}
			}
		}
	});

	$(window).resize(function()	{
		viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	});

    map.on("moveend", function(){
    	viewportLonlatBound = ol.proj.transformExtent(map.getView().calculateExtent(map.getSize()), 'EPSG:3857', 'EPSG:4326');
    	viewportMileBound = getDistFromLon(viewportLonlatBound[0], viewportLonlatBound[2]);
    	canvasRadiusUnit = viewportWidth / viewportMileBound;
		console.log(viewportLonlatBound);
    	var newZoom = map.getView().getZoom();
		//state
		if (newZoom <= 7 && currZoom > 7){
			switchGEOJSON(statesGEOJSON, "states");
			currZoom = newZoom-1;
		}
		//county
		else if (newZoom <= 10 && newZoom > 7 && (currZoom > 10 || currZoom <= 7)){
			switchGEOJSON(countiesGEOJSON, "counties");
			currZoom = newZoom;
		}
		//city
		else if (newZoom > 10 && newZoom <= 13 && (currZoom <= 10 || currZoom > 13)){
			switchGEOJSON(cityGEOJSON, "cities");
			currZoom = newZoom;
		}
		//uiuc
		else if (newZoom > 13 && currZoom <= 13){
			switchGEOJSON(uiucGEOJSON, "uiuc");
			currZoom = newZoom+1;
		}

		// Preload background samples
		if (modes[1]) {
			if ($('#bmg').hasClass('active')) {	
            	socket.emit('preload_mag', {bound: viewportLonlatBound, type: 'both'});
            } else if ($('#tmg').hasClass('active')) {
            	socket.emit('preload_mag', {bound: viewportLonlatBound, type: 'tweet'});
            } else if ($('#ymg').hasClass('active')) {
				socket.emit('preload_mag', {bound: viewportLonlatBound, type: 'yelp'});		            
			}
		}
		else if (modes[2]) {
			console.log(modes[2]);
			if ($('#bwm').hasClass('active')) {	
            	socket.emit('preload_wm', {bound: viewportLonlatBound, type: 'both'});
            } else if ($('#twm').hasClass('active')) {
            	socket.emit('preload_wm', {bound: viewportLonlatBound, type: 'twitter'});
            } else if ($('#ywm').hasClass('active')) {
				socket.emit('preload_wm', {bound: viewportLonlatBound, type: 'yelp'});		            
			}
		}
	});

    var uiucOverlay = new ol.layer.Vector({
	    source: new ol.source.Vector(),
	    map: map,
	    style: function(feature, resolution){
	        var geom = feature.getGeometry().getType();
	        console.log(geom);
	        return highlightstyles[geom];
	    },
	    renderers: ["Canvas", "SVG", "VML"]
	});

	var statesOverlay = new ol.layer.Vector({
	    source: new ol.source.Vector(),
	    map: map,
	    style: function(feature, resolution){
	        var geom = feature.getGeometry().getType();
	        console.log(geom);
	        return statehighlightstyles[geom];
	    },
	    renderers: ["Canvas", "SVG", "VML"]
	});

	var citiesOverlay = new ol.layer.Vector({
	    source: new ol.source.Vector(),
	    map: map,
	    style: function(feature, resolution){
	        var geom = feature.getGeometry().getType();
	        console.log(geom);
	        return cityhighlightstyles[geom];
	    },
	    renderers: ["Canvas", "SVG", "VML"]
	});


	var countiesOverlay = new ol.layer.Vector({
	    source: new ol.source.Vector(),
	    map: map,
	    style: function(feature, resolution){
	        var geom = feature.getGeometry().getType();
	        console.log(geom);
	        return countyhighlightstyles[geom];
	    },
	    renderers: ["Canvas", "SVG", "VML"]
	});

    var uiuchighlight, statehighlight, countyhighlight, cityhighlight;
    var displayFeatureInfo = function(pixel) {

    	var uiucFlag = false, statesFlag = false, countiesFlag = false, citiesFlag = false;

    	var currLayers = map.getLayers();
    	currLayers.forEach(function(item){
    		if (item.get('name') === 'uiuc') uiucFlag = true;
    		else if (item.get('name') === 'states') statesFlag = true;
    		else if (item.get('name') === 'counties') countiesFlag = true;
    		else if (item.get('name') === 'cities') citiesFlag = true;
    	});

    	var info = document.getElementById('info');

    	if (uiucFlag){

    		cleanUpDisplay();

	        var featurePolygon = map.forEachFeatureAtPixel(pixel, function(feature) {
	        	if (feature.getGeometry().getType() === 'Polygon') return feature;
	        });

	        var featurePoint = map.forEachFeatureAtPixel(pixel, function(feature) {
	        	if (feature.getGeometry().getType() === 'Point') return feature;
	        });

	        if (featurePoint){
	        	info.innerHTML = featurePoint.getId() + ': ' + featurePoint.get('name');
	        	if (featurePoint !== uiuchighlight) {
					if (uiuchighlight) {
						uiucOverlay.getSource().removeFeature(uiuchighlight);
					}
					if (featurePoint) {
						uiucOverlay.getSource().addFeature(featurePoint);
					}
					uiuchighlight = featurePoint;
		        }

	        }
	        else if (featurePolygon){
	        	info.innerHTML = featurePolygon.getId() + ': ' + featurePolygon.get('name');
	        	if (featurePolygon !== uiuchighlight) {
					if (uiuchighlight) {
						uiucOverlay.getSource().removeFeature(uiuchighlight);
					}
					if (featurePolygon) {
						uiucOverlay.getSource().addFeature(featurePolygon);
					}
					uiuchighlight = featurePolygon;
		        }
	        } 
	        else info.innerHTML = '&nbsp;';
	    }

	    if (countiesFlag){

	    	var featureCounty = map.forEachFeatureAtPixel(pixel, function(feature) {
	        	return feature;
	        });

	        cleanUpDisplay();

	        if (featureCounty){

	        	info.innerHTML = featureCounty.get('GEO_ID') + ': ' + featureCounty.get('NAME');

	        	if (featureCounty !== countyhighlight){
		        	if (countyhighlight) {
						countiesOverlay.getSource().removeFeature(countyhighlight);
					}
					if (featureCounty) {
						countiesOverlay.getSource().addFeature(featureCounty);
					}
					countyhighlight = featureCounty;
		        }
	        }
	        else info.innerHTML = '&nbsp;';
	    }

	    if (statesFlag){

	    	var featureState = map.forEachFeatureAtPixel(pixel, function(feature) {
	        	return feature;
	        });

	        cleanUpDisplay();

	        if (featureState){

	        	info.innerHTML = featureState.get('GEO_ID') + ': ' + featureState.get('NAME');

	        	if (featureState !== statehighlight){
		        	if (statehighlight) {
						statesOverlay.getSource().removeFeature(statehighlight);
					}
					if (featureState) {
						statesOverlay.getSource().addFeature(featureState);
					}
					statehighlight = featureState;
		        }
	        }
	        else info.innerHTML = '&nbsp;';
	    }

	    if (citiesFlag){

	    	var featureCity = map.forEachFeatureAtPixel(pixel, function(feature) {
	        	return feature;
	        });

	    	cleanUpDisplay();

	    	if (featureCity){

	    		info.innerHTML = featureCity.getId() + ': ' + featureCity.get('city');

	    		if (featureCity !== cityhighlight){
		        	if (cityhighlight) {
						citiesOverlay.getSource().removeFeature(cityhighlight);
					}
					if (featureCity) {
						citiesOverlay.getSource().addFeature(featureCity);
					}
					cityhighlight = featureCity;
		        }
	        }
	        else info.innerHTML = '&nbsp;';
	    }
    };

    var element = document.getElementById('popup');
	var popup = new ol.Overlay({
	    element: element,
	    positioning: 'bottom-center',
	    stopEvent: false
	});
	map.addOverlay(popup);
	var displayPopup = function(pixel, lonlat) {
	    var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
	        return feature;
	    });
	    if (modes[0] && feature) {
	        $(element).popover('destroy');
	        var geometry = feature.getGeometry();
	        var coord = geometry.getCoordinates();
	        popup.setPosition(coord);
	        $(element).popover({
				'placement': 'top',
				'html': true,
				'title': feature.get('name'),
				'content': '<div id="wordcloud" style="position:relative; height:400px; width:400px;"></div>'
		    });
		    $(element).popover('show');

	        var queryName;
	    	if (feature.get('name')) queryName = feature.get('name');
	    	if (feature.get('NAME')) queryName = feature.get('NAME');
	    	var queryID = feature.get('GEO_ID');
	    	var queryGeo = feature.get('geometry').getCoordinates();
	        var queryType = feature.get('geometry').getType();
	        if (queryType === 'Point'){
	            queryGeo = ol.proj.transform(queryGeo, 'EPSG:3857', 'EPSG:4326');
	        }
	        else{
	            for (var i in queryGeo){
	                for (var j in queryGeo[i]){
	                    queryGeo[i][j] = ol.proj.transform(queryGeo[i][j], 'EPSG:3857', 'EPSG:4326');
	                }
	            }
	        }
	    	
			var uiucFlag = false, statesFlag = false, countiesFlag = false, citiesFlag = false;

	    	var currLayers = map.getLayers();
	    	currLayers.forEach(function(item){
	    		if (item.get('name') === 'uiuc') uiucFlag = true;
	    		else if (item.get('name') === 'states') statesFlag = true;
	    		else if (item.get('name') === 'counties') countiesFlag = true;
	    		else if (item.get('name') === 'cities') citiesFlag = true;
	    	});

	        if (uiucFlag) socket.emit('location', {id: queryName, area: queryGeo, type: queryType, bound: viewportLonlatBound});
	        if (countiesFlag) socket.emit('county_info', {id: queryID, bound: viewportLonlatBound});

	        socket.on('yelp_location_results', function(data){
	            if (data.statusCode === 400) {
	                popup.attr('title', feature.get('name'));
	            }
	            else{
	                if (data.availability){
						WordCloud(document.getElementById("cloud"), {list: data.list}); 
						WordCloud(document.getElementById("wordcloud"), {list: data.list});
	                }
	                else{
	                    $(element).attr('data-title', "No information available");
	                }
	            }
	        });

	    } else if (modes[2]) {
	        popup.setPosition(map.getCoordinateFromPixel(pixel));
	        $(element).popover({
				'placement': 'top',
				'html': true,
				'title': "What's interesting in the area",
				'content': '<div id="wordcloud" style="position:relative; height:400px; width:400px;"></div>'
		    });
		    $(element).popover('show');

		    if ($('#bwm').hasClass('active')) {	
            	socket.emit('wander', {bound: viewportLonlatBound, center: lonlat, type: 'both'});
            } else if ($('#twm').hasClass('active')) {
            	socket.emit('wander', {bound: viewportLonlatBound, center: lonlat, type: 'twitter'});
            } else if ($('#ywm').hasClass('active')) {
            	socket.emit('wander', {bound: viewportLonlatBound, center: lonlat, type: 'yelp'});
            }

            socket.on('wander_result', function(data){
		    	if (data.statusCode === 400) {
		            $('#yelp-info-side').html(feature.get('NAME'));
		        }
		        else{
		            if (data.availability){
		                $('#yelp-info-side').html('<p>Wandering Around Mode</p>');
		                $('#yelp-info-side').append('<div id="wordcloud" style="position:relative; height:400px; width:100%;"></div>');
						WordCloud(document.getElementById("wordcloud"), {list: data.list});
						WordCloud(document.getElementById("cloud"), {list: data.list});
						console.log("rendering"); 
		            }
		            else{
		                $('#yelp-info-side').html('<p>No information about this place.</p>');
		            }
		        }
		    });
	    }
	    else {
	        $(element).popover('destroy');
	    }
	};

	var thread;
    map.on('pointermove', function(evt) {
        if (evt.dragging) {
        	$(element).popover('destroy');
        	return;
        }
        $(element).popover('destroy');
        clearTimeout(thread);
        var pixel = map.getEventPixel(evt.originalEvent);
        displayFeatureInfo(pixel);
        thread = setTimeout(mousestopped, 1000);

        function mousestopped() {
        	pixel = map.getEventPixel(evt.originalEvent);
        	var lonlat = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');				        
	        displayPopup(pixel, lonlat);
		}        

        var hit = map.hasFeatureAtPixel(pixel);
        map.getTarget().style.cursor = hit ? 'pointer' : '';
    });

	imagery.on('postcompose', function(event) {
    	if (!modes[1]) return;
		let canvas = event.context.canvas, ctx = canvas.getContext("2d");
		function update() {
			ctx.beginPath();
			ctx.arc(mouseX, mouseY, canvasRadius, 0, 2 * Math.PI, true);
			ctx.strokeStyle = 'black';
      		ctx.stroke();
			requestAnimationFrame(update);
		}
		update();
		function getPosition(el) {
			var xPosition = 0;
			var yPosition = 0;

			while (el) {
				xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
				yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
				el = el.offsetParent;
			}
			return {
				x: xPosition,
				y: yPosition
			};
		}
		var canvasPos = getPosition(canvas);
		var mouseX = 0;
		var mouseY = 0;
		canvas.addEventListener("mousemove", setMousePosition, false);
		function setMousePosition(e) {
			if (!modes[1]) return;
			canvasRadius = $('#magnifying-glass-radius').val() * canvasRadiusUnit;
			mouseX = e.clientX - canvasPos.x;
			mouseY = e.clientY - canvasPos.y;
		}
	});

    map.on('singleclick', function(evt) {
    	if (modes[0]){
	        var feature = map.forEachFeatureAtPixel(evt.pixel,
	            function(feature) {
	                return feature;
	            });
	        
	        if (feature) {
	            $('#yelp-info-side').html('<img src=\"img/loading_spinner.gif\">');
	            $('#yelp-search-modal').modal('show');
	  
	            if (feature.get('name') || feature.get('NAME')){
	            	var queryName;
	            	if (feature.get('name')) queryName = feature.get('name');
	            	if (feature.get('NAME')) queryName = feature.get('NAME');
	            	var queryID = feature.get('GEO_ID');
	            	var queryGeo = feature.get('geometry').getCoordinates();
	                var queryType = feature.get('geometry').getType();
	                console.log(queryType);
	                if (queryType === 'Point'){
	                    queryGeo = ol.proj.transform(queryGeo, 'EPSG:3857', 'EPSG:4326');
	                }
	                else{
	                    for (var i in queryGeo){
	                        for (var j in queryGeo[i]){
	                            queryGeo[i][j] = ol.proj.transform(queryGeo[i][j], 'EPSG:3857', 'EPSG:4326');
	                        }
	                    }
	                }
	            	
					var uiucFlag = false, statesFlag = false, countiesFlag = false, citiesFlag = false;

			    	var currLayers = map.getLayers();
			    	currLayers.forEach(function(item){
			    		if (item.get('name') === 'uiuc') uiucFlag = true;
			    		else if (item.get('name') === 'states') statesFlag = true;
			    		else if (item.get('name') === 'counties') countiesFlag = true;
			    		else if (item.get('name') === 'cities') citiesFlag = true;
			    	});

	                if (uiucFlag) socket.emit('location', {id: queryName, area: queryGeo, type: queryType, bound: viewportLonlatBound});
	                if (countiesFlag) socket.emit('county_info', {id: queryID, bound: viewportLonlatBound});

	                
	            }
	            else{
	                $('#yelp-info-side').html('<h4>No information about this place.</h4>');
	            }           
	        }
    	}
    	else if (modes[1]) {
    		$('#yelp-info-side').html('<img src=\"img/loading_spinner.gif\">');
	        $('#yelp-search-modal').modal('show');
			let lonlat = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
            let radius = $('#magnifying-glass-radius').val();
            if ($('#bmg').hasClass('active')) {	
            	socket.emit('magnifying', {bound: viewportLonlatBound, center: lonlat, radius: radius/3959, type: 'both'});
            } else if ($('#tmg').hasClass('active')) {
            	socket.emit('magnifying', {bound: viewportLonlatBound, center: lonlat, radius: radius/3959, type: 'tweet'});
            } else if ($('#ymg').hasClass('active')) {
            	socket.emit('magnifying', {bound: viewportLonlatBound, center: lonlat, radius: radius/3959, type: 'yelp'});
            }
		}
    });
	
	socket.on('yelp_location_results', function(data){
	    if (data.statusCode === 400) {
	        $('#yelp-info-side').html(feature.get('name'));
	    }
	    else{
	        if (data.availability){
	            $('#yelp-info-side').html('<p>'+data.name+'</p>');
	            $('#yelp-info-side').append('<div id="wordcloud" style="position:relative; height:400px; width:100%;"></div>');
				WordCloud(document.getElementById("cloud"), {list: data.list}); 
	        }
	        else{
	            $('#yelp-info-side').html('<p>No yelp about this place.</p>');
	        }
	    }
	});
	socket.on('county_info_results', function(data){
	    if (data.statusCode === 400) {
	        $('#yelp-info-side').html(feature.get('NAME'));
	    }
	    else{
	        if (data.availability){
	            $('#yelp-info-side').html('<p>'+queryName+'</p>');
	            $('#yelp-info-side').append('<div id="wordcloud" style="position:relative; height:400px; width:100%;"></div>');
	            WordCloud(document.getElementById("wordcloud"), {list: data.list});
	        }
	        else{
	            $('#yelp-info-side').html('<p>No tweets about this place.</p>');
	        }
	    }
	});

	socket.on('magnifying_result', function(data){
    	if (data.statusCode === 400) {
            $('#yelp-info-side').html(feature.get('NAME'));
        }
        else{
            if (data.availability){
                $('#yelp-info-side').html('<p>Magnifying Glass Mode</p>');
                $('#yelp-info-side').append('<div id="wordcloud" style="position:relative; height:400px; width:100%;"></div>');
				WordCloud(document.getElementById("wordcloud"), {list: data.list}); 
            }
            else{
                $('#yelp-info-side').html('<p>No information about this place.</p>');
            }
        }
    });	

    function cleanUpDisplay(){
		if (uiuchighlight){
			uiucOverlay.getSource().removeFeature(uiuchighlight);
	        uiuchighlight = null;
		}
		if (statehighlight){
			statesOverlay.getSource().removeFeature(statehighlight);
	    	statehighlight = null;
		}

		if (countyhighlight){
			countiesOverlay.getSource().removeFeature(countyhighlight);
			countyhighlight = null;
		}
		if (cityhighlight){
			citiesOverlay.getSource().removeFeature(cityhighlight);
			cityhighlight = null;
		}
	}

	function switchGEOJSON(geojson, name, callback){
		var list = ['uiuc', 'states', 'cities', 'counties'];
		var layers = map.getLayers();
		layers.forEach(function(item){
			var layerName = item.get('name');
			for (var i in list){
				if (list[i] === name) continue;
				if (list[i] === layerName){
					map.removeLayer(item);
					break;
				}
			}
		});
		map.addLayer(geojson);
		cleanUpDisplay();
		if (callback && typeof(callback) === "function"){
			callback();
		}
	}
});

function insidePolygon(polygon, point) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
 	    var xi = polygon[i][0], yi = polygon[i][1];
        var xj = polygon[j][0], yj = polygon[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

function getDistFromLon(lon1, lon2) {
	var dlon = Math.abs(lon1 - lon2);
	return 55.2428 * dlon;
}