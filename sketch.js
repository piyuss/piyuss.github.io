/*

Coursework 2.2 Game project submission [002]

Extension1-Create enemies: In this game, there are 3 hypnotic-egg-monsters guarding some spans along the game path.
If the character comes within 20 pixels of these monsters, the character loses one life and the startGame function
is called again until there are lives remaining. Difficult bit: Using the new operator to create the enemy using
the constructor function was the most confusing bit for me. I had difficulty understanding the syntax that
“new” operator works with and also the concept behind it. The use of a constructor function to create a complex
object containing other functions(methods) was a difficult concept. Skills learnt: After implementing this extension
in my code, now I am quite familiar with the constructor function and now I can create multiple complex objects with
similar properties and methods using a single constructor, new-operator and traversing arrays. This also gave me a 
lot of debugging practice.

Extension2- Create platforms: In this game, there are 4 raised platforms in different areas along the game path, that
the character can jump on to save itself from the enemies. The character can also use the jump action while on these 
platforms to cross canyons with ease. Difficult bit: While using the factory pattern to create multiple objects, 
I have no difficulty in rendering or drawing them on the screen but whenever interactions are involved with the object, 
I make many errors in my if-statements and my syntax. Regarding these platforms, I had a difficult time, trying to not 
make the character fall when it reached the platform. Integrating the falling and jumping logic code with the conditions 
of platform contact was the trickiest bit. Skills learnt: I have practiced factory pattern to create multiple objects with 
similar properties and similar interactions. This has taught me how to make codes succinct. 


*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;
var trees_x;
var treePos_y;
var clouds;
var mountains;
var canyon;
var collectables;
var game_score;
var flagpole;
var lives;
var dead;
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var platforms;
var enemies;


function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
	lives = 3;
	startGame();	
}

//function that starts the game.
function startGame(){
	gameChar_x = 100;
	gameChar_y = floorPos_y;
	game_score = 0;
	flagpole ={isReached: false, x_pos: 2500};
	dead = false;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game	
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
	trees_x = [100,400,1200,1900,2500];
	treePos_y = floorPos_y -160;
	clouds = [ {x_pos:250, y_pos:70, size:80},
		{x_pos:650, y_pos:140, size:80} ,
		{x_pos:1050, y_pos:100, size:100}
	];
	
	mountains =[{x_pos:400, y_pos:432, size:200},
		{x_pos:1000, y_pos:432, size:220},
		{x_pos:1700, y_pos:432, size:150} 
	];

	canyon = [{x_pos:700, width:100},
		{x_pos:200, width:100},
		{x_pos:1500, width:100} 
	];

	//Arrays of the three interactive objects:
	platforms= [];
	platforms.push(createPlatforms(600,floorPos_y- 80,100));
	platforms.push(createPlatforms(1200,floorPos_y- 80,100));
	platforms.push(createPlatforms(1800,floorPos_y- 80,100));
	platforms.push(createPlatforms(2100,floorPos_y- 80,100));

	collectables=
	[{x_pos:1050, y_pos: floorPos_y- 25, size:50, isFound:false},
	{x_pos:150, y_pos: floorPos_y- 25, size:50, isFound:false},
	{x_pos:850, y_pos: floorPos_y- 25, size:50, isFound:false},
	{x_pos:2050, y_pos: floorPos_y- 25, size:50, isFound:false},
	{x_pos:1250, y_pos: floorPos_y- 25, size:50, isFound:false},
	{x_pos:1650, y_pos: floorPos_y- 25, size:50, isFound:false}];

	enemies=[];
	enemies.push(new Enemy(500,floorPos_y-10,100));
	enemies.push(new Enemy(1300,floorPos_y-10,100));
	enemies.push(new Enemy(2300,floorPos_y-10,100));
}

function draw()
{
	background(100, 155, 255); // sky
	noStroke();
	fill(47, 79, 79);
	rect(0, floorPos_y, width, height/4); // green ground

	push(); //scrollable scenery till the pop command.
	translate(scrollPos,0)

	// Call the functions that draw scenery objects.
	drawClouds();
	drawMountains();
	drawTrees();

	//platforms
	for(var i=0;i<platforms.length; i++){
		platforms[i].draw();
	}

	// Draw canyons.
	for(var i=0; i< canyon.length; i++){		
		drawCanyon(canyon[i]);
		checkCanyon(canyon[i]);
	}

	// Draw collectable items.	
	for(var i=0; i< collectables.length; i++){
		if(collectables[i].isFound==false){
			drawCollectable(collectables[i]);
			checkCollectable(collectables[i]);
		}
	}

	//Draw flagpole
	renderFlagpole();

	//Draw enemies
	for(var i=0; i<enemies.length; i++){
		enemies[i].draw();
		var isContact=enemies[i].checkContact(gameChar_world_x,gameChar_y);
		if(isContact && !dead){
			lives--;
			dead=true;
			if(lives>0){
				startGame();
				break;
			}
		}
	}

	pop();	

	// Draw game character.	
	drawGameChar();

	//to display score and lives.
	push();
	fill(200,200,0);
	strokeWeight(5);	
	textSize(40);
	text("Score:"+game_score, 20,50);
	textSize(20);
	text("lives : "+lives, 750,60);
	for(i=0; i<lives;i++){
		fill(255,255,0);
		ellipse(850+i*60,50,50,50);
	}
	pop();

	//when lives end.
	if (lives<1){
		stroke(255, 255, 255);
		strokeWeight(4);
		fill(255,0,0);
		textSize(40);
		text("Game over, press space to continue.", 200,300);						
		return;
	}
	//when level complete.
	if (flagpole.isReached){
		stroke(255, 255, 255);
		strokeWeight(4);
		fill(255,0,0);
		textSize(40);
		text("Level complete!!, press space to continue.", 200,300);		
		return;
	}

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}


	// Logic to make the game character rise and fall.
	if(gameChar_y < floorPos_y){
		var isPlatformContact= false;
		for(var i=0; i< platforms.length; i++){
			if((platforms[i].checkPlatformContact(gameChar_world_x, gameChar_y))==true){
				isPlatformContact=true;
				isFalling = false;
				break;
			}
		}
		if(isPlatformContact==false){
			gameChar_y += 3;
			isFalling= true;
		}

	}
	else{
		isFalling = false;
	}

	if(isPlummeting){
		gameChar_y+=5;
	}

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
	if (flagpole.isReached==false){
		checkFlagpole();
	}
	if (dead == false){
		checkPlayerDie();
	}
}

//key Control function:
function keyPressed()
{
	if (keyCode == 39){		
		isRight = true;
	}
	if (keyCode == 37){		
		isLeft=true;
	}
	if (keyCode == 32 ){	
		if(!isFalling){
			gameChar_y -= 100;
		}
	}
	//refreshes the browser when spacebar at end.	
	if (keyCode == 32 && (flagpole.isReached || !lives>0)){
		location.reload();
	}
}
function keyReleased()
{
	console.log("keyReleased: " + key);
	console.log("keyReleased: " + keyCode);
	if (keyCode == 39){		
		isRight = false;
	}
	if (keyCode == 37){		
		isLeft=false;
	}
}

// Function to draw the game character.
function drawGameChar()
{
	if(isLeft && isFalling)
	{
		// add your jumping-left code	
		//head
		fill(243,69,96);
		stroke(59,66,82)
		ellipse(gameChar_x,gameChar_y-50-2,20);
		//body
		fill(30,112,106);
		triangle (gameChar_x,gameChar_y-40-2,
			gameChar_x+25,gameChar_y-10-2-7,
			gameChar_x-25,gameChar_y-10-2-7
		);
		//legs
		fill(168,215,203);
		rect(gameChar_x-10,gameChar_y-10-2-7,7,7);
		rect(gameChar_x+3,gameChar_y-10-2-7,7,7);
		line(gameChar_x-10-7,gameChar_y-10-2-7-7,
			gameChar_x-10+5+22,gameChar_y-10-2-7-7,);
		line(gameChar_x-10-7-3,gameChar_y-10-7-6,
			gameChar_x-10+5+22+3,gameChar_y-10-7-6,);
		line(gameChar_x-10,gameChar_y-10-7,
			gameChar_x-10-1+8,gameChar_y-10-7,);
		line(gameChar_x-10+13,gameChar_y-10-7,
			gameChar_x-10-1+8+13,gameChar_y-10-7,);
		line(gameChar_x-10,gameChar_y-10-7+3,
			gameChar_x-10-1+8,gameChar_y-10-7+3,);
		line(gameChar_x-10+13,gameChar_y-10-7+3,
			gameChar_x-10-1+8+13,gameChar_y-10-7+3,);
		//shoes
		fill(191, 97, 106);
		rect(gameChar_x+3-1.5-6,gameChar_y-2-10,15,7);
		rect(gameChar_x-10-1.5-6,gameChar_y-2-10,15,7);
		//hand
		fill(99,178,173);
		rect(gameChar_x-3,gameChar_y-35,5,15);
		//nose
		beginShape();
		vertex(gameChar_x-10,gameChar_y-50-5);
		vertex(gameChar_x-5-10,gameChar_y-5-40-5);
		vertex(gameChar_x-10,gameChar_y-5-40-5);
		endShape();
	}


	else if(isRight && isFalling)
	{
		// add your jumping-right code
		//head
		fill(243,69,96);
		stroke(59,66,82)
		ellipse(gameChar_x,gameChar_y-50-2,20);
		//body
		fill(30,112,106);
		triangle (gameChar_x,gameChar_y-40-2,
			gameChar_x+25,gameChar_y-10-2-7,
			gameChar_x-25,gameChar_y-10-2-7
		);
		//legs
		fill(168,215,203);
		rect(gameChar_x-10,gameChar_y-10-2-7,7,7);
		rect(gameChar_x+3,gameChar_y-10-2-7,7,7);	

		line(gameChar_x-10-7,gameChar_y-10-2-7-7,
			gameChar_x-10+5+22,gameChar_y-10-2-7-7,);
		line(gameChar_x-10-7-3,gameChar_y-10-7-6,
			gameChar_x-10+5+22+3,gameChar_y-10-7-6,);
		line(gameChar_x-10,gameChar_y-10-7,
			gameChar_x-10-1+8,gameChar_y-10-7,);
		line(gameChar_x-10+13,gameChar_y-10-7,
			gameChar_x-10-1+8+13,gameChar_y-10-7,);
		line(gameChar_x-10,gameChar_y-10-7+3,
			gameChar_x-10-1+8,gameChar_y-10-7+3,);
		line(gameChar_x-10+13,gameChar_y-10-7+3,
			gameChar_x-10-1+8+13,gameChar_y-10-7+3
		,);
		//shoes
		fill(191, 97, 106);
		rect(gameChar_x+3-1.5-6+7,gameChar_y-2-10,15,7);
		rect(gameChar_x-10-1.5-6+7,gameChar_y-2-10,15,7);
		//hand
		fill(99,178,173);
		rect(gameChar_x-3,gameChar_y-35,5,15);
		//nose
		beginShape();
		vertex(gameChar_x-10+20,gameChar_y-50-5);
		vertex(gameChar_x+5-10+20,gameChar_y-5-40-5);
		vertex(gameChar_x-10+20,gameChar_y-5-40-5);
		endShape();
	}

	else if(isLeft)
	{
		// add your walking left code
		//head
		fill(243,69,96);
		stroke(59,66,82)
		ellipse(gameChar_x,gameChar_y-50-2,20);
		//body
		fill(30,112,106);
		triangle (gameChar_x,gameChar_y-40-2,
			gameChar_x+20,gameChar_y-10-2,
			gameChar_x-20,gameChar_y-10-2) ;
		//legs
		fill(168,215,203);
		rect(gameChar_x-10,gameChar_y-10-2,7,10);
		rect(gameChar_x+3,gameChar_y-10-2,7,10);
		//shoes
		fill(191, 97, 106);
		rect(gameChar_x+3-1.5-6,gameChar_y-2,15,7);
		rect(gameChar_x-10-1.5-6,gameChar_y-2,15,7);
		//hand
		fill(99,178,173);
		rect(gameChar_x-3,gameChar_y-35,5,15);
		//nose
		beginShape();
		vertex(gameChar_x-10,gameChar_y-50-5);
		vertex(gameChar_x-5-10,gameChar_y-5-40-5);
		vertex(gameChar_x-10,gameChar_y-5-40-5);
		endShape();
	}

	else if(isRight)
	{
		// add your walking right code
		//head
		fill(243,69,96);
		stroke(59,66,82)
		ellipse(gameChar_x,gameChar_y-50-2,20);
		//body
		fill(30,112,106);
		triangle (gameChar_x,gameChar_y-40-2,
			gameChar_x+20,gameChar_y-10-2,
			gameChar_x-20,gameChar_y-10-2) ;

		//legs
		fill(168,215,203);
		rect(gameChar_x-10,gameChar_y-10-2,7,10);
		rect(gameChar_x+3,gameChar_y-10-2,7,10);
		//shoes
		fill(191, 97, 106);
		rect(gameChar_x+3-1.5-6+7,gameChar_y-2,15,7);
		rect(gameChar_x-10-1.5-6+7,gameChar_y-2,15,7);
		//hand
		fill(99,178,173);
		rect(gameChar_x-3,gameChar_y-35,5,15);
		//nose
		beginShape();
		vertex(gameChar_x-10+20,gameChar_y-50-5);
		vertex(gameChar_x+5-10+20,gameChar_y-5-40-5);
		vertex(gameChar_x-10+20,gameChar_y-5-40-5);
		endShape();
	}

	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
		//head
		fill(243,69,96);
		stroke(59,66,82)
		ellipse(gameChar_x,gameChar_y-50-2,20);
		//body
		fill(30,112,106);
		triangle (gameChar_x,gameChar_y-40-2,
			gameChar_x+25,gameChar_y-10-2-7,
			gameChar_x-25,gameChar_y-10-2-7) ;

		//legs
		fill(168,215,203);
		rect(gameChar_x-10,gameChar_y-10-2-7,7,7);
		rect(gameChar_x+3,gameChar_y-10-2-7,7,7);
		line(gameChar_x-10-7,gameChar_y-10-2-7-7,
			gameChar_x-10+5+22,gameChar_y-10-2-7-7,);
		line(gameChar_x-10-7-3,gameChar_y-10-7-6,
			gameChar_x-10+5+22+3,gameChar_y-10-7-6,);
		line(gameChar_x-10,gameChar_y-10-7,
			gameChar_x-10-1+8,gameChar_y-10-7,);
		line(gameChar_x-10+13,gameChar_y-10-7,
			gameChar_x-10-1+8+13,gameChar_y-10-7,);
		line(gameChar_x-10,gameChar_y-10-7+3,
			gameChar_x-10-1+8,gameChar_y-10-7+3,);
		line(gameChar_x-10+13,gameChar_y-10-7+3,
			gameChar_x-10-1+8+13,gameChar_y-10-7+3,);

		//shoes
		fill(191, 97, 106);
		rect(gameChar_x+3-1.5,gameChar_y-2-10,10,7);
		rect(gameChar_x-10-1.5,gameChar_y-2-10,10,7);

		//hand
		fill(99,178,173);
		rect(gameChar_x+5,gameChar_y-35,15,5);
		rect(gameChar_x-20,gameChar_y-35,15,5);

		//nose	
		line(gameChar_x-5,gameChar_y-5-40-5,
			gameChar_x+5,gameChar_y-5-40-5
		);
		line(gameChar_x,gameChar_y-5-40-5,
			gameChar_x,gameChar_y-50-5,
		);
	}

	else
	{
		// add your standing front facing code
		//head
		fill(243,69,96);
		stroke(59,66,82)
		ellipse(gameChar_x,gameChar_y-50-2,20);
		//body
		fill(30,112,106);
		triangle (gameChar_x,gameChar_y-40-2,
			gameChar_x+20,gameChar_y-10-2,
			gameChar_x-20,gameChar_y-10-2
		) ;
		//legs
		fill(168,215,203);
		rect(gameChar_x-10,gameChar_y-10-2,7,10);
		rect(gameChar_x+3,gameChar_y-10-2,7,10);
		//shoes
		fill(191, 97, 106);
		rect(gameChar_x+3-1.5,gameChar_y-2,10,7);
		rect(gameChar_x-10-1.5,gameChar_y-2,10,7);
		//hand
		fill(99,178,173);
		rect(gameChar_x+5,gameChar_y-35,15,5);
		rect(gameChar_x-20,gameChar_y-35,15,5);
		//nose	
		line(gameChar_x-5,gameChar_y-5-40-5,
			gameChar_x+5,gameChar_y-5-40-5,);

		line(gameChar_x,gameChar_y-5-40-5,
			gameChar_x,gameChar_y-50-5
		);
	}
}

// Function to draw cloud objects.
function drawClouds(){
	for(var i=0; i < clouds. length; i++ ){
		noStroke();
		fill(255);
		ellipse(clouds[i].x_pos,clouds[i].y_pos,clouds[i].size);
		ellipse(clouds[i].x_pos+(4/7)*clouds[i].size,clouds[i].y_pos,(5/7)*clouds[i].size);
		ellipse(clouds[i].x_pos+clouds[i].size,clouds[i].y_pos,(3/7)*clouds[i].size);
		ellipse(clouds[i].x_pos-(6/7)*clouds[i].size,clouds[i].y_pos,clouds[i].size,(5/7)*clouds[i].size);
	}
}

// Function to draw mountains objects.
function drawMountains(){
	for(var i=0; i < mountains. length; i++ ){
		fill(153,153,0);
		triangle (mountains[i].x_pos+0.25*mountains[i].size,mountains[i].y_pos,
			mountains[i].x_pos+ 1.25*mountains[i].size,mountains[i].y_pos,
			mountains[i].x_pos+0.75*mountains[i].size,mountains[i].y_pos-2*mountains[i].size
		);
		fill(0,102,102,220);
		triangle (mountains[i].x_pos+0.5*mountains[i].size,mountains[i].y_pos,
			mountains[i].x_pos+ 1.5*mountains[i].size,mountains[i].y_pos,
			mountains[i].x_pos+1*mountains[i].size,mountains[i].y_pos-1.7*mountains[i].size
		);
		
		fill(120,210,150,180);
		triangle (mountains[i].x_pos,mountains[i].y_pos,
			mountains[i].x_pos+ 1*mountains[i].size,mountains[i].y_pos,
			mountains[i].x_pos+0.4*mountains[i].size,mountains[i].y_pos-1.2*mountains[i].size
		);
	}
}

// Function to draw trees objects.
function drawTrees(){
	for(var i=0; i < trees_x. length; i++ ){
		noStroke();	
		fill(51,25,0);	
		rect(trees_x[i],treePos_y,40,160)
		fill(153,0,76);
		ellipse(trees_x[i]-50,treePos_y-100,80,80);
		ellipse( trees_x[i]+20,treePos_y-100,150,200);
		ellipse(trees_x[i]-40,treePos_y-160,80,80);
		ellipse(trees_x[i]+10,treePos_y-200,80,80);
		ellipse(trees_x[i]+60,treePos_y-160,80,80);
		ellipse(trees_x[i]+90,treePos_y-100,80,80);
		ellipse(trees_x[i]+50,treePos_y-40,80,80);
		ellipse(trees_x[i]-20,treePos_y-40,80,80);
		ellipse(trees_x[i]+20,treePos_y-10,80,80);
		stroke(51,25,0);
		strokeWeight(3);
		line(trees_x[i]+20,treePos_y-110,trees_x[i]+20,treePos_y-1);
		line(trees_x[i]+20,treePos_y-20,trees_x[i]+60,treePos_y-80);
		line(trees_x[i]+20,treePos_y-50,trees_x[i],treePos_y-80);
		noStroke();
    }
}

// Function to draw canyon objects.
function drawCanyon(t_canyon)
{
	noStroke();
	fill(0);
	rect(t_canyon.x_pos,432,t_canyon.width ,144);
	fill(76,0,153);
	rect(t_canyon.x_pos-20,432,20,144);
	fill(76,0,153);
	rect(t_canyon.x_pos+t_canyon.width,432,20,144);
}

// function to draw tokens:
function drawLifeToken(tt){
	fill(255,0,0);
	ellipse(tt.x_pos,50,50,50);
}

// Function to check character is over a canyon.
function checkCanyon(t_canyon){
	if((gameChar_world_x >= t_canyon.x_pos) && (gameChar_world_x<= (t_canyon.x_pos + t_canyon.width)) && (gameChar_y >= floorPos_y ) ){
		isPlummeting = true;
	}
}

// Function to draw collectable objects.
function drawCollectable(t_collectable)
{
	fill(250, 250, 0,20);
	stroke(255,0,0);
	strokeWeight(4);
	ellipse(t_collectable.x_pos,t_collectable.y_pos,t_collectable.size);
	strokeWeight(3);
	line(t_collectable.x_pos,t_collectable.y_pos,
		t_collectable.x_pos, t_collectable.y_pos+t_collectable.size
	);
	line(t_collectable.x_pos,t_collectable.y_pos,
		t_collectable.x_pos, t_collectable.y_pos-t_collectable.size
	);    
	noStroke();
	fill(250, 250, 0);
	ellipse(t_collectable.x_pos,t_collectable.y_pos, t_collectable.size/1.5);
	fill(250, 150, 0);
	ellipse(t_collectable.x_pos,t_collectable.y_pos, t_collectable.size/3);
}

// Function to check character has collected an item.
function checkCollectable(t_collectable)
{
	//when collectable is found:
	if (dist(gameChar_world_x ,gameChar_y,t_collectable.x_pos,t_collectable.y_pos+20) < 50 ){
		t_collectable.isFound = true;	
		game_score+=1;
	}
}

//function to draw the flagpole.
function renderFlagpole(){
	push();
	fill(100,100,0);
	strokeWeight(10);	
	stroke(100,100,220);
	line (flagpole.x_pos,floorPos_y, flagpole.x_pos,floorPos_y-200);
	pop();
	if (flagpole.isReached){
		push();
		fill(255,0,0);
		rect(flagpole.x_pos,floorPos_y-200,50,50);
		pop();
	}
	else{
		push();
		fill(255,0,0);
		rect(flagpole.x_pos,floorPos_y-50,50,50);
		pop();
	}
}

//function to check if the flagpole has been reached.
function checkFlagpole(){
	var d = abs(gameChar_world_x-flagpole.x_pos);
	if (d<15){
		flagpole.isReached=true;
	}
}

//function to check if all the lives have been used up.
function checkPlayerDie(){
	if (gameChar_y> floorPos_y+300){
		lives-=1;
		dead = true;
		if (lives>=1){
			startGame();
		}
	}
}

//factory pattern for creating platforms:
function createPlatforms(x,y,length){
	var p ={x:x, y:y, length:length, 
		draw: function(){
			fill(255, 162, 171);
			stroke(	33, 9, 84);
		    rect(this.x, this.y, this.length, 20);},

		checkPlatformContact: function(gcx,gcy){
			if(gcx>this.x && gcx< this.x+ this.length){
				var d= this.y-gcy;
				if(d>=0 && d<5){
					console.log("intheplatformyaay!");
					return true;
				}
			}
			return false;
		}
	}
	return p;
}

//Constructor function to create enemies:
function Enemy(x,y,range){
	this.x=x;
	this.y=y;
	this.range=range;
	this.currentX=x;
	this.inc=1;
	this.update= function(){
		this.currentX += this.inc;
		if(this.currentX >= this.x + this.range){
			this.inc =-1;
		}
		else if(this.currentX<this.x){
			this.inc=1;
		}
	}
	this.draw=function(){
		this.update();
		fill(255, 165, 0);
		stroke(0);
		ellipse(this.currentX,this.y,random(25,45),random(40,60));
		
		fill(255);
		ellipse(this.currentX-10,this.y,10,10);
		ellipse(this.currentX+10,this.y,10,10);
		fill(0);
		stroke(0);
		rect(this.currentX-5,this.y+9,9,1);
				
	}
	this.checkContact=function(gc_x, gc_y){
		var d= dist(gc_x, gc_y, this.currentX, this.y)
		if(d<20){
			return true;
		}
		return false;
	}
}

