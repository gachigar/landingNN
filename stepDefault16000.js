var population = [
    {
        "nodes": [
            {
                "bias": -0.07260306262590675,
                "type": "input",
                "squash": "STEP",
                "mask": 1,
                "index": 0
            },
            {
                "bias": 0.0929211037321653,
                "type": "input",
                "squash": "STEP",
                "mask": 1,
                "index": 1
            },
            {
                "bias": -0.09768717065432919,
                "type": "input",
                "squash": "STEP",
                "mask": 1,
                "index": 2
            },
            {
                "bias": -0.02022187318058881,
                "type": "input",
                "squash": "STEP",
                "mask": 1,
                "index": 3
            },
            {
                "bias": 0.1863261714809653,
                "type": "hidden",
                "squash": "STEP",
                "mask": 1,
                "index": 4
            },
            {
                "bias": -0.5567872225067609,
                "type": "hidden",
                "squash": "STEP",
                "mask": 1,
                "index": 5
            },
            {
                "bias": 7.390643346124355,
                "type": "hidden",
                "squash": "STEP",
                "mask": 1,
                "index": 6
            },
            {
                "bias": 0.7638350097277429,
                "type": "hidden",
                "squash": "STEP",
                "mask": 1,
                "index": 7
            },
            {
                "bias": -4.003396524123508,
                "type": "output",
                "squash": "STEP",
                "mask": 1,
                "index": 8
            },
            {
                "bias": 11.222328218125181,
                "type": "output",
                "squash": "STEP",
                "mask": 1,
                "index": 9
            }
        ],
        "connections": [
            {
                "weight": 10.863987976845506,
                "from": 7,
                "to": 9,
                "gater": null
            },
            {
                "weight": 8.284348882945917,
                "from": 6,
                "to": 9,
                "gater": null
            },
            {
                "weight": 7.017864671889308,
                "from": 7,
                "to": 8,
                "gater": null
            },
            {
                "weight": -15.62573561707473,
                "from": 5,
                "to": 9,
                "gater": null
            },
            {
                "weight": 24.691581838012816,
                "from": 6,
                "to": 8,
                "gater": null
            },
            {
                "weight": -49.13055297803477,
                "from": 4,
                "to": 9,
                "gater": null
            },
            {
                "weight": -17.840622814062577,
                "from": 5,
                "to": 8,
                "gater": null
            },
            {
                "weight": 1.8665543806836635,
                "from": 4,
                "to": 8,
                "gater": null
            },
            {
                "weight": -1.6480470386377613,
                "from": 3,
                "to": 7,
                "gater": null
            },
            {
                "weight": -117.06933470582642,
                "from": 2,
                "to": 7,
                "gater": null
            },
            {
                "weight": -20.672808447012322,
                "from": 3,
                "to": 6,
                "gater": null
            },
            {
                "weight": 11.40193597991728,
                "from": 1,
                "to": 7,
                "gater": null
            },
            {
                "weight": -8.599846796433006,
                "from": 2,
                "to": 6,
                "gater": null
            },
            {
                "weight": 0.6527151017812568,
                "from": 3,
                "to": 5,
                "gater": null
            },
            {
                "weight": 14.70111488981513,
                "from": 0,
                "to": 7,
                "gater": null
            },
            {
                "weight": 13.848861360925389,
                "from": 1,
                "to": 6,
                "gater": null
            },
            {
                "weight": -1.4552343913450447,
                "from": 2,
                "to": 5,
                "gater": null
            },
            {
                "weight": -0.22764185424982628,
                "from": 3,
                "to": 4,
                "gater": null
            },
            {
                "weight": -9.103381112331498,
                "from": 0,
                "to": 6,
                "gater": null
            },
            {
                "weight": -2.166099277319102,
                "from": 1,
                "to": 5,
                "gater": null
            },
            {
                "weight": 3.564307389335038,
                "from": 2,
                "to": 4,
                "gater": null
            },
            {
                "weight": -0.03817322523563327,
                "from": 0,
                "to": 5,
                "gater": null
            },
            {
                "weight": 2.424713496925014,
                "from": 1,
                "to": 4,
                "gater": null
            },
            {
                "weight": 7.557066076309496,
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
for (let popiter = 0; popiter < 70; popiter++) {
    var json = population[popiter % population.length];
    newPop[popiter] = neataptic.Network.fromJSON(json);
}
population = newPop;

console.log(population);