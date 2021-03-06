function newBoxHtml(index) {
	var row='<tr>'+
			'<td>Activity '+index+'</td> '+
			'<td>A'+index+'</td>'+
			'<td><input type="input" id="w'+index+'" value=""></td>'+
			'<td><input type="input" id="g'+((index*2)-1)+'" value=""> / <input type="input" id="g'+(index*2)+'" value=""></td> '+
			'<td id="pct'+index+'"> </td>'+
			'</tr> ';
	return row;
}

function modifyPctBox(elem) {
	
		var currId = parseInt($(elem).attr('id').slice(1, $(elem).attr('id').length));
		//console.log(currId);
		var nonPctEven = $('#g'+(currId-1)).val()/$('#g'+(currId)).val();
		var nonPctOdd = $('#g'+(currId)).val()/$('#g'+(currId+1)).val();
		if (isNaN(nonPctEven)){
			nonPctEven=0;
		}
		if (isNaN(nonPctOdd)) {
			nonPctOdd=0;
		}
		if (currId%2==0) {
			$('#pct'+(currId/2)).html((nonPctEven)*100+"%");
		}
		else
		{
			$('#pct'+((currId+1)/2)).html((nonPctOdd)*100+"%");
		}
}

$(document).ready(function() {
	var totalBoxes=4;
	
	var avgs=[];
	var sum=0;
	var sumweights=0;	
	var patt=new RegExp("[^0-9]");
	
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
	
	//create click callback(s) for removing row
	$('#r4').click(function() {
		if (totalBoxes-1 == 0) {
			alert("Can not remove last box! must have at least 1");
			return;
		}
		$("#pct"+totalBoxes).closest("tr").remove();
		totalBoxes-=1;
	});
	
	
	//when you click the mean button
	$('#meanbtn').click(function() {
		var isError = false;
		var boxesEntered=totalBoxes;
		
		for (var x=2; x<=totalBoxes*2; x++){
			if (x%2==0) {
				
				if ($('#g'+(x-1)).val() == '' || $('#g'+(x)).val() == '') {
					if (boxesEntered == 1) {
						
					}
					boxesEntered-=1;
					continue;
				}
				if (patt.test($('#g'+(x-1)).val()) == true || patt.test($('#g'+(x)).val()) == true) {
					alert("Non-numeric value entered in activity: "+x/2);
					isError=true;
					break;
				}
				if ($('#g'+(x)).val() == 0 || $('#g'+(x)).val() == '0') {
					alert("You can not divide by 0");
					isError=true;
					break;
				}
				

				var avg = $('#g'+(x-1)).val()/$('#g'+x).val();

				avgs.push(avg);
				
			}
			 
		 }
		 if (isError == true) {
			 $('#resulttext').html("ERROR");
			 avgs= [];
			 sum=0;
			 return;
		 }
		 for (var y=0; y<avgs.length; y++){
			 sum+=avgs[y];
		 }

		 var totalVal = sum/boxesEntered;
		 if (isNaN(totalVal)) {

			 totalVal=0;
		 }
		 $('#resulttext').html("<p>Mean of "+boxesEntered+" activity/activities: "+totalVal+"</p>");
		 avgs= [];
		 sum=0;
		 
	});
	
	//when you click the weighted button
	$('#weightbtn').click(function() {
		var isError = false;
		var boxesEntered=totalBoxes;
		for (var x=2; x<=totalBoxes*2; x++){
			if (x%2==0){
				if ($('#g'+(x-1)).val() == '' || $('#g'+(x)).val() == '') {
					boxesEntered-=1;
					continue;
				}
				
				if (patt.test($('#g'+(x-1)).val()) == true || patt.test($('#g'+(x)).val()) == true) {
					alert("Non-numeric value entered in activity: "+x/2);
					isError=true;
					break;
				}
				
				if ($('#g'+(x)).val() == 0 || $('#g'+(x)).val() == '0') {
					alert("You can not divide by 0");
					isError=true;
					break;
				}
				if ($('#w'+(x/2)).val() == '') {
					alert('Weight for Activity ' + (x/2) + ' is empty. Treating it as 0');
					//boxesEntered-=1;
					continue; 
				}
				
				var avg = ($('#g'+(x-1)).val()/$('#g'+x).val()) * ($('#w'+(x/2)).val());

				sumweights+=(parseInt($('#w'+(x/2)).val()));
				avgs.push(avg);
				
			}
			 
		 }
		 if (isError == true) {
			$('#resulttext').html("ERROR");
			avgs= [];
			sum=0;
			sumweights=0;
			return;
		 }
		 
		 for (var y=0; y<avgs.length; y++){
			 sum+=avgs[y];
		 }

		 var totalVal=sum/sumweights;
		 if (isNaN(totalVal)) {
			 totalVal=0;
		 }
		 $('#resulttext').html("<p>Weighted mean of "+boxesEntered+" activity/activities: "+totalVal+"</p>");
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
