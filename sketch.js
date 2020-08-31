var dog;
var dogImage;
var happyDog;
var database;
var foodStock;
var foodS;
var food;
var feedDog,addFood;
var fedTime,lastFed;
var foodObj;
var changegameState;
var readState;
var bedroomImg,gardenImg,washroomImg;
var bedroom,garden,washroom;

function preload()
{
dogImage = loadImage("dogImg.png");
happyDog = loadImage("dogImg1.png");

bedroomImg = loadImage("pet images/Bed Room.png");
gardenImg = loadImage("pet images/Garden.png");
washroomImg = loadImage("pet images/Wash Room.png");


}

function setup() {
  
  dog = createSprite(250,300,15,20);
  dog.scale = 0.3;
  dog.addImage(dogImage);

  database = firebase.database();
  foodStock = database.ref("Food");
  foodStock.on("value",readStock); 


  feed = createButton("Feed The Dog"); 
  feed.position(450,95);
  feed.mousePressed(feedDog); 

  addFood = createButton("Add Food");
  addFood.position(550,95);
  addFood.mousePressed(addFoods);

  food = new Food();
  
  readState = database.ref('gameState');
  readState.on("value",function(data){
   gameState = data.val();
  });

  createCanvas(500, 500);
  
  
}


function draw() {  

  background(46,139,87);
  
  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });

  fill("white");
  text("Food Remaining = "+ foodS,200,100);

  
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Fed : "+ lastFed%12 + "PM", 350 , 30); 
   }else if(lastFed==0){
     text("Last Fed : 12 AM",350,30);
   }else {
     text("Last Feed : "+ lastFed + "AM", 350,30); 
    } 

  food.display();
  
  currentTime = hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    food.garden(); 
  }else if(currentTime==(lastFed+2)){
     update("Sleeping");     
     food.bedroom();
  }else if(currentTime==(lastFed+3)&& currentTime<=(lastFed+4)){
    update("Bathing");
    food.washroom();
  }else{
    update("Hungry");
    food.display();
  }

  if(gameState!="Hungry"){
   feedDog.hide();
   addFood.hide(); 
   dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage("pet images/Dog.png");
  }


 drawSprites();

}

function readStock(data){

foodS = data.val();
food.updateFoodStock(foodS);

database.ref("/").update({
Food:x
})  
}

 function feedDog(){
  dog.addImage(happyDog);

  food.updateFoodStock(food.getFoodStock()-1);
  database.ref("/").update({
    Food:food.getFoodStock(),
    FeedTime:hour()
  }) 
 }
   
  function addFoods(){
   foodS++;
   database.ref("/").update({
     Food:foodS
   }) 
  }
    
  function update(state){
   database.ref('/').update({
    gameState:state
   });

  } 
  
