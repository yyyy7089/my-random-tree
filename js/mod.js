let modInfo = {
	name: "My Random Tree",
	id: "j",
	author: "yyyy7089 (special thanks to op_Dare)",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "discord server",
	discordLink: "https://discord.gg/fYqrcBCQ6y",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "mining the pizza",
}

let changelog =
`<h1>Changelog:</h1><br>
<h2>v0.1.1</h2><br>
2 new layers<br>
added discord server link<br>
endgame: pickaxe tier 8 (didn't push farther, didn't do balance/bugtest)
<br><br><br>
<h3>v0.1</h3><br>
2 layers<br>
endgame: pickaxe tier 8`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)

	for(i=11;i<16;++i){
		if(hasUpgrade('p', i)) gain = gain.add(new Decimal(1))
	}
	gain = gain.add(buyableEffect('u', 22))
	
	if(hasUpgrade('p', 31)) gain = gain.times(upgradeEffect('p', 31))
	if(hasUpgrade('p', 32)) gain = gain.times(upgradeEffect('p', 32))

	gain = gain.times(buyableEffect('p', 11))

	gain = gain.times(buyableEffect('m', 101))
	
	if(getBuyableAmount('u', 13).gte(1)) gain = gain.times(3)

	if(hasUpgrade('d', 21)) gain = gain.times(2)

	gain = gain.times(buyableEffect('d', 11))

	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return getBuyableAmount('m', 11).gte(8)
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}