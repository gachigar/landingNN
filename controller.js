/** Rename vars */
var Node = neataptic.Node;
var Neat = neataptic.Neat;
var Methods = neataptic.methods;
var Config = neataptic.Config;
var Architect = neataptic.architect;

// GA settings
var PLAYER_AMOUNT = 70;
var ITERATIONS = 100;
var MUTATION_RATE = 0.3;
var ELITISM = Math.round(0.1 * PLAYER_AMOUNT);

// Trained population
var USE_TRAINED_POP = false;

/** Global vars */
var neat;

/** Construct the genetic algorithm */
function initNeat(count, mut_rate, width, hiddenLayers, act, loadNetwork) {
  if (hiddenLayers == 1) {
    controller = new Architect.Perceptron(
      4,
      width,
      2
    );
  } else {
    controller = new Architect.Perceptron(
      4,
      width,
      width,
      2
    );
  }
  if (act == "STEP") controller.set({ squash: Methods.activation.STEP });
  if (act == "RELU") controller.set({ squash: Methods.activation.RELU });
  if (act == "TANH") controller.set({ squash: Methods.activation.TANH });
  neat = new Neat(
    4, 2,
    null,
    {
      mutation: [
        //Methods.mutation.ALL
        /*Methods.mutation.ADD_NODE,
        Methods.mutation.SUB_NODE,
        Methods.mutation.ADD_CONN,
        Methods.mutation.SUB_CONN,*/
        Methods.mutation.MOD_WEIGHT,
        Methods.mutation.MOD_BIAS,
        //Methods.mutation.MOD_ACTIVATION,
        /*Methods.mutation.ADD_GATE,
        Methods.mutation.SUB_GATE,
        Methods.mutation.ADD_SELF_CONN,
        Methods.mutation.SUB_SELF_CONN,
        Methods.mutation.ADD_BACK_CONN,
        Methods.mutation.SUB_BACK_CONN*/
      ],
      network: controller,
      popsize: count,
      mutationRate: mut_rate,
      elitism: ELITISM
    }
  );
  if (loadNetwork) {
    neat.population = population;
    neat.generation = 11300;
  }
}

/** End the evaluation of the current generation */
function endEvaluation() {
  document.getElementById("gt").innerText = "Generation: " + neat.generation;
  document.getElementById("st").innerText = "Fittest score: " + neat.getFittest().score.toFixed(2); //239, 47, 96
  console.log(neat.getFittest().score.toFixed(2));

  if (neat.getFittest().score > -625) {
    document.getElementById("st").style.textShadow = "0 0 1.5vw white, 0 0 1.5vw rgb(" + 0.239 * Math.sqrt(-neat.getFittest().score)/25*1000 + ", 237, 213), 0 0 3vw rgb(" + 0.239 * Math.sqrt(-neat.getFittest().score)/25*1000 + ", 237, 213), 0 0 4vw rgb(" + 0.239 * Math.sqrt(-neat.getFittest().score)/25*1000  + ", 237, 213)";
  } else {
    document.getElementById("st").style.textShadow = "0 0 1.5vw white, 0 0 1.5vw rgb(239, 47, 96), 0 0 3vw rgb(239, 47, 96), 0 0 4vw rgb(239, 47, 96)";
  }
  

  // Networks shouldn't get too big
  for (var genome in neat.population) {
    genome = neat.population[genome];
    genome.score -= genome.nodes.length;
  }

  // Sort the population by score
  neat.sort();

  if (obj.drawGraph) {
    drawGraph(neat.population[0].graph(1000 / 3, 1000 / 4.5), '.best');
  } else {

  }

  // Init new pop
  var newPopulation = [];

  // Elitism
  for (var i = 0; i < neat.elitism; i++) {
    newPopulation.push(neat.population[i]);
  }

  // Breed the next individuals
  for (var i = 0; i < neat.popsize - neat.elitism; i++) {
    newPopulation.push(neat.getOffspring());
  }

  // Replace the old population with the new population
  neat.population = newPopulation;
  //neat.mutate();

  neat.generation++;
}
