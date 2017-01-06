var path = require("path");
var http = require("http");
var url = require("url");
var fs = require("fs");
var stopwords = new Set(["i'm", "i've", "it's", "a", "about", "above", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "alone", "along", "already", "also","although","always","am","among", "amongst", "amoungst", "amount",  "an", "and", "another", "any","anyhow","anyone","anything","anyway", "anywhere", "are", "around", "as",  "at", "back","be","became", "because","become","becomes", "becoming", "been", "before", "beforehand", "behind", "being", "below", "beside", "besides", "between", "beyond", "bill", "both", "bottom","but", "by", "call", "can", "cannot", "cant", "co", "con", "could", "couldnt", "cry", "de", "describe", "detail", "do", "done", "don't", "down", "due", "during", "each", "eg", "eight", "either", "eleven","else", "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen", "fify", "fill", "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found", "four", "from", "front", "full", "further", "get", "give", "go", "had", "has", "hasnt", "have", "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how", "however", "hundred", "i", "ie", "if", "in", "inc", "indeed", "interest", "into", "is", "it", "its", "itself", "keep", "last", "latter", "latterly", "least", "less", "ltd", "made", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly", "move", "much", "must", "my", "myself", "name", "namely", "neither", "never", "nevertheless", "next", "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing", "now", "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our", "ours", "ourselves", "out", "over", "own","part", "per", "perhaps", "please", "put", "rather", "re", "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several", "she", "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something", "sometime", "sometimes", "somewhere", "still", "such", "system", "take", "ten", "than", "that", "the", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "therefore", "therein", "thereupon", "these", "they", "thickv", "thin", "third", "this", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "top", "toward", "towards", "twelve", "twenty", "two", "un", "under", "until", "up", "upon", "us", "very", "via", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with", "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves", "the"]);



var server = http.createServer(function(request, response) {
	var pathname = url.parse(request.url).pathname;
	if (pathname === '/favicon.ico'){
		console.log("Ignored favicon request.");
		return;
	}
	var ext = path.extname(pathname);

	if(ext){
		console.log(pathname);
		if(ext === '.css'){
			response.writeHead(200, {'Content-Type': 'text/css'});
			response.write(fs.readFileSync(__dirname + '\\public' + pathname, 'utf8'));
		}
		else if(ext === '.js'){
			response.writeHead(200, {'Content-Type': 'text/javascript'});
			response.write(fs.readFileSync(__dirname + '\\public' + pathname, 'utf8'));
		}
		else if (ext === '.geojson'){
			response.writeHead(200, {'Content-Type': 'application/json'});
			response.write(fs.readFileSync(__dirname + '\\public' + pathname, 'utf8'));
		}
		else if (ext === '.json'){
			response.writeHead(200, {'Content-Type': 'application/json'});
			response.write(fs.readFileSync(__dirname + '\\public' + pathname, 'utf8'));
		}
		else if (ext === '.gif'){
			response.writeHead(200, {'Content-Type': 'image/gif'});
			response.end(fs.readFileSync(__dirname + '\\public' + pathname), 'binary');
		}
		
	}
	else{
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write(fs.readFileSync('public/index.html', 'utf8'));
	}
	response.end();
});

server.listen(3000);
console.log("Server is now listening on port 3000");

/********************** Done setup server **************************/

