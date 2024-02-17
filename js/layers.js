addLayer("p", {
    name: "pizza",
    symbol: "🍕",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFFF7F",
    requires: new Decimal(10),
    resource: "pizza",
    baseResource: "points",
    baseAmount() {return player.points},
    type: "normal",
    exponent: 0.5,
    tabFormat: [
        "main-display",
        ["row", ["prestige-button", "blank", ["clickable", 11]]],
        "resource-display",
        "buyables",
        "blank",
        "upgrades"
    ],
    gainMult() {
        mult = new Decimal(1)

        for(i=21;i<26;++i){
            if (hasUpgrade('p', i)) mult = mult.times(new Decimal(2))
        }

        if(hasUpgrade('p', 33)) mult = mult.times(upgradeEffect('p', 33))

        if(hasUpgrade('p', 41)) mult = mult.div(7)
        if(hasUpgrade('p', 42)) mult = mult.div(0.1)

	    mult = mult.times(buyableEffect('p', 12))
        
	    mult = mult.times(buyableEffect('m', 102))

        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 0,
    hotkeys: [
        {key: "p", description: "P: Reset for pizzas", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {
            title: "beginning",
            description: "+1 base points gain.",
            cost: new Decimal(1),
        },
        12: {
            title: "we like pizza",
            description: "+1 base points gain.",
            cost: new Decimal(2),
            unlocked(){
                return hasUpgrade('p', 11)
            },
        },
        13: {
            title: "is this useful",
            description: "+1 base points gain.",
            cost: new Decimal(100),
            unlocked(){
                return hasUpgrade('p', 12)
            },
        },
        14: {
            title: "this is not useful",
            description: "+1 base points gain.",
            cost: new Decimal(1000),
            unlocked(){
                return hasUpgrade('p', 13)
            },
        },
        15: {
            title: "the last base increase",
            description: "+1 base points gain.",
            cost: new Decimal(2500),
            unlocked(){
                return hasUpgrade('p', 14)
            },
        },
        21: {
            title: "dough upgrade",
            description: "x2 pizza gain.",
            cost: new Decimal(3),
            unlocked(){
                return hasUpgrade('p', 11)
            },
        },
        22: {
            title: "better dough upgrade",
            description: "x2 pizza gain.",
            cost: new Decimal(10),
            unlocked(){
                return hasUpgrade('p', 21)
            },
        },
        23: {
            title: "even better dough upgrade",
            description: "x2 pizza gain.",
            cost: new Decimal(420),
            unlocked(){
                return hasUpgrade('p', 22)
            },
        },
        24: {
            title: "super dough upgrade",
            description: "x2 pizza gain.",
            cost: new Decimal("1e3"),
            unlocked(){
                return hasUpgrade('p', 23)
            },
        },
        25: {
            title: "super duper extreme ultimate unreal shiny dough upgrade",
            description: "x2 pizza gain.",
            cost: new Decimal("1e7"),
            unlocked(){
                return hasUpgrade('p', 24)
            },
        },
        31: {
            title: "add more hams to the pizza",
            description: "pizza boosts points gain.",
            cost: new Decimal(19),
            tooltip: "(log2(🍕+1)+1)<br>^0.5",
            unlocked(){
                return hasUpgrade('p', 21)
            },
            effect(){
                base = player.p.points.add(1).log(2).add(1)
                exp = new Decimal(0.5)
                
                if(hasUpgrade('p', 43)) exp = exp.add(0.2)

                return base.pow(exp)
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id))+"x" 
            },
        },
        32: {
            title: "add pineapples to the pizza",
            description: "points boost points gain.",
            cost: new Decimal(69),
            tooltip: "(log3(points+1)+1)<br>^0.5",
            unlocked(){
                return hasUpgrade('p', 31)
            },
            effect(){
                return player.points.add(1).log(3).add(1).pow(0.5)
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id))+"x" 
            },
        },
        33: {
            title: "add pizzas to the pizza...?",
            description: "pizza boost pizza gain.",
            cost: new Decimal(178),
            tooltip: "(log3(🍕+1)+1)<br>^0.3",
            unlocked(){
                return hasUpgrade('p', 32)
            },
            effect(){
                return player.p.points.add(1).log(3).add(1).pow(0.3)
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id))+"x" 
            },
        },
        34: {
            title: "add pizza to some rocks",
            description: "pizza boost mp gain.",
            cost: new Decimal("1e10"),
            tooltip: "max(log100(🍕+1)-3.6,1)",
            unlocked(){
                if(!hasUpgrade('p', 33)) return 0
                if(player.m.total.eq(0)) return 0
                return 1
            },
            effect(){
                rt = player.p.points.add(1).log(100).sub(3.6).max(1)
                return rt
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id))+"x" 
            },
        },
        41: {
            title: "add pizzas to the pineapple",
            description: "divide pizza gain by 7. why.",
            cost: new Decimal(150),
            unlocked(){
                return hasUpgrade('p', 31)
            },
        },
        42: {
            title: "add pineapples with pizza to the pizza",
            description: "divide pizza gain by 0.1... would you please be smart?",
            cost: new Decimal(0),
            unlocked(){
                return hasUpgrade('p', 41)
            },
        },
        43: {
            title: "add<br><- this to the pizza",
            description: "+0.2 upgrade 31's exponent.",
            cost: new Decimal(1837),
            unlocked(){
                return hasUpgrade('p', 42)
            },
        },
    },
    buyables: {
        11: {
            title: "we like pizza in the morning we like pizza every day we like pizza in the evening we like pizza anyways",
            cost() {
                cost = new Decimal("1e3").times(new Decimal(1.6).pow(getBuyableAmount(this.layer, this.id)))
                if(getBuyableAmount(this.layer, this.id).gte(10)) cost = cost.times(new Decimal(1.4).pow(getBuyableAmount(this.layer, this.id).sub(10).pow(1.4)))
                if(getBuyableAmount(this.layer, this.id).gte(25)) cost = cost.times(new Decimal(4).pow(getBuyableAmount(this.layer, this.id).sub(25).pow(2)))

                return cost
            },
            display() {return "x1.5 points per upgrade." + 
            "<br>Amount: "+ format(getBuyableAmount(this.layer, this.id))+
            "<br>Cost: "+format(this.cost())+ " 🍕"
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player.p.points = player.p.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade('p', 15)
            },
            effect() {
                return new Decimal(1.5).pow(getBuyableAmount(this.layer, this.id))
            }
        },
        12: {
            title: "omega dough upgrade",
            cost() {
                cost = new Decimal("4e7").times(new Decimal(4).pow(getBuyableAmount(this.layer, this.id)))
                if(getBuyableAmount(this.layer, this.id).gte(3)) cost = cost.times(new Decimal(1.4).pow(getBuyableAmount(this.layer, this.id).sub(3).pow(1.4)))

                return cost
            },
            display() {return "x2 🍕 per upgrade." + 
            "<br>Amount: "+ format(getBuyableAmount(this.layer, this.id))+
            "<br>Cost: "+format(this.cost())+ " 🍕"
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player.p.points = player.p.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade('p', 25)
            },
            effect() {
                return new Decimal(2).pow(getBuyableAmount(this.layer, this.id))
            }
        },
    },
    clickables: {
        11: {
            title: "Hold to reset",
            display: "(Mobile QoL)",
            onClick() {if(canReset(this.layer)) doReset(this.layer)},
            onHold() {if(canReset(this.layer)) doReset(this.layer)},
            canClick() {return true},
        }
    },
    layerShown(){return true}
})
addLayer("m", {
    name: "mining",
    symbol: "⛏️",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),

        stone: new Decimal(0),
        coal: new Decimal(0),
        copper: new Decimal(0),
        iron: new Decimal(0),
        gold: new Decimal(0),
        diamond: new Decimal(0),
    }},
    color: "#7F7F7F",
    branches: ['p'],
    requires: new Decimal("1e4"),
    layerShown() {
        if (hasUpgrade('p', 15)) return true
        if (player.m.total.gt(0)) return true
        return false
    },
    resource: "mining points",
    baseResource: "pizza",
    baseAmount() {return player.p.points},
    type: "normal",
    exponent: 0.3,
    tabFormat: {
        "Main": {
            content:[
                "main-display",
                "prestige-button",
                "blank",
                "blank",
                ["column", [
                    ["row", [["buyable", 11], ]],
                ]],
                "blank",
                ["column", [
                    ["row", [["upgrade", 1], ]],
                    ["row", [["upgrade", 11], ["upgrade", 12], ["upgrade", 13], ["upgrade", 14], ["upgrade", 15], ]],
                ]],
            ]
        },
        "Mining": {
            unlocked(){
                if(hasUpgrade('m', 1)) return 1
                return 0
            },
            content:[
                ["display-text", function() { return 'Your pickaxe tier is ' + getBuyableAmount('m', 11) + '.' },
                {"font-size": "32px",}],
                ["display-text", function() { return `You can only mine ores which's tiers are lower than your pickaxe.`}],
                ["display-text", function() { return `Every extra tier in your pickaxe doubles ores gain.`}],
                ["display-text", function() { return `Buyables are revealed only when you have enough tier.`}],
                "blank",
                "blank",
                ["column", [
                    ["row", [["clickable", 11], "blank", ["clickable", 12], "blank", ["clickable", 13], "blank", ["clickable", 14], "blank", ["clickable", 15], ]],
                ]],
                "blank",
                "blank",
                ["column", [
                    ["row", [["buyable", 101], ["buyable", 102], ["buyable", 103], ]],
                    ["row", [["buyable", 111], ["buyable", 112], ["buyable", 113], ]],
                    ["row", [["buyable", 121], ["buyable", 122], ["buyable", 123], ]],
                ]],
            ]
        }
    },
    gainMult() {
        gain = new Decimal(1)

        if(hasUpgrade('p', 34)) gain = gain.times(upgradeEffect('p', 34))

        gain = gain.times(buyableEffect('m', 112))

        return gain
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 1,
    hotkeys: [
        {key: "m", description: "M: Reset for mining points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        1: {
            title: "buy a pickaxe",
            description: "buy a pickaxe that you can upgrade.",
            cost: new Decimal(1),
            unlocked() {
                return !hasUpgrade('m', 1)
            },
        },
        11: {
            title: "stone age",
            description: "stone boosts itself.",
            cost: new Decimal(2),
            tooltip: "log10(stone+1)+1",
            unlocked() {
                return hasUpgrade('m', 1)
            },
            effect() {
                return player.m.stone.add(1).log10().add(1)
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id))+"x" 
            },
        },
        12: {
            title: "failed cooking pizza, pizza became coal",
            description: "pizza boosts coal gain.",
            cost: new Decimal(4),
            tooltip: "max(1, <br>log10(🍕+1)-4)",
            unlocked() {
                return getBuyableAmount('m', 11).gte(1)
            },
            effect() {
                return player.p.points.add(1).log10().sub(4).max(1)
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id))+"x" 
            },
        },
        13: {
            title: "bronze age",
            description: "unspent mining points boost copper gain.",
            cost: new Decimal(24),
            tooltip: "log3.5(mp+1)+1",
            unlocked() {
                return getBuyableAmount('m', 11).gte(2)
            },
            effect() {
                return player.m.points.add(1).log(3.5).add(1)
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id))+"x" 
            },
        },
        14: {
            title: "iron age",
            description: "unlock a new ore (iron), and it boosts stone-copper.",
            cost: new Decimal("2000"),
            tooltip: "log2(iron+1)+1",
            unlocked() {
                return getBuyableAmount('m', 11).gte(5)
            },
            effect() {
                return player.m.iron.add(1).log(2).add(1)
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id))+"x" 
            },
        },
        15: {
            title: "simple iron boost",
            description: "iron is finally boosted... by points.",
            cost: new Decimal("1e4"),
            tooltip: "max(log10(points<br>+1)-10, 1)",
            unlocked() {
                return getBuyableAmount('m', 11).gte(7)
            },
            effect() {
                return player.points.add(1).log10().sub(10).max(1)
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id))+"x" 
            },
        },
    },
    buyables: {
        11: {
            title: "upgrade your pickaxe",
            cost() {
                cost = new Decimal(4).times(new Decimal(4).pow(getBuyableAmount(this.layer, this.id)))
                if(getBuyableAmount(this.layer, this.id).gte(8)) cost = new Decimal("1e100")
                return cost
            },
            display() {return "increase your pickaxe tier by 1.<br>based on your pickaxe tier,<br>reveal more upgrades." + 
            "<br>Current Tier: "+ format(getBuyableAmount(this.layer, this.id))+
            "<br>Cost: "+format(this.cost())+ " mining points"
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player.m.points = player.m.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade('m', 1)
            }
        },
        101: {
            title: "furnace",
            cost() {
                cost1 = new Decimal(10).times(new Decimal(1.4).pow(getBuyableAmount(this.layer, this.id).pow(1.4)))
                if(getBuyableAmount(this.layer, this.id).gte(10)) cost1 = cost1.times(new Decimal(2).pow(getBuyableAmount(this.layer, this.id).sub(10).pow(2)))

                return {
                    stone: cost1,
                }
            },
            display() {return "Tier: 0"+
            "<br>x"+format(buyableEffect('m', 113).add(2))+" points gain." + 
            "<br><br>amount: "+ format(getBuyableAmount(this.layer, this.id))+
            "<br>Total Effect: x"+format(this.effect())+
            "<br><br>Cost:"+
            "<br>"+format(this.cost().stone)+ " stone"
            },
            canAfford() {
                if(player.m.stone.lt(this.cost().stone)) return 0
                return 1
            },
            buy() {
                player.m.stone = player.m.stone.sub(this.cost().stone)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return 1
            },
            effect() {
                fbase = new Decimal(2)

                fbase = fbase.add(buyableEffect('m', 113))

                return fbase.pow(getBuyableAmount(this.layer, this.id))
            },
        },
        102: {
            title: "the 🍕 oven",
            cost() {
                cost1 = new Decimal(30).times(new Decimal(1.4).pow(getBuyableAmount(this.layer, this.id).pow(1.55)))
                if(getBuyableAmount(this.layer, this.id).gte(8)) cost1 = cost1. times(new Decimal(2).pow(getBuyableAmount(this.layer, this.id).sub(8).pow(3)))

                cost2 = new Decimal(10).times(new Decimal(1.4).pow(getBuyableAmount(this.layer, this.id).pow(1.55)))
                if(getBuyableAmount(this.layer, this.id).gte(12)) cost2 = cost2. times(new Decimal(2).pow(getBuyableAmount(this.layer, this.id).sub(12).pow(3)))

                return {
                    stone: cost1,
                    coal: cost2,
                }
            },
            display() {return "Tier: 1"+
            "<br>x2 🍕 gain." + 
            "<br><br>amount: "+ format(getBuyableAmount(this.layer, this.id))+
            "<br>Total Effect: x"+format(this.effect())+
            "<br><br>Cost:"+
            "<br>"+format(this.cost().stone)+ " stone"+
            "<br>"+format(this.cost().coal)+ " coal"
            },
            canAfford() {
                if(player.m.stone.lt(this.cost().stone)) return 0
                if(player.m.coal.lt(this.cost().coal)) return 0
                return 1
            },
            buy() {
                player.m.stone = player.m.stone.sub(this.cost().stone)
                player.m.coal = player.m.coal.sub(this.cost().coal)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                if(getBuyableAmount('m', 11).gte(1)) return 1
                return 0
            },
            effect() {
                return new Decimal(2).pow(getBuyableAmount(this.layer, this.id))
            },
        },
        103: {
            title: "bronze mirror",
            cost() {
                cost1 = new Decimal(100).times(new Decimal(1.4).pow(getBuyableAmount(this.layer, this.id).pow(1.25)))
                if(getBuyableAmount(this.layer, this.id).gte(12)) cost1 = cost1. times(new Decimal(2).pow(getBuyableAmount(this.layer, this.id).sub(12).pow(1.75)))

                cost2 = new Decimal(10).times(new Decimal(1.4).pow(getBuyableAmount(this.layer, this.id).pow(1.25)))
                if(getBuyableAmount(this.layer, this.id).gte(10)) cost2 = cost2. times(new Decimal(2).pow(getBuyableAmount(this.layer, this.id).sub(10).pow(1.75)))

                return {
                    coal: cost1,
                    copper: cost2,
                }
            },
            display() {return "Tier: 2"+
            "<br>x2 stone gain." + 
            "<br><br>amount: "+ format(getBuyableAmount(this.layer, this.id))+
            "<br>Total Effect: x"+format(this.effect())+
            "<br><br>Cost:"+
            "<br>"+format(this.cost().coal)+ " coal"+
            "<br>"+format(this.cost().copper)+ " copper"
            },
            canAfford() {
                if(player.m.coal.lt(this.cost().coal)) return 0
                if(player.m.copper.lt(this.cost().copper)) return 0
                return 1
            },
            buy() {
                player.m.coal = player.m.coal.sub(this.cost().coal)
                player.m.copper = player.m.copper.sub(this.cost().copper)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                if(getBuyableAmount('m', 11).gte(2)) return 1
                return 0
            },
            effect() {
                return new Decimal(2).pow(getBuyableAmount(this.layer, this.id))
            },
        },
        111: {
            title: "stone statue",
            cost() {
                cost1 = new Decimal(300).times(new Decimal(1.5).pow(getBuyableAmount(this.layer, this.id).pow(1.3)))
                if(getBuyableAmount(this.layer, this.id).gte(10)) cost1 = cost1.times(new Decimal(2).pow(getBuyableAmount(this.layer, this.id).sub(10).pow(2)))

                return {
                    stone: cost1,
                }
            },
            display() {return "Tier: 2"+
            "<br>x1.25 all ores gain." + 
            "<br><br>amount: "+ format(getBuyableAmount(this.layer, this.id))+
            "<br>Total Effect: x"+format(this.effect())+
            "<br><br>Cost:"+
            "<br>"+format(this.cost().stone)+ " stone"
            },
            canAfford() {
                if(player.m.stone.lt(this.cost().stone)) return 0
                return 1
            },
            buy() {
                player.m.stone = player.m.stone.sub(this.cost().stone)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                if(getBuyableAmount('m', 11).gte(2)) return 1
                return 0
            },
            effect() {
                return new Decimal(1.25).pow(getBuyableAmount(this.layer, this.id))
            },
        },
        112: {
            title: "more mining pod",
            cost() {
                cost1 = new Decimal("1e9").times(new Decimal(2).pow(getBuyableAmount(this.layer, this.id).add(1).pow(1.65)))
                
                cost2 = new Decimal("1e5").times(new Decimal(2).pow(getBuyableAmount(this.layer, this.id).add(1).pow(1.5)))
                
                cost3 = new Decimal("2.5e4").times(new Decimal(2).pow(getBuyableAmount(this.layer, this.id).add(1).pow(1.5)))
                
                cost4 = new Decimal(1000).times(new Decimal(1.5).pow(getBuyableAmount(this.layer, this.id).pow(1.5)))

                return {
                    stone: cost1,
                    coal: cost2,
                    copper: cost3,
                    iron: cost4,
                }
            },
            display() {return "Tier: 5"+
            "<br>x2 mp gain." + 
            "<br><br>amount: "+ format(getBuyableAmount(this.layer, this.id))+
            "<br>Total Effect: x"+format(this.effect())+
            "<br><br>Cost:"+
            "<br>"+format(this.cost().stone)+ " stone"+
            "<br>"+format(this.cost().coal)+ " coal"+
            "<br>"+format(this.cost().copper)+ " copper"+
            "<br>"+format(this.cost().iron)+ " iron"
            },
            canAfford() {
                if(player.m.stone.lt(this.cost().stone)) return 0
                if(player.m.coal.lt(this.cost().coal)) return 0
                if(player.m.copper.lt(this.cost().copper)) return 0
                if(player.m.iron.lt(this.cost().iron)) return 0
                return 1
            },
            buy() {
                player.m.stone = player.m.stone.sub(this.cost().stone)
                player.m.coal = player.m.coal.sub(this.cost().coal)
                player.m.copper = player.m.copper.sub(this.cost().copper)
                player.m.iron = player.m.iron.sub(this.cost().iron)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                if(getBuyableAmount('m', 11).gte(5)) return 1
                return 0
            },
            effect() {
                return new Decimal(2).pow(getBuyableAmount(this.layer, this.id))
            },
        },
        113: {
            title: "iron furnace",
            cost() {
                cost1 = new Decimal(1000).times(new Decimal(1.5).pow(getBuyableAmount(this.layer, this.id).pow(1.3)))
                if(getBuyableAmount(this.layer, this.id).gte(10)) cost1 = cost1.times(new Decimal(2).pow(getBuyableAmount(this.layer, this.id).sub(10).pow(2)))

                return {
                    iron: cost1,
                }
            },
            display() {return "Tier: 6"+
            "<br>furnace base +0.1 (base: 2)" + 
            "<br><br>amount: "+ format(getBuyableAmount(this.layer, this.id))+
            "<br>Total Effect: +x"+format(this.effect())+
            "<br><br>Cost:"+
            "<br>"+format(this.cost().iron)+ " iron"
            },
            canAfford() {
                if(player.m.iron.lt(this.cost().iron)) return 0
                return 1
            },
            buy() {
                player.m.iron = player.m.iron.sub(this.cost().iron)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                if(getBuyableAmount('m', 11).gte(6)) return 1
                return 0
            },
            effect() {
                return new Decimal(0.1).times(getBuyableAmount(this.layer, this.id))
            },
        },
    },
    clickables: {
        11: {
            title: "Stone",
            style() {return{
                'background-color': "#7F7F7F",
            }},
            canClick() {return hasUpgrade("m", 1)},
            onClick() {return 0}, //haha this do nothing
            display() { 
                basetier = new Decimal(0)
                if(getBuyableAmount('m', 11).lt(basetier)){
                    return "Tier: "+basetier+"<br>Amount: "+format(player.m.stone)
                }
                text = "Tier: "+basetier+"<br>"+
                "Amount: "+format(player.m.stone)+"<br>"+
                "+"+format(this.effect())+"/s when held"
                return text
            },
            onHold() {
                gain = this.effect().div(20)
                player.m.stone = player.m.stone.add(gain)
            },
            effect() {
                basetier = new Decimal(0)
                gain = new Decimal(2).pow(getBuyableAmount('m', 11).sub(basetier))

                if(hasUpgrade('m', 11)) gain = gain.mul(upgradeEffect('m', 11))
                if(hasUpgrade('m', 14)) gain = gain.mul(upgradeEffect('m', 14))

                gain = gain.mul(buyableEffect('m', 103))
                gain = gain.mul(buyableEffect('m', 111))

                return gain
            }
        },
        12: {
            title: "Coal",
            style() {return{
                'background-color': "#4F4F4F",
            }},
            canClick() {return getBuyableAmount("m", 11).gte(new Decimal(1))},
            onClick() {return 0}, //haha this do nothing
            display() { 
                basetier = new Decimal(1)
                if(getBuyableAmount('m', 11).lt(basetier)){
                    return "Tier: "+basetier+"<br>Amount: "+format(player.m.coal)
                }
                text = "Tier: "+basetier+"<br>"+
                "Amount: "+format(player.m.coal)+"<br>"+
                "+"+format(this.effect())+"/s when held"
                return text
            },
            onHold() {
                gain = this.effect().div(20)
                player.m.coal = player.m.coal.add(gain)
            },
            effect() {
                basetier = new Decimal(1)
                gain = new Decimal(2).pow(getBuyableAmount('m', 11).sub(basetier))

                if(hasUpgrade('m', 12)) gain = gain.mul(upgradeEffect('m', 12))
                if(hasUpgrade('m', 14)) gain = gain.mul(upgradeEffect('m', 14))

                gain = gain.mul(buyableEffect('m', 111))

                return gain
            }
        },
        13: {
            title: "Copper",
            style() {return{
                'background-color': "#BF9F7F",
            }},
            canClick() {return getBuyableAmount("m", 11).gte(new Decimal(2))},
            onClick() {return 0}, //haha this do nothing
            display() { 
                basetier = new Decimal(2)
                if(getBuyableAmount('m', 11).lt(basetier)){
                    return "Tier: "+basetier+"<br>Amount: "+format(player.m.copper)
                }
                text = "Tier: "+basetier+"<br>"+
                "Amount: "+format(player.m.copper)+"<br>"+
                "+"+format(this.effect())+"/s when held"
                return text
            },
            onHold() {
                gain = this.effect().div(20)
                player.m.copper = player.m.copper.add(gain)
            },
            effect() {
                basetier = new Decimal(2)
                gain = new Decimal(2).pow(getBuyableAmount('m', 11).sub(basetier))

                if(hasUpgrade('m', 13)) gain = gain.mul(upgradeEffect('m', 13))
                if(hasUpgrade('m', 14)) gain = gain.mul(upgradeEffect('m', 14))

                gain = gain.mul(buyableEffect('m', 111))

                return gain
            }
        },
        14: {
            title: "Iron",
            style() {return{
                'background-color': "#BFBFBF",
            }},
            unlocked() {return hasUpgrade("m", 14)},
            canClick() {return getBuyableAmount("m", 11).gte(new Decimal(5))},
            onClick() {return 0}, //haha this do nothing
            display() { 
                basetier = new Decimal(5)
                if(getBuyableAmount('m', 11).lt(basetier)){
                    return "Tier: "+basetier+"<br>Amount: "+format(player.m.iron)
                }
                text = "Tier: "+basetier+"<br>"+
                "Amount: "+format(player.m.iron)+"<br>"+
                "+"+format(this.effect())+"/s when held"
                return text
            },
            onHold() {
                gain = this.effect().div(20)
                player.m.iron = player.m.iron.add(gain)
            },
            effect() {
                basetier = new Decimal(5)
                gain = new Decimal(2).pow(getBuyableAmount('m', 11).sub(basetier))

                if(hasUpgrade('m', 15)) gain = gain.mul(upgradeEffect('m', 15))

                gain = gain.mul(buyableEffect('m', 111))

                return gain
            }
        },
    },
})