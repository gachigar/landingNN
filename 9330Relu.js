var population = [
    {
        "nodes": [
            {
                "bias": -0.04377197936872364,
                "type": "input",
                "squash": "RELU",
                "mask": 1,
                "index": 0
            },
            {
                "bias": 0.07066368014575927,
                "type": "input",
                "squash": "RELU",
                "mask": 1,
                "index": 1
            },
            {
                "bias": 0.0030051347891048297,
                "type": "input",
                "squash": "RELU",
                "mask": 1,
                "index": 2
            },
            {
                "bias": 0.057573829066402876,
                "type": "input",
                "squash": "RELU",
                "mask": 1,
                "index": 3
            },
            {
                "bias": -0.35586638993986,
                "type": "hidden",
                "squash": "RELU",
                "mask": 1,
                "index": 4
            },
            {
                "bias": -0.7109409892327974,
                "type": "hidden",
                "squash": "RELU",
                "mask": 1,
                "index": 5
            },
            {
                "bias": 0.30458361999973393,
                "type": "hidden",
                "squash": "RELU",
                "mask": 1,
                "index": 6
            },
            {
                "bias": 1.1675902676522667,
                "type": "hidden",
                "squash": "RELU",
                "mask": 1,
                "index": 7
            },
            {
                "bias": 0.8374618729769459,
                "type": "output",
                "squash": "RELU",
                "mask": 1,
                "index": 8
            },
            {
                "bias": 0.6295836738190543,
                "type": "output",
                "squash": "RELU",
                "mask": 1,
                "index": 9
            }
        ],
        "connections": [
            {
                "weight": -0.7331337354713843,
                "from": 7,
                "to": 9,
                "gater": null
            },
            {
                "weight": 0.5932697443448892,
                "from": 6,
                "to": 9,
                "gater": null
            },
            {
                "weight": 5.099360822354839,
                "from": 7,
                "to": 8,
                "gater": null
            },
            {
                "weight": 0.16017477703007432,
                "from": 5,
                "to": 9,
                "gater": null
            },
            {
                "weight": -0.5194664413069372,
                "from": 6,
                "to": 8,
                "gater": null
            },
            {
                "weight": 1.0356835887255906,
                "from": 4,
                "to": 9,
                "gater": null
            },
            {
                "weight": -5.730593928799662,
                "from": 5,
                "to": 8,
                "gater": null
            },
            {
                "weight": -0.4151951189054066,
                "from": 4,
                "to": 8,
                "gater": null
            },
            {
                "weight": -1.6347739540413904,
                "from": 3,
                "to": 7,
                "gater": null
            },
            {
                "weight": 0.9400281892570352,
                "from": 2,
                "to": 7,
                "gater": null
            },
            {
                "weight": -0.1040930039997353,
                "from": 3,
                "to": 6,
                "gater": null
            },
            {
                "weight": -0.5571886916784221,
                "from": 1,
                "to": 7,
                "gater": null
            },
            {
                "weight": -0.056978686720101784,
                "from": 2,
                "to": 6,
                "gater": null
            },
            {
                "weight": 1.089025977186157,
                "from": 3,
                "to": 5,
                "gater": null
            },
            {
                "weight": 5.0751225969072,
                "from": 0,
                "to": 7,
                "gater": null
            },
            {
                "weight": -1.1364661612285905,
                "from": 1,
                "to": 6,
                "gater": null
            },
            {
                "weight": 1.2851768206361633,
                "from": 2,
                "to": 5,
                "gater": null
            },
            {
                "weight": -0.021509699706029006,
                "from": 3,
                "to": 4,
                "gater": null
            },
            {
                "weight": -0.04028865079115418,
                "from": 0,
                "to": 6,
                "gater": null
            },
            {
                "weight": -1.5557303867715042,
                "from": 1,
                "to": 5,
                "gater": null
            },
            {
                "weight": -0.5169156571972529,
                "from": 2,
                "to": 4,
                "gater": null
            },
            {
                "weight": 5.953880351160537,
                "from": 0,
                "to": 5,
                "gater": null
            },
            {
                "weight": 0.05807852549705661,
                "from": 1,
                "to": 4,
                "gater": null
            },
            {
                "weight": -0.03209208029954436,
                "from": 0,
                "to": 4,
                "gater": null
            }
        ],
        "input": 4,
        "output": 2,
        "dropout": 0
    }
];

var newPop = [];
//for (let popiter = 0; popiter < 70; popiter++) {
for (let popiter = 0; popiter < 7; popiter++) {
    var json = population[popiter % population.length];
    newPop[popiter] = neataptic.Network.fromJSON(json);
}
population = newPop;

console.log(population);