var MongoClient = require('mongodb').MongoClient;
var io = require('socket.io').listen(server);
MongoClient.connect("mongodb://localhost:27017/research_data", function(err, db){
	if (err) return console.log(err);
	//console.log("Connected to reserch collection!");
	io.sockets.on('connection', function(socket){
		socket.on("preload_mag", function(viewport) {
			socket.removeAllListeners("magnifying");
			var mag_wt = db.collection('magnifying_glass_word_table');
			var type = viewport.type;
			if (type === 'both') {
				mag_wt = db.collection('magnifying_glass_word_table');
			} else if (type === "tweet") {
				mag_wt = db.collection('twitter_word_table');
			} else if (type === "yelp") {
				mag_wt = db.collection('yelp_bus_word_table');
			}
			var vp = viewport.bound;
			var vpl = [vp[0], vp[1]];
			var vpr = [vp[2], vp[3]];
			mag_wt.find( {
				"lonlat":
					{ $geoWithin:
						{ $box: [vpl, vpr] }
					}
			} ).toArray(function(preloadErr, backgroundSamples) {
				console.log(backgroundSamples.length + " entries in viewport");
				socket.on('magnifying', function(data){
					var mag_wt = db.collection('magnifying_glass_word_table');
					var center = data.center;
					var radius = data.radius;
					var type = data.type;
					if (type === 'both') {
						mag_wt = db.collection('magnifying_glass_word_table');
					} else if (type === "tweet") {
						mag_wt = db.collection('twitter_word_table');
					} else if (type === "yelp") {
						mag_wt = db.collection('yelp_bus_word_table');
					}
					mag_wt.find({ 
						"lonlat": 
							{ $geoWithin: 
								{ $centerSphere: [center, radius] }
							}
					}).toArray(function(err, targetSamples){
						console.log(targetSamples.length + " entries in circle");							
						var doc_dict = {};
						var doc_count = 0;
						for (var i in backgroundSamples){
							for (var j in backgroundSamples[i]._words_list){
								if (doc_dict[j]) doc_dict[j]++;
								else doc_dict[j] = 1;
							}
							doc_count++;
	    				}
	                    var target_total_count = 0;
	                    var target_word_count = {};
	                    for (var i in targetSamples) {
	                    	if (targetSamples[i].total_word_count) {
	                    		target_total_count += targetSamples[i].total_word_count;
	                    	}
	                    	var currlist = targetSamples[i]._words_list;
	                    	for (var j in currlist){
	                    		if (currlist[j].appearance) {
		                    		if (target_word_count[j]) {
		                    			target_word_count[j] += currlist[j].appearance;
		                    		}
		                    		else {
		                    			target_word_count[j] = currlist[j].appearance;
		                    		}
		                    	}
	                    	}
	                    } 
	                    var TFIDF_arr = [];
	                    var max_tfidf = 0;
	                    var norm_coef;
	    				for (var i in target_word_count){
	    					if (stopwords.has(i)) continue;
	    					var TF = target_word_count[i] / target_total_count;
	    					var IDF = Math.log( doc_count / doc_dict[i] );
	                        var TFIDF = TF * IDF;
	    					TFIDF_arr.push( { word: i, TFIDF: TFIDF } );
	                        if (TFIDF > max_tfidf) max_tfidf = TFIDF;
	    				}
	                    norm_coef = 100 / max_tfidf;
	    				TFIDF_arr.sort(function(a, b){
	    					return b.TFIDF - a.TFIDF;
	    				});	            				
	                    var rawlist = TFIDF_arr.map(function(pair){
	                        return [pair.word, pair.TFIDF*norm_coef];
	                    });
	                    var list = rawlist.filter(function(item){
	                        return item[1] >= 9;
	                    });
	                    if (list){       	
			                obj = {
			                    'list': list,
			                    'availability': 1
			                };
			            }
			            else{
			                obj = {
			                    'availability': null
			                };
			            }
			            console.log("returning");
			            io.emit('magnifying_result', obj);
					});
				});
			} );
		} );

		socket.on("preload_wm", function(viewport) {
			socket.removeAllListeners("wander");
			var t_wt = db.collection('tile_word_table');
			var wordlist = '_' + viewport.type + '_words_list';
			var totalcount = viewport.type + '_total_word_count';
			var vp = viewport.bound;
			var boundpolygon = [[ [vp[0], vp[1]],[vp[0], vp[3]],[vp[2], vp[3]],[vp[2], vp[1]],[vp[0], vp[1]] ]];
			t_wt.find( {
				"geometry":
					{ $geoIntersects: {
							$geometry: {
								type: "Polygon",
								coordinates: boundpolygon
							} 	
						}
					}
			} ).toArray(function(preloadErr, backgroundSamples) {
				console.log(backgroundSamples.length + " entries in viewport");
				socket.on('wander', function(data){
					var center = data.center;
					t_wt.findOne({ 
						"geometry": { 
							$geoIntersects: {
								$geometry: {
									type: "Point",
									coordinates: center
								} 	
							}
						}
					}, function(wmerr, target){
						console.log("Got target tile " + target._meta_header.id);
						console.log(target._meta_header)
						var doc_dict = {};
						var doc_count = 0;
						for (var i in backgroundSamples){
							for (var j in backgroundSamples[i][wordlist]){
								if (doc_dict[j]) doc_dict[j]++;
								else doc_dict[j] = 1;
							}
							doc_count++;
	    				}
	                    var target_total_count = target._meta_header[totalcount];
	                    var target_word_count = {};
	                    for (var i in target[wordlist]) {
                    		if (target[wordlist][i].appearance) {
	                    		if (target_word_count[i]) {
	                    			target_word_count[i] += target[wordlist][i].appearance;
	                    		}
	                    		else {
	                    			target_word_count[i] = target[wordlist][i].appearance;
	                    		}
	                    	}
	                    }
	                    if (target[wordlist]) console.log("target has info");
	                    else console.log("target has no info");
	                    var TFIDF_arr = [];
	                    var max_tfidf = 0;
	                    var norm_coef;
	    				for (var i in target_word_count){
	    					if (stopwords.has(i)) continue;
	    					var TF = target_word_count[i] / target_total_count;
	    					var IDF = Math.log( doc_count / doc_dict[i] );
	                        var TFIDF = TF * IDF;
	    					TFIDF_arr.push( { word: i, TFIDF: TFIDF } );
	                        if (TFIDF > max_tfidf) max_tfidf = TFIDF;
	    				}
	                    norm_coef = 100 / max_tfidf;
	    				TFIDF_arr.sort(function(a, b){
	    					return b.TFIDF - a.TFIDF;
	    				});	            				
	                    var rawlist = TFIDF_arr.map(function(pair){
	                        return [pair.word, pair.TFIDF*norm_coef];
	                    });
	                    var list = rawlist.filter(function(item){
	                        return item[1] >= 9;
	                    });
	                    if (list.length > 1) console.log("has result");
	                    if (list){       	
			                obj = {
			                    'list': list,
			                    'availability': 1
			                };
			            }
			            else{
			                obj = {
			                    'availability': null
			                };
			            }
			            console.log("returning");
			            io.emit('wander_result', obj);
					});
				});
			} );
		} );

		socket.on('location', function(data){
			var yelpbuswt = db.collection('yelp_bus_word_table');
			var coords = data.area;
			var type = data.type;
			var bound = data.bound;
			var boundbl = [bound[0], bound[1]];
			var boundtr = [bound[2], bound[3]];
			var obj;
			yelpbuswt.find(
				{ $text: { $search: data.id } },
				{ score: { $meta: "textScore"} }
			).sort( { score: { $meta: "textScore" } } ).limit(100).toArray(function(err, result){
				if (err) return console.log(err);
				var name = null;
				var got_valid_business = false;
				for (var i in result){
					if (result[i]){
						if (i == 0){
							console.log(result[i]._meta_header.name+": "+result[i].lonlat);
							console.log(type);
						}
						var accept = false;
						if (type === "Point"){
							if ( distMeasure(result[i].lonlat, coords) <= 200 ) accept = true;
						}
						else{
							for (var j in coords){
								if ( insidePolygon(coords[j], result[i].lonlat) ){
									accept = true;
									break;
								}
							}
							if (!accept){
								if (i == 0) console.log(result[i]._meta_header.name+": "+result[i].lonlat);
								var centroid = centroidOfPolygon(coords[0]);
								if (i == 0) console.log("dist: "+distMeasure(result[i].lonlat, centroid));
								if ( distMeasure(result[i].lonlat, centroid) <= 200 ) accept = true;
							}
						}
						// Precompute version
						if (accept){
							got_valid_business = true;
							var TFIDF_arr = [];
							var max_tfidf = 0;
							var norm_coef;
							name = result[i]._meta_header.name;
							for (var j in result[i]._words_list){
								var TFIDF = result[i]._words_list[j].tfidf;
								TFIDF_arr.push({ word: j, TFIDF: TFIDF });
								if (TFIDF > max_tfidf) max_tfidf = TFIDF;
							}
							norm_coef = 100 / max_tfidf;
							TFIDF_arr.sort(function(a, b){
								return b.TFIDF - a.TFIDF;
							});
							var rawlist = TFIDF_arr.map(function(pair){
								return [pair.word, pair.TFIDF*norm_coef];
							});
							var list = rawlist.filter(function(item){
								return item[1] >= 9;
							});
							console.log(list);
							if (list){          
								obj = {
									'name': name,
									'list': list,
									'availability': 1
								};
							}
							else{
								obj = {
									'availability': null
								};
							}
							io.emit('yelp_location_results', obj);

							break;                          
						}
					}
				}
				if (!got_valid_business){
					console.log("got no valid business");
					io.emit('yelp_location_results', {availability: null});
				}
			});           
		});
		socket.on('county_info', function(data){
			var county_wt = db.collection('county_wt')
			var geoid = data.id;
			console.log("id = "+geoid);
			var bound = data.bound;
			var boundbl = [bound[0], bound[1]];
			var boundtr = [bound[2], bound[3]];
			county_wt.findOne({GEO_ID: geoid}, function(err, target_county){
				county_wt.find({
					geometry: {
						$geoIntersects: {
							$geometry: {
								type: 'Polygon',
								coordinates: [
									[
										[bound[0], bound[3]], [bound[0], bound[1]], [bound[2], bound[1]], [bound[2], bound[3]], [bound[0], bound[3]]
									]
								]
							}
						}
					}
				}).toArray(function(err2, sample){
					if (err2) throw err2;
					var doc_with_word_dict = {};
					var total_doc = 0;
					for (var i in sample){
						if (!sample[i].tweet_count) continue;
						total_doc++;
						for (var j in sample[i]){
							if (notWordEntry(j)) continue;
							if (j){
								if (doc_with_word_dict[j]) doc_with_word_dict[j] += 1;
								else doc_with_word_dict[j] = 1;
							}
						}
					}
					var TFIDF_arr = [];
					var max_tfidf = 0;
					for (var i in target_county){
						if (notWordEntry(i)) continue;
						var TF = target_county[i].appearance / target_county.total_word_count;
						var IDF = Math.log( total_doc / doc_with_word_dict[i] );
						var TFIDF = TF * IDF;
						TFIDF_arr.push( { word: i, TFIDF: TFIDF } );
						if (TFIDF > max_tfidf) max_tfidf = TFIDF;
					}
					var norm_coef = 100 / max_tfidf;
					TFIDF_arr.sort(function(a, b){
						return b.TFIDF - a.TFIDF;
					});	            				
					var rawlist = TFIDF_arr.map(function(pair){
						return [pair.word, pair.TFIDF*norm_coef];
					});
					var list = rawlist.filter(function(item){
						return item[1] >= 9;
					});
					var obj = {};
					if (list){
						obj = {
							'list': list,
							'availability': 1
						};
					} else{
						obj = {'availability': null};
					}
					io.emit('county_info_results', obj);
				});
			});
			
		});
	});
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

function insideBoundary(bound, point){
	var polygon = [
		[bound[0], bound[1]],
		[bound[0], bound[3]],
		[bound[2], bound[3]],
		[bound[2], bound[1]]
	];

	return insidePolygon(polygon, point);
}

function distMeasure(point1, point2){  // generally used geo measurement function
	var lat1 = point1[1], lon1 = point1[0];
	var lat2 = point2[1], lon2 = point2[0];
	var R = 6378.137; // Radius of earth in KM
	var dLat = (lat2 - lat1) * Math.PI / 180;
	var dLon = (lon2 - lon1) * Math.PI / 180;
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
	Math.sin(dLon/2) * Math.sin(dLon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
	return d * 1000; // meters
}

function centroidOfPolygon(polygon) {
	var twoTimesSignedArea = 0;
	var cxTimes6SignedArea = 0;
	var cyTimes6SignedArea = 0;

	var length = polygon.length;

	var x = function (i) { return polygon[i % length][0] };
	var y = function (i) { return polygon[i % length][1] };

	for ( var i = 0; i < polygon.length; i++) {
		var twoSA = x(i)*y(i+1) - x(i+1)*y(i);
		twoTimesSignedArea += twoSA;
		cxTimes6SignedArea += (x(i) + x(i+1)) * twoSA;
		cyTimes6SignedArea += (y(i) + y(i+1)) * twoSA;
	}
	var sixSignedArea = 3 * twoTimesSignedArea;
	return [ cxTimes6SignedArea / sixSignedArea, cyTimes6SignedArea / sixSignedArea];        
}

function notWordEntry(i){
	return i === "GEO_ID" || i === "geometry" || i === "tweet_count" || i === "_id" || i === "total_word_count" || i === "review_count" || i === "name" || i === "rating" || i === "business_id" || i === "lonlat";
}