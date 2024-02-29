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

    passiveGeneration() {
        if(hasUpgrade('d', 12)) {
            if (hasUpgrade('d', 33)){
                return 1
            }
            if (hasUpgrade('d', 13)){
                return 0.01
            }
            else{
                return 0.0025
            }
        }
        return 0
    },

    doReset(resettingLayer) {
        if (layers[resettingLayer].row <= this.row) return
        let keptUpgrades = [];
        if (hasUpgrade('d', 32) && resettingLayer == "d") 
        {keptUpgrades.push(11,12,13,14,15,16,21,22,23,24,25,26,31,32,33,34,35,41,42,43,44,45)} 
        else {
         if (new Decimal(1).eq(getBuyableAmount('u', 41))) keptUpgrades.push(11,12,13,14,15,16)
         if (new Decimal(1).eq(getBuyableAmount('u', 51))) keptUpgrades.push(21,22,23,24,25,26)
         if (new Decimal(1).eq(getBuyableAmount('u', 61))) keptUpgrades.push(31,32,33,34,35)
         if (new Decimal(1).eq(getBuyableAmount('u', 71))) keptUpgrades.push(41,42,43,44)
        }
     let keep = [];
     if (hasUpgrade('d', 31) && resettingLayer == "d") keep.push(buyables)

     layerDataReset(this.layer, keep);
     player[this.layer].upgrades.push(...keptUpgrades);
     },

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
            if (hasUpgrade('p', i)) mult = mult.times(2)
        }

        if(hasUpgrade('p', 33)) mult = mult.times(upgradeEffect('p', 33))

        if(hasUpgrade('p', 41)) mult = mult.div(7)
        if(hasUpgrade('p', 42)) mult = mult.div(0.1)

	    mult = mult.times(buyableEffect('p', 12))
        
	    mult = mult.times(buyableEffect('m', 102))

        if(getBuyableAmount('u', 13).gte(1)) mult=mult.times(3)
        
        mult = mult.times(buyableEffect('u', 32))

        if(hasUpgrade('p', 35)) mult = mult.times(upgradeEffect('p', 35))

        if(hasUpgrade('d', 11)) mult = mult.times(2)

        mult = mult.times(buyableEffect('d', 12))

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
        35: {
            title: "add weird white powder to the pizza",
            description: "shard boost pizza gain.",
            cost: new Decimal("1e13"),
            tooltip: "log2(shard+1)+1",
            unlocked(){
                if(!hasUpgrade('p', 34)) return 0
                if(new Decimal(1).gt(getBuyableAmount('u', 42))) return 0
                return 1
            },
            effect(){
                rt = player.u.points.add(1).log(2).add(1)
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
        44: {
            title: "pizzas everywhere",
            description: "pizzas boost upgrade shards gain, at a VERY reduced rate.",
            cost: new Decimal("3e21"),
            tooltip: "max(1,<br>log1e5(🍕+1)-3)",
            unlocked(){
                if(!hasUpgrade('p', 35)) return 0
                if(new Decimal(1).gt(getBuyableAmount('u', 42))) return 0
                return 1
            },
            effect(){
                rt = player.p.points.log("1e5").sub(3).max(1)
                return rt
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id))+"x" 
            },
        },
        45: {
            title: "EVERYTHING PIZZA",
            description: "placeholder rn",
            cost: new Decimal("1e100"),
            unlocked(){
                if(!hasUpgrade('p', 44)) return 0
                if(new Decimal(1).gt(getBuyableAmount('u', 42))) return 0
                return 1
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

                cost = cost.div(buyableEffect('u', 63))

                return cost
            },
            display() {return "x1.5 points per upgrade." + 
            "<br><br>Amount: "+ format(getBuyableAmount(this.layer, this.id))+
            "<br>Effect: x"+ format(this.effect())+
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

                cost = cost.div(buyableEffect('u', 63))

                return cost
            },
            display() {return "x2 🍕 per upgrade." + 
            "<br><br>Amount: "+ format(getBuyableAmount(this.layer, this.id))+
            "<br>Effect: x"+ format(this.effect())+
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
        13: {
            title: "add throuple to the pizza",
            cost() {
                cost = new Decimal("1e24").times(new Decimal(5).pow(getBuyableAmount(this.layer, this.id)))
                if(getBuyableAmount(this.layer, this.id).gte(2)) cost = cost.times(new Decimal(2).pow(getBuyableAmount(this.layer, this.id).sub(2).pow(1.5)))

                cost = cost.div(buyableEffect('u', 63))

                return cost
            },
            display() {return "add throuple to food, more money. x1.5 💵 gain per purchase." + 
            "<br><br>Amount: "+ format(getBuyableAmount(this.layer, this.id))+
            "<br>Effect: x"+ format(this.effect())+
            "<br>Cost: "+format(this.cost())+ " 🍕"
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player.p.points = player.p.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade('d', 23)
            },
            effect() {
                return new Decimal(1.5).pow(getBuyableAmount(this.layer, this.id))
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

        AMleft() {
            am = new Decimal(getBuyableAmount('m', 21))
            for(i=201;i<205;++i)
                am = am.sub(getBuyableAmount('m', i))
            return am
        }
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
                    ["row", [["buyable", 11], "blank", ["buyable", 21],]],
                ]],
                "blank",
                ["column", [
                    ["row", [["upgrade", 1], ]],
                    ["row", [["upgrade", 11], ["upgrade", 12], ["upgrade", 13], ["upgrade", 14], ["upgrade", 15], ]],
                    ["row", [["upgrade", 21], ["upgrade", 22], ["upgrade", 23], ["upgrade", 24], ["upgrade", 25], ]],
                ]],
            ]
        },
        "Mining": {
            unlocked(){
                if(hasUpgrade('m', 1)) return 1
                return 0
            },
            content:[
                ["display-text", function() { return 'Your pickaxe tier is ' + formatWhole(getBuyableAmount('m', 11)) + '.' },
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
        },
        "Autominer": {
            unlocked(){
                if(getBuyableAmount('u', 33).gte(1)) return 1
                return 0
            },
            content:[
                ["buyable", 21],
                ["display-text", function() { return 'You have '+formatWhole(player.m.AMleft())+'/'+getBuyableAmount('m', 21)+' Autominers.'},
                {"font-size": "32px",}],
                ["display-text", function() { return "Also autominers don't mine offline :troll:"},
                {"color": "#555555",}],
                "blank",
                "blank",
                ["row", [
                    ["column", [["buyable", 201], ["clickable", 201], ]], "blank", 
                    ["column", [["buyable", 202], ["clickable", 202], ]], "blank", 
                    ["column", [["buyable", 203], ["clickable", 203], ]], "blank", 
                    ["column", [["buyable", 204], ["clickable", 204], ]], "blank", 
                ]],
            ]
        }
    },
    gainMult() {
        gain = new Decimal(1)

        if(hasUpgrade('p', 34)) gain = gain.times(upgradeEffect('p', 34))

        gain = gain.times(buyableEffect('m', 112))

        gain = gain.times(buyableEffect('u', 34))

        return gain
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 1,
    hotkeys: [
        {key: "m", description: "M: Reset for mining points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    automate() {
        player.m.stone = player.m.stone.add(buyableEffect('m', 201).mul(clickableEffect('m', 11)).div(20))
        player.m.coal = player.m.coal.add(buyableEffect('m', 202).mul(clickableEffect('m', 12)).div(20))
        player.m.copper = player.m.copper.add(buyableEffect('m', 203).mul(clickableEffect('m', 13)).div(20))
        player.m.iron = player.m.iron.add(buyableEffect('m', 204).mul(clickableEffect('m', 14)).div(20))
    },

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
        21: {
            title: "bronze statue",
            description: "stone statue base effect 1.25 -> 1.40.",
            cost: new Decimal("2.75e8"),
            unlocked() {
                return getBuyableAmount('m', 11).gte(11)
            },
            effect(){
                if(hasUpgrade(this.layer, this.id)) return new Decimal(1.4)
                return new Decimal(1.25)
            }
        },
    },
    buyables: {
        11: {
            title: "upgrade your pickaxe",
            cost() {
                cost = buyableEffect('u', 53).times(new Decimal(4).pow(getBuyableAmount(this.layer, this.id)))
                if(getBuyableAmount(this.layer, this.id).gte(8)) cost = cost.times(new Decimal(4).pow(getBuyableAmount(this.layer, this.id).sub(7).pow(1.08)))
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
        21: {
            title: "Autominer",
            cost() {
                cost = buyableEffect('u', 43).pow(getBuyableAmount(this.layer, this.id))
                return cost
            },
            display() {return "get an autominer." + 
            "<br>Amount: "+ format(getBuyableAmount(this.layer, this.id))+
            "<br>Cost: "+format(this.cost())+ " mining points"
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player.m.points = player.m.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return getBuyableAmount('u', 33).gte(1) && hasUpgrade('m', 1)
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
            "<br>x"+format(upgradeEffect('m', 21))+" all ores gain." + 
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
                return upgradeEffect('m', 21).pow(getBuyableAmount(this.layer, this.id))
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
        201: {
            title: "Stone",
            style() {return{
                'background-color': "#7F7F7F",
                'height': '100px',
                'width': '100px',
            }},
            display() {return "assigned: "+getBuyableAmount(this.layer, this.id)+
            "<br><br>"+format(this.effect().mul(clickableEffect('m', 11)))+"/s"+
            "<br>("+format(this.effect().mul(100))+"%)"
            },
            canAfford() {
                if(player.m.AMleft().gte(1)) return 1
                return 0
            },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                if(hasUpgrade('m', 1)) return 1
                return 0
            },
            effect() {
                if(getBuyableAmount(this.layer, this.id) == 0) return new Decimal(0)
                else return new Decimal(3).pow(getBuyableAmount(this.layer, this.id).log(2))
            },
        },
        202: {
            title: "Coal",
            style() {return{
                'background-color': "#4F4F4F",
                'height': '100px',
                'width': '100px',
            }},
            display() {return "assigned: "+getBuyableAmount(this.layer, this.id)+
            "<br><br>"+format(this.effect().mul(clickableEffect('m', 12)))+"/s"+
            "<br>("+format(this.effect().mul(100))+"%)"
            },
            canAfford() {
                if(player.m.AMleft().gte(1)) return 1
                return 0
            },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                if(getBuyableAmount('m', 11).gte(1)) return 1
                return 0
            },
            effect() {
                if(getBuyableAmount(this.layer, this.id) == 0) return new Decimal(0)
                else return new Decimal(3).pow(getBuyableAmount(this.layer, this.id).log(2))
            },
        },
        203: {
            title: "Copper",
            style() {return{
                'background-color': "#BF9F7F",
                'height': '100px',
                'width': '100px',
            }},
            display() {return "assigned: "+getBuyableAmount(this.layer, this.id)+
            "<br><br>"+format(this.effect().mul(clickableEffect('m', 13)))+"/s"+
            "<br>("+format(this.effect().mul(100))+"%)"
            },
            canAfford() {
                if(player.m.AMleft().gte(1)) return 1
                return 0
            },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                if(getBuyableAmount('m', 11).gte(2)) return 1
                return 0
            },
            effect() {
                if(getBuyableAmount(this.layer, this.id) == 0) return new Decimal(0)
                else return new Decimal(3).pow(getBuyableAmount(this.layer, this.id).log(2))
            },
        },
        204: {
            title: "Iron",
            style() {return{
                'background-color': "#BFBFBF",
                'height': '100px',
                'width': '100px',
            }},
            display() {return "assigned: "+getBuyableAmount(this.layer, this.id)+
            "<br><br>"+format(this.effect().mul(clickableEffect('m', 14)))+"/s"+
            "<br>("+format(this.effect().mul(100))+"%)"
            },
            canAfford() {
                if(player.m.AMleft().gte(1)) return 1
                return 0
            },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                if(getBuyableAmount('m', 11).gte(5)) return 1
                return 0
            },
            effect() {
                if(getBuyableAmount(this.layer, this.id) == 0) return new Decimal(0)
                else return new Decimal(3).pow(getBuyableAmount(this.layer, this.id).log(2))
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
                gain = gain.mul(buyableEffect('u', 23))
                gain = gain.mul(buyableEffect('u', 45))
                gain = gain.mul(buyableEffect('u', 55))
                gain = gain.times(buyableEffect('d', 13))

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
                gain = gain.mul(buyableEffect('u', 23))
                gain = gain.mul(buyableEffect('u', 55))
                gain = gain.times(buyableEffect('d', 13))

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
                gain = gain.mul(buyableEffect('u', 23))
                gain = gain.mul(buyableEffect('u', 55))
                gain = gain.times(buyableEffect('d', 13))

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
                gain = gain.mul(buyableEffect('u', 23))
                gain = gain.mul(buyableEffect('u', 55))
                gain = gain.times(buyableEffect('d', 13))

                return gain
            }
        },
        201: {
            title: "Unassign",
            style() {return{
                'background-color': "#7F7F7F",
                'min-height': '40px',
                'height': '40px',
                'width': '100px',
            }},
            unlocked() {return hasUpgrade("m", 1)},
            canClick() {return getBuyableAmount("m", this.id).gte(new Decimal(1))},
            onClick() {setBuyableAmount("m", this.id, getBuyableAmount("m", this.id).sub(1))},

        },
        202: {
            title: "Unassign",
            style() {return{
                'background-color': "#4F4F4F",
                'min-height': '40px',
                'height': '40px',
                'width': '100px',
            }},
            unlocked() {return getBuyableAmount('m', 11).gte(1)},
            canClick() {return getBuyableAmount("m", this.id).gte(new Decimal(1))},
            onClick() {setBuyableAmount("m", this.id, getBuyableAmount("m", this.id).sub(1))},

        },
        203: {
            title: "Unassign",
            style() {return{
                'background-color': "#BF9F7F",
                'min-height': '40px',
                'height': '40px',
                'width': '100px',
            }},
            unlocked() {return getBuyableAmount('m', 11).gte(2)},
            canClick() {return getBuyableAmount("m", this.id).gte(new Decimal(1))},
            onClick() {setBuyableAmount("m", this.id, getBuyableAmount("m", this.id).sub(1))},

        },
        204: {
            title: "Unassign",
            style() {return{
                'background-color': "#BFBFBF",
                'min-height': '40px',
                'height': '40px',
                'width': '100px',
            }},
            unlocked() {return getBuyableAmount('m', 11).gte(5)},
            canClick() {return getBuyableAmount("m", this.id).gte(new Decimal(1))},
            onClick() {setBuyableAmount("m", this.id, getBuyableAmount("m", this.id).sub(1))},

        },
    },
})
addLayer("d", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},

    color: "#007F00",
    symbol: "💵",
    resource: "dollar",
    row: 1,
    position: 1,
    hotkeys: [
        {key: "d", description: "D: Reset for dollars", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    branches: ['p'],

    baseResource: "pizza",
    baseAmount() { return player.p.points },

    requires: new Decimal("1e22"),

    layerShown() {
        if (new Decimal(1).eq(getBuyableAmount('u', 52))) return true
        return false
    },

    type: "normal",
    exponent: 0.24,

    tabFormat: [
        "main-display",
        ["row", ["prestige-button", "blank", ["clickable", 11]]],
        "resource-display",
        "upgrades",
        "blank",
        "buyables",
    ],

    gainMult() {
        mult = new Decimal(1)

        mult = mult.times(buyableEffect('u', 62))
        mult = mult.times(buyableEffect('p', 13))

        mult = mult.times(buyableEffect('d', 14))

        return mult
    },
    gainExp() {
        exp = new Decimal(1)

        return exp
    },

    upgrades: {
        11: {
            title: "customer service",
            description: "x2 pizza gain.",
            cost: new Decimal(3),
        },
        12: {
            title: "hiring employees, finally",
            description: "gain 0.25% of pizza gain per second.",
            cost: new Decimal(10),
            unlocked() {
                return hasUpgrade('d', 11)
            }
        },
        13: {
            title: "advanced employees",
            description: "employees now produce 1% of pizza gain per second.",
            cost: new Decimal(25),
            unlocked() {
                return hasUpgrade('d', 12)
            }
        },
        21: {
            title: "honestly idk what to name these now",
            description: "x2 points gain.",
            cost: new Decimal(3),
        },
        22: {
            title: "shards made out of dollars",
            description: "x1.1 shards gain.",
            cost: new Decimal(11),
            unlocked() {
                return hasUpgrade('d', 21)
            }
        },
        23: {
            title: "money grabber",
            description: "unlock a new pizza buyable.",
            cost: new Decimal(40),
            unlocked() {
                return (hasUpgrade('d', 13) && hasUpgrade('d', 22))
            }
        },
        31: {
            title: "recycle",
            description: "keep pizza buyables on dollar reset.",
            cost: new Decimal(120),
            unlocked() {
                return hasUpgrade('d', 23)
            }
        },
        32: {
            title: "the last thing you wanted",
            description: "keep all pizza upgrades up to row 4 (except 45) on dollar reset.",
            cost: new Decimal(225),
            unlocked() {
                return hasUpgrade('d', 31)
            }
        },
        33: {
            title: "employees are very efficient",
            description: "ok. employees now produce 100% of pizza gain per second.",
            cost: new Decimal(400),
            unlocked() {
                return hasUpgrade('d', 32)
            }
        },
        41: {
            title: "money can do anything",
            description: "unlock dollar buyables.",
            cost: new Decimal("1e3"),
            unlocked() {
                return hasUpgrade('d', 33)
            }
        },
    },

    milestones: {
    },

    buyables: {
        11: {
            title: "Buy points with money",
            style() {return{
                'height': "135px",
                'width': "135px",
            }},
            canClick() {return player[this.layer].points.gte(this.cost())},
            cost() {
                cost = new Decimal(100).mul(new Decimal(2).pow(getBuyableAmount(this.layer, this.id)))
                if(getBuyableAmount(this.layer, this.id).gte(10)) cost = cost.times(new Decimal(2).pow(new Decimal(1.3).pow(getBuyableAmount(this.layer, this.id).sub(10))))

                return cost
            },
            display() { 
                return "2x points gain per purchase."+
                "<br><br>cost: "+format(this.cost())+" dollars"+
                "<br><br>current: x"+format(this.effect())+" <br>"
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade(this.layer, 41)
            },
            effect() {
                return new Decimal(2).pow(getBuyableAmount(this.layer, this.id))
            },
        },
        12: {
            title: "Buy pizza with money",
            style() {return{
                'height': "135px",
                'width': "135px",
            }},
            canClick() {return player[this.layer].points.gte(this.cost())},
            cost() {
                cost = new Decimal(100).mul(new Decimal(2).pow(getBuyableAmount(this.layer, this.id)))
                if(getBuyableAmount(this.layer, this.id).gte(10)) cost = cost.times(new Decimal(2).pow(new Decimal(1.3).pow(getBuyableAmount(this.layer, this.id).sub(10))))

                return cost
            },
            display() { 
                return "1.6x pizza gain per purchase."+
                "<br><br>cost: "+format(this.cost())+" dollars"+
                "<br><br>current: x"+format(this.effect())+" <br>"
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade(this.layer, 41)
            },
            effect() {
                return new Decimal(1.6).pow(getBuyableAmount(this.layer, this.id))
            },
        },
        13: {
            title: "Buy ores with money",
            style() {return{
                'height': "135px",
                'width': "135px",
            }},
            canClick() {return player[this.layer].points.gte(this.cost())},
            cost() {
                cost = new Decimal(100).mul(new Decimal(2).pow(getBuyableAmount(this.layer, this.id)))
                if(getBuyableAmount(this.layer, this.id).gte(10)) cost = cost.times(new Decimal(2).pow(new Decimal(1.3).pow(getBuyableAmount(this.layer, this.id).sub(10))))

                return cost
            },
            display() { 
                return "1.4x stone-iron gain per purchase."+
                "<br><br>cost: "+format(this.cost())+" dollars"+
                "<br><br>current: x"+format(this.effect())+" <br>"
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade(this.layer, 41)
            },
            effect() {
                return new Decimal(1.4).pow(getBuyableAmount(this.layer, this.id))
            },
        },
        14: {
            title: "Buy money with money",
            style() {return{
                'height': "135px",
                'width': "135px",
            }},
            canClick() {return player[this.layer].points.gte(this.cost())},
            cost() {
                cost = new Decimal(100).mul(new Decimal(2).pow(getBuyableAmount(this.layer, this.id)))
                if(getBuyableAmount(this.layer, this.id).gte(10)) cost = cost.times(new Decimal(2).pow(new Decimal(1.3).pow(getBuyableAmount(this.layer, this.id).sub(10))))

                return cost
            },
            display() { 
                return "1.2x money gain per purchase."+
                "<br><br>cost: "+format(this.cost())+" dollars"+
                "<br><br>current: x"+format(this.effect())+" <br>"
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade(this.layer, 41)
            },
            effect() {
                return new Decimal(1.2).pow(getBuyableAmount(this.layer, this.id))
            },
        },
        15: {
            title: "Buy shards with money",
            style() {return{
                'height': "135px",
                'width': "135px",
            }},
            canClick() {return player[this.layer].points.gte(this.cost())},
            cost() {
                cost = new Decimal(100).mul(new Decimal(2).pow(getBuyableAmount(this.layer, this.id)))
                if(getBuyableAmount(this.layer, this.id).gte(10)) cost = cost.times(new Decimal(2).pow(new Decimal(1.3).pow(getBuyableAmount(this.layer, this.id).sub(10))))

                return cost
            },
            display() { 
                return "1.1x shards gain per purchase."+
                "<br><br>cost: "+format(this.cost())+" dollars"+
                "<br><br>current: x"+format(this.effect())+" <br>"
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasUpgrade(this.layer, 41)
            },
            effect() {
                return new Decimal(1.1).pow(getBuyableAmount(this.layer, this.id))
            },
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
})
addLayer("u", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},

    color: "#AFFFFF",
    symbol: "💠",
    resource: "upgrade shards",
    row: 2,
    hotkeys: [
        {key: "u", description: "U: Reset for upgrade shards", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    branches: ['m'],

    baseResource: "pickaxe tier",
    baseAmount() { return getBuyableAmount('m', 11) },

    requires: new Decimal(1),

    layerShown() {
        if(hasMilestone(this.layer, 11)) return true
        return false
    },

    type: "normal",
    exponent: 1,

    automate() {
        if(new Decimal(1).eq(getBuyableAmount('u', 54))) player.u.points = player.u.points.add(buyableEffect('u', 54).div(20))
    },

    tabFormat: {
        "Main": {
            content:[
                "main-display",
                "prestige-button",
                "blank",
                "blank",
                "milestones",
                "blank",
                "upgrades",
            ]
        },
        "Upgrade Tree": {
            unlocked() { return hasUpgrade('u', 11) },
            content:[
                "main-display",
                ["column", [
                    ["row", [["buyable", 11], "blank", ["buyable", 12], "blank", ["buyable", 13], "blank", ["buyable", 14], "blank", ["buyable", 15], ]],
                    "blank",
                    ["row", [["buyable", 21], "blank", ["buyable", 22], "blank", ["buyable", 23], "blank", ["buyable", 24], "blank", ["buyable", 25], ]],
                    "blank",
                    ["row", [["buyable", 31], "blank", ["buyable", 32], "blank", ["buyable", 33], "blank", ["buyable", 34], "blank", ["buyable", 35], ]],
                    "blank",
                    ["row", [["buyable", 41], "blank", ["buyable", 42], "blank", ["buyable", 43], "blank", ["buyable", 44], "blank", ["buyable", 45], ]],
                    "blank",
                    ["row", [["buyable", 51], "blank", ["buyable", 52], "blank", ["buyable", 53], "blank", ["buyable", 54], "blank", ["buyable", 55], ]],
                    "blank",
                    ["row", [["buyable", 61], "blank", ["buyable", 62], "blank", ["buyable", 63], "blank", ["buyable", 64], "blank", ["buyable", 65], ]],
                    "blank",
                    ["row", [["buyable", 71], "blank", ["buyable", 72], "blank", ["buyable", 73], "blank", ["buyable", 74], "blank", ["buyable", 75], ]],
                    "blank",
                    ["row", [["buyable", 81], "blank", ["buyable", 82], "blank", ["buyable", 83], "blank", ["buyable", 84], "blank", ["buyable", 85], ]],
                    "blank",
                    ["row", [["buyable", 91], "blank", ["buyable", 92], "blank", ["buyable", 93], "blank", ["buyable", 94], "blank", ["buyable", 95], ]],
                    "blank",
                    ["row", [["buyable", 101], "blank", ["buyable", 102], "blank", ["buyable", 103], "blank", ["buyable", 104], "blank", ["buyable", 105], ]],
                    "blank",
                ]],
            ]
        }
    },

    gainMult() {
        mult = new Decimal(1)

        if(hasUpgrade('p', 44)) mult = mult.times(upgradeEffect('p', 44))
        if(new Decimal(1).eq(getBuyableAmount('u', 44))) mult = mult.times(buyableEffect('u', 44))
        if(hasUpgrade('d', 22)) mult = mult.times(1.1)

        mult = mult.times(buyableEffect('d', 15))

        return mult
    },
    gainExp() {
        exp = new Decimal(1)
        exp = exp.add(buyableEffect('u', 24))
        return exp
    },

    upgrades: {
        11: {
            title: "grow a tree",
            description: "unlock the upgrade tree.",
            cost: new Decimal(3),
        },
    },

    milestones: {
        11: {
            requirementDescription: "Pickaxe Tier 8",
            effectDescription: "Reveal this layer.",
            done() { return getBuyableAmount('m', 11).gte(8) }
        },
    },

    buyables: {
        13: {
            title: "Simple Booster",
            style() {return{
                'height': "110px",
                'width': "110px",
            }},
            canClick() {return player.u.points.gte(this.cost())},
            cost() {
                cost = new Decimal(5)

                return cost
            },
            purchaseLimit: 1,
            display() { 
                return "cost: "+format(this.cost())+"<br>"+
                "multiply points & pizza gain by 3.<br>"+
                (this.purchaseLimit!==1?formatWhole(getBuyableAmount(this.layer, this.id))+"/"+this.purchaseLimit:"")
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return true
            },
        },
        22: {
            title: "Point Lover",
            style() {return{
                'height': "110px",
                'width': "110px",
            }},
            canClick() {return player.u.points.gte(this.cost())},
            cost() {
                cost = new Decimal(1.2).pow(getBuyableAmount(this.layer, this.id))

                return cost
            },
            purchaseLimit: 10,
            display() { 
                return "cost: "+format(this.cost())+"<br>"+
                "+5 base point per purchase.<br>"+
                "current: +"+format(buyableEffect(this.layer, this.id))+"<br>"+
                (this.purchaseLimit!==1?formatWhole(getBuyableAmount(this.layer, this.id))+"/"+this.purchaseLimit:"")
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return getBuyableAmount(this.layer, 13).gte(1)
            },
            effect() {
                return new Decimal(5).times(getBuyableAmount(this.layer, this.id))
            },
            branches: [13],
        },
        23: {
            title: "Ores Lover",
            style() {return{
                'height': "110px",
                'width': "110px",
            }},
            canClick() {return player.u.points.gte(this.cost())},
            cost() {
                cost = new Decimal(1.4).pow(getBuyableAmount(this.layer, this.id))

                return cost
            },
            purchaseLimit: 10,
            display() { 
                return "cost: "+format(this.cost())+"<br>"+
                "x1.3 all ores gain per purchase.<br>"+
                "current: x"+format(buyableEffect(this.layer, this.id))+"<br>"+
                (this.purchaseLimit!==1?formatWhole(getBuyableAmount(this.layer, this.id))+"/"+this.purchaseLimit:"")
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return getBuyableAmount(this.layer, 13).gte(1)
            },
            effect() {
                return new Decimal(1.3).pow(getBuyableAmount(this.layer, this.id))
            },
            branches: [13],
        },
        24: {
            title: "Shards Lover",
            style() {return{
                'height': "110px",
                'width': "110px",
            }},
            canClick() {return player.u.points.gte(this.cost())},
            cost() {
                cost = new Decimal(4).pow(getBuyableAmount(this.layer, this.id))

                return cost
            },
            purchaseLimit: 10,
            display() { 
                return "cost: "+format(this.cost())+"<br>"+
                "shards gain exponent +0.08 per purchase.<br>"+
                "current: +"+format(buyableEffect(this.layer, this.id))+"<br>"+
                (this.purchaseLimit!==1?formatWhole(getBuyableAmount(this.layer, this.id))+"/"+this.purchaseLimit:"")
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return getBuyableAmount(this.layer, 13).gte(1)
            },
            effect() {
                return new Decimal(0.08).times(getBuyableAmount(this.layer, this.id))
            },
            branches: [13],
        },
        32: {
            title: "Pizza Lover",
            style() {return{
                'height': "110px",
                'width': "110px",
            }},
            canClick() {return player.u.points.gte(this.cost())},
            cost() {
                cost = new Decimal(5).mul(new Decimal(1.3).pow(getBuyableAmount(this.layer, this.id)))
                if(getBuyableAmount(this.layer, this.id)) cost = cost.times(new Decimal(100).pow(new Decimal(1.1).pow(getBuyableAmount(this.layer, this.id).sub(10)).sub(1)))

                return cost
            },
            purchaseLimit: 1000,
            display() { 
                return "cost: "+format(this.cost())+"<br>"+
                "x1.3 pizza gain per purchase.<br>"+
                (this.purchaseLimit!==1?formatWhole(getBuyableAmount(this.layer, this.id))+"/"+this.purchaseLimit:"")
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return new Decimal(getBuyableAmount(this.layer, 22)).gte(10)
            },
            effect() {
                return new Decimal(1.3).pow(getBuyableAmount(this.layer, this.id))
            },
            branches: [22],
        },
        33: {
            title: "Autominer",
            style() {return{
                'height': "110px",
                'width': "110px",
            }},
            canClick() {return player.u.points.gte(this.cost())},
            cost() {
                cost = new Decimal(9)

                return cost
            },
            purchaseLimit: 1,
            display() { 
                return "cost: "+format(this.cost())+"<br>"+
                "unlock autominers.<br>"+
                (this.purchaseLimit!==1?formatWhole(getBuyableAmount(this.layer, this.id))+"/"+this.purchaseLimit:"")
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return new Decimal(getBuyableAmount(this.layer, 23)).gte(1)
            },
            branches: [23],
        },
        34: {
            title: "MP Lover",
            style() {return{
                'height': "110px",
                'width': "110px",
            }},
            canClick() {return player.u.points.gte(this.cost())},
            cost() {
                cost = new Decimal(2.5).mul(new Decimal(1.6).pow(getBuyableAmount(this.layer, this.id)))

                return cost
            },
            purchaseLimit: 5,
            display() { 
                return "cost: "+format(this.cost())+"<br>"+
                "x1.2 MP gain per purchase.<br>"+
                "current: x"+format(buyableEffect(this.layer, this.id))+"<br>"+
                (this.purchaseLimit!==1?formatWhole(getBuyableAmount(this.layer, this.id))+"/"+this.purchaseLimit:"")
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return new Decimal(getBuyableAmount(this.layer, 23)).gte(1)
            },
            effect() {
                return new Decimal(1.2).pow(getBuyableAmount(this.layer, this.id))
            },
            branches: [23],
        },
        41: {
            title: "Pizza Keeper",
            style() {return{
                'height': "110px",
                'width': "110px",
            }},
            canClick() {return player.u.points.gte(this.cost())},
            cost() {
                cost = new Decimal(5)

                return cost
            },
            purchaseLimit: 1,
            display() { 
                return "cost: "+format(this.cost())+"<br>"+
                "Keep first row of pizza upgrades.<br>"+
                (this.purchaseLimit!==1?formatWhole(getBuyableAmount(this.layer, this.id))+"/"+this.purchaseLimit:"")
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return new Decimal(getBuyableAmount(this.layer, 32)).gte(1)
            },
            branches: [32],
        },
        42: {
            title: "More Ingredients",
            style() {return{
                'height': "110px",
                'width': "120px",
            }},
            canClick() {return player.u.points.gte(this.cost())},
            cost() {
                cost = new Decimal(25)

                return cost
            },
            purchaseLimit: 1,
            display() { 
                return "cost: "+format(this.cost())+"<br>"+
                "Unlock more pizza upgrades.<br>"+
                (this.purchaseLimit!==1?formatWhole(getBuyableAmount(this.layer, this.id))+"/"+this.purchaseLimit:"")
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return new Decimal(getBuyableAmount(this.layer, 32)).gte(1)
            },
            branches: [32],
        },
        43: {
            title: "Cheaper Autominers",
            style() {return{
                'height': "110px",
                'width': "110px",
            }},
            canClick() {return player.u.points.gte(this.cost())},
            cost() {
                cost = new Decimal(2).mul(new Decimal(1.5).pow(getBuyableAmount(this.layer, this.id)))

                return cost
            },
            purchaseLimit: 7,
            display() { 
                return "cost: "+format(this.cost())+"<br>"+
                "autominers cost multiplier -1 per purchase.<br>"+
                "current: "+format(buyableEffect(this.layer, this.id))+"<br>"+
                (this.purchaseLimit!==1?formatWhole(getBuyableAmount(this.layer, this.id))+"/"+this.purchaseLimit:"")
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return new Decimal(getBuyableAmount(this.layer, 33)).gte(1)
            },
            effect() {
                return new Decimal(10).sub(getBuyableAmount(this.layer, this.id))
            },
            branches: [33],
        },
        44: {
            title: "Autosharder",
            style() {return{
                'height': "110px",
                'width': "120px",
            }},
            canClick() {return player.u.points.gte(this.cost())},
            cost() {
                cost = new Decimal(30)

                return cost
            },
            purchaseLimit: 1,
            display() { 
                return "cost: "+format(this.cost())+"<br>"+
                "autominers multiply shards gain at a reduced rate.<br>"+
                "current: x"+format(buyableEffect(this.layer, this.id))+"<br>"+
                (this.purchaseLimit!==1?formatWhole(getBuyableAmount(this.layer, this.id))+"/"+this.purchaseLimit:"")
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return new Decimal(getBuyableAmount(this.layer, 33)).gte(1)
            },
            effect() {
                return new Decimal(1).add(new Decimal(0.027).mul(getBuyableAmount('m', 21)))
            },
            branches: [33],
        },
        45: {
            title: "Advanced Stone Mining",
            style() {return{
                'height': "110px",
                'width': "110px",
            }},
            canClick() {return player.u.points.gte(this.cost())},
            cost() {
                cost = new Decimal(15).pow(new Decimal(1.1).pow(getBuyableAmount(this.layer, this.id)))

                return cost
            },
            purchaseLimit: 10,
            display() { 
                return "cost: "+format(this.cost())+"<br>"+
                "stone gain x10 per purchase.<br>"+
                "current: x"+format(buyableEffect(this.layer, this.id))+"<br>"+
                (this.purchaseLimit!==1?formatWhole(getBuyableAmount(this.layer, this.id))+"/"+this.purchaseLimit:"")
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return new Decimal(getBuyableAmount(this.layer, 34)).gte(1)
            },
            effect() {
                return new Decimal(10).pow(getBuyableAmount(this.layer, this.id))
            },
            branches: [34],
        },
        51: {
            title: "Pizza Keeper II",
            style() {return{
                'height': "110px",
                'width': "110px",
            }},
            canClick() {return player.u.points.gte(this.cost())},
            cost() {
                cost = new Decimal(25)

                return cost
            },
            purchaseLimit: 1,
            display() { 
                return "cost: "+format(this.cost())+"<br>"+
                "Keep second row of pizza upgrades.<br>"+
                (this.purchaseLimit!==1?formatWhole(getBuyableAmount(this.layer, this.id))+"/"+this.purchaseLimit:"")
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return new Decimal(getBuyableAmount(this.layer, 41)).gte(1)
            },
            branches: [41],
        },
        52: {
            title: "Pizza = Moner",
            style() {return{
                'height': "110px",
                'width': "110px",
            }},
            canClick() {return player.u.points.gte(this.cost())},
            cost() {
                cost = new Decimal(150)

                return cost
            },
            purchaseLimit: 1,
            display() { 
                return "cost: "+format(this.cost())+"<br>"+
                "You can now sell pizza for dollars.<br>"+
                (this.purchaseLimit!==1?formatWhole(getBuyableAmount(this.layer, this.id))+"/"+this.purchaseLimit:"")
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return new Decimal(getBuyableAmount(this.layer, 42)).gte(1)
            },
            branches: [42],
        },
        53: {
            title: "Cheaper Pickaxe",
            style() {return{
                'height': "110px",
                'width': "110px",
            }},
            canClick() {return player.u.points.gte(this.cost())},
            cost() {
                cost = new Decimal(100).mul(new Decimal(1.5).pow(getBuyableAmount(this.layer, this.id)))

                return cost
            },
            purchaseLimit: 20,
            display() { 
                return "cost: "+format(this.cost())+"<br>"+
                "pickaxe tier cost multiplier -0.1 per purchase.<br>"+
                "current: "+format(buyableEffect(this.layer, this.id))+"<br>"+
                (this.purchaseLimit!==1?formatWhole(getBuyableAmount(this.layer, this.id))+"/"+this.purchaseLimit:"")
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return new Decimal(getBuyableAmount(this.layer, 43)).gte(1)
            },
            effect() {
                return new Decimal(4).sub(new Decimal(0.1).times(getBuyableAmount(this.layer, this.id)))
            },
            branches: [43],
        },
        54: {
            title: "Autosharder+",
            style() {return{
                'height': "110px",
                'width': "130px",
            }},
            canClick() {return player.u.points.gte(this.cost())},
            cost() {
                cost = new Decimal(125)

                return cost
            },
            purchaseLimit: 1,
            display() { 
                return "cost: "+format(this.cost())+"<br>"+
                "each unspent autominer gives +0.005/s of shard gain.<br>(doesn't work offline)<br>"+
                "current: +"+format(buyableEffect(this.layer, this.id))+"/s<br>"+
                (this.purchaseLimit!==1?formatWhole(getBuyableAmount(this.layer, this.id))+"/"+this.purchaseLimit:"")
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return new Decimal(getBuyableAmount(this.layer, 44)).gte(1)
            },
            effect() {
                return new Decimal(0.005).mul(player.m.AMleft())
            },
            branches: [44],
        },
        55: {
            title: "Hyper Advanced Mining",
            style() {return{
                'height': "110px",
                'width': "110px",
            }},
            canClick() {return player.u.points.gte(this.cost())},
            cost() {
                cost = new Decimal(100).pow(new Decimal(1.1).pow(getBuyableAmount(this.layer, this.id)))

                return cost
            },
            purchaseLimit: 1000,
            display() { 
                return "cost: "+format(this.cost())+"<br>"+
                "x2 stone-iron gain per purchase.<br>"+
                (this.purchaseLimit!==1?formatWhole(getBuyableAmount(this.layer, this.id))+"/"+this.purchaseLimit:"")
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return new Decimal(getBuyableAmount(this.layer, 45)).gte(1)
            },
            effect() {
                return new Decimal(2).pow(getBuyableAmount(this.layer, this.id))
            },
            branches: [45],
        },
        61: {
            title: "Pizza Keeper III",
            style() {return{
                'height': "110px",
                'width': "110px",
            }},
            canClick() {return player.u.points.gte(this.cost())},
            cost() {
                cost = new Decimal(160)

                return cost
            },
            purchaseLimit: 1,
            display() { 
                return "cost: "+format(this.cost())+"<br>"+
                "Keep first four upgrdes of third row of pizza upgrades.<br>"+
                (this.purchaseLimit!==1?formatWhole(getBuyableAmount(this.layer, this.id))+"/"+this.purchaseLimit:"")
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return new Decimal(getBuyableAmount(this.layer, 51)).gte(1)
            },
            branches: [51],
        },
        62: {
            title: "Inflation",
            style() {return{
                'height': "110px",
                'width': "110px",
            }},
            canClick() {return player.u.points.gte(this.cost())},
            cost() {
                cost = new Decimal(10).pow(new Decimal(1.1).pow(getBuyableAmount(this.layer, this.id)))

                return cost
            },
            purchaseLimit: 69,
            display() { 
                return "cost: "+format(this.cost())+"<br>"+
                "x1.1 dollars gain.<br>"+
                (this.purchaseLimit!==1?formatWhole(getBuyableAmount(this.layer, this.id))+"/"+this.purchaseLimit:"")
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return new Decimal(getBuyableAmount(this.layer, 52)).gte(1)
            },
            effect() {
                return new Decimal(1.1).pow(getBuyableAmount(this.layer, this.id))
            },
            branches: [52],
        },
        63: {
            title: "Cheaper Pizza",
            style() {return{
                'height': "110px",
                'width': "110px",
            }},
            canClick() {return player.u.points.gte(this.cost())},
            cost() {
                cost = new Decimal(100).mul(new Decimal(1.5).pow(getBuyableAmount(this.layer, this.id)))

                return cost
            },
            purchaseLimit: 20,
            display() { 
                return "cost: "+format(this.cost())+"<br>"+
                "pizza buyables cost /3 per purchase.<br>"+
                "current: /"+format(buyableEffect(this.layer, this.id))+"<br>"+
                (this.purchaseLimit!==1?formatWhole(getBuyableAmount(this.layer, this.id))+"/"+this.purchaseLimit:"")
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return new Decimal(getBuyableAmount(this.layer, 53)).gte(1)
            },
            effect() {
                return new Decimal(3).pow(getBuyableAmount(this.layer, this.id))
            },
            branches: [53],
        },
        71: {
            title: "Pizza Keeper IV",
            style() {return{
                'height': "110px",
                'width': "110px",
            }},
            canClick() {return player.u.points.gte(this.cost())},
            cost() {
                cost = new Decimal("1e3")

                return cost
            },
            purchaseLimit: 1,
            display() { 
                return "cost: "+format(this.cost())+"<br>"+
                "Keep first three upgrades of fourth row of pizza upgrades.<br>"+
                (this.purchaseLimit!==1?formatWhole(getBuyableAmount(this.layer, this.id))+"/"+this.purchaseLimit:"")
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return new Decimal(getBuyableAmount(this.layer, 61)).gte(1)
            },
            branches: [61],
        },
    },
})