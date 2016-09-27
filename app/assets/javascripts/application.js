// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .


//tut1
//$(document).ready(function() {
	//$('#time').click(function() {
		//$('#displayTimeInfo').html(Date());
	//});lo
//});

//creates the string to represent the HTML of a new row in the table
function newBoxHtml(index) {
	var row='<tr>'+
			'<td>Activity '+index+'</td> '+
			'<td>A'+index+'</td>'+
			'<td><input type="input" id="w'+index+'" value=""></td>'+
			'<td><input type="input" id="g'+((index*2)-1)+'" value=""> / <input type="input" id="g'+(index*2)+'" value=""></td> '+
			'<td id="pct'+index+'"> </td>'+
			'</tr>';
	return row;
}

function modifyPctBox(elem) {
	
		var currId = parseInt($(elem).attr('id').slice(1, $(elem).attr('id').length));
		console.log(currId);
		if (currId%2==0) {
			$('#pct'+(currId/2)).html(($('#g'+(currId-1)).val()/$('#g'+(currId)).val())*100+"%");
		}
		else
		{
			$('#pct'+((currId+1)/2)).html(($('#g'+(currId)).val()/$('#g'+(currId+1)).val())*100+"%");
		}
}

$(document).ready(function() {
	var totalBoxes=4;
	
	var avgs=[];
	var sum=0;
	var sumweights=0;	

	//set percent values initially
	for (var z=2; z<=totalBoxes*2; z++) {
		if (z%2==0) {
			if ($('#g'+(z-1)).val() == '' || $('#g'+(z)).val() == '') continue;
			$('#pct'+(z/2)).html(($('#g'+(z-1)).val()/$('#g'+(z)).val())*100+"%");
		};
	};
	
	//define event listener for each input box
	for (var z=1; z<=totalBoxes*2; z++) {
		$('#g'+(z)).on('input',function() { 
			modifyPctBox(this);
		});
	}
	
	//when you click the mean button
	$('#meanbtn').click(function() {
		var boxesEntered=totalBoxes;
		for (var x=2; x<=totalBoxes*2; x++){
			if (x%2==0){

				if ($('#g'+(x-1)).val() == '' || $('#g'+(x)).val() == '') {
					boxesEntered-=1;
					continue;
				}
				if ($('#g'+(x)).val() == 0 || $('#g'+(x)).val() == '0') {
					alert("You can not divide by 0");
					break;
				}
				
				var avg = $('#g'+(x-1)).val()/$('#g'+x).val();
				avgs.push(avg);
				
			}
			 
		 }
		 
		 for (var y=0; y<avgs.length; y++){
			 sum+=avgs[y];
		 }
		 
		 $('#resulttext').html(sum/boxesEntered);
		 avgs= [];
		 sum=0;
		 
	});
	
	//when you click the weighted button
	$('#weightbtn').click(function() {
		var boxesEntered=totalBoxes;
		for (var x=2; x<=totalBoxes*2; x++){
			if (x%2==0){
				if ($('#g'+(x-1)).val() == '' || $('#g'+(x)).val() == '') {
					boxesEntered-=1;
					continue;
				}
				if ($('#g'+(x)).val() == 0 || $('#g'+(x)).val() == '0') {
					alert("You can not divide by 0");
					break;
				}
				if ($('#w'+(x/2)).val() == '') {
					alert('Weight for Activity ' + (x/2) + ' is empty. Treating it as 0');
					continue; 
				}
				
				var avg = ($('#g'+(x-1)).val()/$('#g'+x).val()) * ($('#w'+(x/2)).val());
				//console.log(avg);
				sumweights+=(parseInt($('#w'+(x/2)).val()));
				avgs.push(avg);
				
			}
			 
		 }
		 
		 for (var y=0; y<avgs.length; y++){
			 sum+=avgs[y];
		 }
		 //console.log(sumweights);
		 $('#resulttext').html(sum/sumweights);
		 avgs= [];
		 sum=0;
		 sumweights=0;
		 
	});
	
	//when you click the add row button
	$('#addrowbtn').click(function() {
		
		totalBoxes+=1;
		//append a row to the table
		$('#calculator tbody').append(newBoxHtml(parseInt(totalBoxes)));
		
		
		//create the input listeners for the percent calculation
		$('#g'+((totalBoxes*2)-1)).on('input',function() { 
			modifyPctBox(this);
		});
		$('#g'+(totalBoxes*2)).on('input',function() { 
			modifyPctBox(this);
		});
		
	});
	
});
