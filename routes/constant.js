const animals  =  ['Cat', 'Dog', 'Tiger', 'Lion', 'Elephant', 'Rabbit', 'Horse', 'Cow', 'Pig', 'Chicken', 'Duck', 'Goat', 'Sheep', 'Deer', 'Bear', 'Monkey', 'Giraffe', 'Zebra', 'Wolf', 'Fox', 'Panda', 'Koala', 'Kangaroo', 'Camel', 'Lizard', 'Snake', 'Crocodile', 'Turtle', 'Fish', 'Shark', 'Dolphin', 'Whale', 'Octopus', 'Squid', 'Crab', 'Lobster', 'Shrimp', 'Prawn', 'Oyster', 'Clam', 'Mussel', 'Snail', 'Slug', 'Butterfly', 'Bee', 'Wasp', 'Ant', 'Spider', 'Scorpion', 'Fly', 'Mosquito', 'Cockroach', 'Beetle', 'Grasshopper', 'Dragonfly', 'Ladybug', 'Centipede', 'Millipede', 'Caterpillar', 'Worm', 'Moth', 'Bat', 'Owl', 'Eagle', 'Hawk', 'Falcon', 'Parrot', 'Penguin', 'Flamingo', 'Swan', 'Dove', 'Peacock', 'Turkey', 'Ostrich', 'Pigeon', 'Sparrow', 'Raven', 'Crow', 'Magpie', 'Goose', 'Crane', 'Stork', 'Vulture', 'Woodpecker', 'Hummingbird', 'Kingfisher', 'Robin', 'Squirrel', 'Raccoon', 'Hedgehog', 'Chipmunk', 'Hamster', 'Mouse', 'Rat', 'Guinea Pig', 'Chinchilla', 'Ferret', 'Rabbit', 'Turtle', 'Snake', 'Lizard', 'Frog', 'Toad', 'Newt', 'Salamander', 'Tortoise', 'Crocodile', 'Alligator', 'Iguana', 'Chameleon', 'Gecko', 'Skink', 'Python', 'Boa', 'Anaconda', 'Cobra', 'Viper', 'Rattlesnake', 'Mamba', 'Krait', 'Adder', 'Taipan', 'Milk Snake', 'Garter Snake'];
const transports = ['Car', 'Bus', 'Train', 'Plane', 'Boat', 'Ship', 'Bicycle', 'Motorcycle', 'Scooter', 'Truck', 'Van', 'Taxi', 'Ambulance', 'Fire Truck', 'Police Car', 'Helicopter', 'Submarine', 'Spaceship', 'Rocket', 'UFO', 'Blimp', 'Airship', 'Hot Air Balloon', 'Zeppelin', 'Hovercraft', 'Jet Ski', 'Sailboat', 'Yacht', 'Sailboat', 'Canoe', 'Kayak', 'Catamaran', 'Ferry', 'Gondola', 'Rowboat', 'Lifeboat', 'Life Raft', 'Jet', 'Airplane', 'Airbus', 'Boeing', 'Concorde', 'Zeppelin', 'Airship', 'Hot Air Balloon', 'Helicopter', 'Submarine', 'Spaceship', 'Rocket', 'UFO', 'Blimp', 'Airship', 'Hot Air Balloon', 'Zeppelin', 'Hovercraft', 'Jet Ski', 'Sailboat', 'Yacht', 'Sailboat', 'Canoe', 'Kayak', 'Catamaran', 'Ferry', 'Gondola', 'Rowboat', 'Lifeboat', 'Life Raft', 'Jet', 'Airplane', 'Airbus', 'Boeing', 'Concorde', 'Zeppelin', 'Airship', 'Hot Air Balloon', 'Helicopter', 'Submarine', 'Spaceship', 'Rocket', 'UFO', 'Blimp', 'Airship', 'Hot Air Balloon', 'Zeppelin', 'Hovercraft', 'Jet Ski', 'Sailboat', 'Yacht', 'Sailboat', 'Canoe', 'Kayak', 'Catamaran', 'Ferry', 'Gondola', 'Rowboat', 'Lifeboat', 'Life Raft', 'Jet', 'Airplane', 'Airbus', 'Boeing', 'Concorde', 'Zeppelin', 'Airship', 'Hot Air Balloon', 'Helicopter', 'Submarine', 'Spaceship', 'Rocket', 'UFO', 'Blimp', 'Airship', 'Hot Air Balloon', 'Zeppelin', 'Hovercraft', 'Jet Ski', 'Sailboat', 'Yacht', 'Sail']
const actions = ['Eat', 'Drink', 'Sleep', 'Run', 'Walk', 'Jump', 'Crawl', 'Swim', 'Fly', 'Drive', 'Ride', 'Climb', 'Dive', 'Sail', 'Surf', 'Ski', 'Skate', 'Sled', 'Hike', 'Bike', 'Skateboard', 'Rollerblade']

function getAnimal() {
    const shuffled = animals.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
}

function getTransport (){
    const shuffled = transports.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);}

function getAction (){
    const shuffled = actions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);}



module.exports = {
    getAnimal,
    getTransport,
    getAction
}
