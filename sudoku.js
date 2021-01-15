var n = 9; 
var cube_size = Math.floor(Math.sqrt(n));
n = cube_size * cube_size;
var mat = [];
var result = [];
var mode;

function set_mode(m){
	mode = m;
	main();
}

//initializing matrix
function initialize_matrix(){
	for(var i=0; i<n; i++){
		mat[i]=[];
		for(var j=0; j<n; j++){
			mat[i][j] = 0;
		}
	}
}

function check_cube(row, col, rand){
	for(var i=0; i<cube_size; i++){
		for(var j=0; j<cube_size; j++){
			if(mat[row+i][col+j] == rand){
				return false;
			}
		}
	}
	return true;
}

function create_data_for_cube(row, col){
	var rand;
	for(var i=0; i<cube_size; i++){
		for(var j=0; j<cube_size; j++){
			do{
				rand = (Math.floor((Math.random()*100))%n)+1;
			}while(!check_cube(row, col, rand))
			mat[row+i][col+j] = rand;
		}
	}
}

function create_dia_cube(){
	for(var i=0; i<cube_size; i++){
		create_data_for_cube(i*cube_size, i*cube_size);
	}
}

function check_row(i, num){
	for (var j=0; j<n; j++){
		if(mat[i][j] == num){
			return false;
		}
	}
	return true;
}

function check_col(j, num){
	for(var i=0; i<n; i++){
		if(mat[i][j] == num){
			return false;
		}
	}
	return true;
}

function is_okay(i, j, num){
		if(check_row(i, num) && check_col(j, num) && check_cube(Math.floor(i/cube_size)*cube_size, Math.floor(j/cube_size)*cube_size, num)){
			return true;
		}
		return false;
}

function create_rem_cube(i, j){
	if(j == n && i < n-1){  
		j = 0;
		i = i+1;
	}
	
	if(i<cube_size && j<cube_size){
		j = cube_size;
	} else if(i < n-cube_size && j == Math.floor(i/cube_size)*cube_size){
		j = j + cube_size;
	} else if(i >= n-cube_size && j == n-cube_size){ 
		j = 0;
		i = i+1;
		if (i >= n){
			return true;
		}
	}
	
	if (i==n && j==n){
		return true;
	}
	
	for(var num=1; num<=n; num++){
		if(is_okay(i, j, num)){
			mat[i][j] = num;
			if(create_rem_cube(i, j+1)){
				return true;
			}
			mat[i][j]=0;
		}
	}
	return false;
}

function remove_ele(num_ele){
	var i, j;
	for (var p=0; p<num_ele; p++){
		i = Math.floor((Math.random()*100)%n);
		j = Math.floor((Math.random()*100)%n);
		mat[i][j] = "*";
	}
}
		

function create_blanks(){
	var num_ele;
	
	switch(mode){
		case "easy": num_ele = Math.floor((5 * n * n)/10);
			remove_ele(num_ele);
			break;
		case "medium": num_ele = Math.floor((6.5 * n * n)/10);
			remove_ele(num_ele);
			break;
		case "hard": num_ele = Math.floor((8 * n * n)/10);
			remove_ele(num_ele);
			break;
	}
}

function render_html(){
	var inp_part1 = "<input type='text' style='' id='";
	var inp_part2 = "'/>";
	var t = "<table border='1' cellpadding='0' cellspacing='0'>";
	for(var i=0; i<n; i++){
		t = t + "<tr>"
		for(var j=0; j<n; j++){
			if(mat[i][j] !== '*'){
				//t = t + "<td id=" + i + "" + j + ">" + mat[i][j] + "</td>";
				t = t + "<td>" + inp_part1 + i + "" + j + "' value='" + mat[i][j] + "' disabled='true'" + inp_part2  + "</td>";
			} else {
				t = t + "<td>" + inp_part1 + i + "" + j + inp_part2 + "</td>";
			}
		}
		t = t + "</tr>";
	}
	t = t + "</table>";
	return t;
}

function main(){
	initialize_matrix();
	
	// creates data for the diagonal cubes
	create_dia_cube();
	
	// create data for the rmemaining cubes
	create_rem_cube(0, cube_size);
	
	// storing the created sudoku in result - for future validation
	for(var i=0; i<n; i++){
		result[i] = []
		for(j=0; j<n; j++){
			result[i][j] = mat[i][j];
		}
	}
	
	// create blanks from the matrix
	create_blanks();
	
	var t = render_html();
	document.getElementById("sudoku").innerHTML = t;
	document.getElementById("page1").style.display = "none";
	document.getElementById("page2").style.display = "block";
	document.getElementById("page3").style.display = "none";
}

function validate(){
	var submitted_res = [];
	for(var i=0; i<n; i++){
		submitted_res[i] = [];
		for(var j=0; j<n; j++){
			submitted_res[i][j] = +document.getElementById(i+""+j).value;
		}
	}
	console.log("Submitted result is:");
	console.log(submitted_res);
	console.log("Actual result is:");
	console.log(result["r"]);
	
	show_res = "<h3>Submitted answer is:</h3><br><table border='1' cellpadding='0' cellspacing='0'>"
	for(i=0; i<n; i++){
		show_res = show_res + "<tr>";
		for(j=0; j<n; j++){
			if(result[i][j] !== submitted_res[i][j]){
				submitted_res[i][j] = submitted_res[i][j] == 0 ? "" : submitted_res[i][j]
				show_res = show_res + "<td style='background-color: #ffb3b3'>"+submitted_res[i][j]+"</td>";
			} else if(result[i][j] !== mat[i][j]){
				show_res = show_res + "<td style='background-color: #99ff99'>"+submitted_res[i][j]+"</td>";
			} else {
				show_res = show_res + "<td style='background-color: #fafafa'>"+submitted_res[i][j]+"</td>";
			}
		}
		show_res = show_res + "</tr>";
	}
	show_res = show_res + "</table>"
	
	show_actual = "<h3>Answer is:</h3><br><table border='1' cellpadding='0' cellspacing='0'>"
	for(i=0; i<n; i++){
		show_actual = show_actual + "<tr>";
		for(j=0; j<n; j++){
			if(result[i][j] !== mat[i][j]){
				show_actual = show_actual + "<td style='background-color: #99ff99'>"+result[i][j]+"</td>";
			} else {
				show_actual = show_actual + "<td style='background-color: #fafafa'>"+result[i][j]+"</td>";
			}
		}
		show_actual = show_actual + "</tr>";
	}
	show_actual = show_actual + "</table>"
	
	document.getElementById("submitted_res").innerHTML = show_res;
	document.getElementById("res").innerHTML = show_actual;
	document.getElementById("page1").style.display = "none";
	document.getElementById("page2").style.display = "none";
	document.getElementById("page3").style.display = "block";
}

function show_actual_sudoku(){
	document.getElementById("res").style.display = "inline-block";
}

function play_again(){
	document.getElementById("page1").style.display = "block";
	document.getElementById("page2").style.display = "none";
	document.getElementById("page3").style.display = "none";
	document.getElementById("res").style.display = "none";
}

