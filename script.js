function preload() {
	robotoFont = loadFont('RobotoMono-Regular.ttf');
}

class Agent {
	constructor(dt, x, y, vx, vy, ax, ay, fi, dfi, ddfi, m0, consum, jetSpeed, g) {
		this.dt = dt;
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.ax = ax;
		this.ay = ay;
		this.fi = fi;
		this.dfi = dfi;
		this.ddfi = ddfi;
		this.m0 = m0;
		this.m = this.m0;
		this.consum = consum;
		this.jetSpeed = jetSpeed;
		this.g = g;
		this.t = 0;
		this.reward = 0;
		this.stop = false;
	}

	reset(x, y, vx, vy, fi, m0, consum, jetSpeed, rewardReset) {
		this.t = 0;
		if (rewardReset) this.reward = 0;
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.fi = fi;
		this.m0 = m0;
		this.m = this.m0;
		this.consum = consum;
		this.jetSpeed = jetSpeed;
		this.stop = false;
	}

	step(action) {
		if (!this.stop) {
			this.t++;
			this.control1 = 0;
			this.control2 = 0;

			this.control1 = action[0] - 0.5;
			this.control2 = action[1];

			if (this.control1 > 1) { this.control1 = 1 }
			if (this.control1 < -1) { this.control1 = -1 }
			if (this.control2 > 1) { this.control2 = 1 }
			if (this.control2 < 0) { this.control2 = 0 }


			//difffiential equations
			this.dfi = this.control1 * 0.087;
			this.fi = this.fi + this.dfi * this.dt;
			this.m = this.m - this.consum * this.dt * this.control2;
			this.ax = (this.control2 * Math.cos(this.fi) * this.consum * this.jetSpeed / this.m);
			this.ay = -this.g + (this.control2 * Math.sin(this.fi) * this.consum * this.jetSpeed / this.m);
			this.vx = this.vx + this.ax * this.dt;
			this.vy = this.vy + this.ay * this.dt;
			this.x = this.x + this.vx * this.dt;
			this.y = this.y + this.vy * this.dt;

			if (this.y < 0.1) {
				this.reward += -(this.vx * this.vx + this.vy * this.vy) - (((this.m0 - this.m) / 17) * ((this.m0 - this.m) / 17));
				console.log(Math.sqrt(this.vx * this.vx + this.vy * this.vy) + " " + (this.m0 - this.m));
				this.stop = true;
			}

			if ((this.y < 1) && (this.vx < 1) && (this.vy < 1)) {
				this.reward += -(this.vx * this.vx + this.vy * this.vy) - (((this.m0 - this.m) / 17) * ((this.m0 - this.m) / 17));
				console.log(Math.sqrt(this.vx * this.vx + this.vy * this.vy) + " " + (this.m0 - this.m));
				this.stop = true;
			}

			if (this.t * this.dt > 100) {
				this.reward += - 15000;
				//console.log(this.reward + ' ' + this.x + ' ' + this.y);
				this.stop = true;
			}
		}
	}
}

var obj = {
	kr: 30,
	scale: 1000,
	batch: 1,
	count: 70,
	dt: 0.01667,
	m: 438,
	jetMass: 0.366,
	jetV: 2672,
	g: 1.62,

	startX: window.innerWidth/2,
	startY: 766,
	spreadX: 15,
	spreadY: 15,
	spreadVx: 12,
	spreadVy: 12,
	spreadAngle: 0.1,

	mutRate: 0.2,
	networkWidth: 4,
	layers: 1,
	actvation: "RELU",

	drawGraph: false,
	loadNetwork: false
};

var k = 0, b = 0;
var rocket = [];
var k = 0, b = 0;
var timelast = Date.now();
var bestRocket = new Agent(obj.dt, obj.startX, obj.startY, 0, 0, 0, 0, Math.PI / 2, 0, 0, obj.m, obj.jetMass, obj.jetV, obj.g);

function resetEnv(resetNetworks) {
	k = 0; b = 0;
	rocket = [];

	for (let i = 0; i < obj.count; i++) {
		rocket.push(new Agent(obj.dt, obj.startX, obj.startY, 0, 0, 0, 0, Math.PI / 2, 0, 0, obj.m, obj.jetMass, obj.jetV, obj.g));
	}

	timelast = Date.now();
	if (resetNetworks) { initNeat(obj.count, obj.mutRate, obj.networkWidth, obj.layers, obj.actvation, obj.loadNetwork) };
	bestRocket = new Agent(obj.dt, obj.startX, obj.startY, 0, 0, 0, 0, Math.PI / 2, 0, 0, obj.m, obj.jetMass, obj.jetV, obj.g);
	drawGraph(neat.population[0].graph(1000 / 3, 1000 / 4.5), '.best');
};

resetEnv(true);

function maxChoice(probabilities) {
	maxN = 0;
	for (let i = 0; i < probabilities.length; i++) {
		if (probabilities[i] > probabilities[maxN]) {
			maxN = i;
		}
	}
	return maxN;
}

let populationFinish = true;

var faccel = 70;

let thread = setInterval(function () {
	k++;
	for (let w = 0; w < faccel; w++) {
		if (true) {
			populationFinish = true;
			for (let i = 0; i < obj.count; i++) {
				if (!rocket[i].stop) populationFinish = false;
				probabilities = neat.population[i].activate([/*rocket[i].x/500,*/rocket[i].y / obj.scale, rocket[i].vx / obj.spreadVx, rocket[i].vy / obj.spreadVy, rocket[i].fi / 2/*,rocket[i].m/obj.m*/]);
				rocket[i].step(probabilities);
			}
			if (populationFinish) {
				let var1 = Math.random() * obj.spreadX, var2 = Math.random() * obj.spreadY, var3 = Math.random() * obj.spreadVx, var4 = Math.random() * obj.spreadVy - 24, var5 = Math.random() * obj.spreadAngle + (Math.PI / 2 - obj.spreadAngle / 2);

				for (let i = 0; i < obj.count; i++) {
					rocket[i].reset(obj.startX + var1 - obj.spreadX / 2, obj.startY + var2 - obj.spreadY / 2, var3 - obj.spreadVx / 2, var4 - obj.spreadVy / 2, var5, obj.m, obj.jetMass, obj.jetV, false);
				}
				b++;
				if (b == obj.batch) {
					b = 0;
					for (let i = 0; i < obj.count; i++) {
						neat.population[i].score = rocket[i].reward;
						rocket[i].reset(obj.startX + var1 - obj.spreadX / 2, obj.startY + var2 - obj.spreadY / 2, var3 - obj.spreadVx / 2, var4 - obj.spreadVy / 2, var5, obj.m, obj.jetMass, obj.jetV, true);
					}
					endEvaluation();
					//console.log(Date.now() - timelast);
					timelast = Date.now();
				}
			}
		}
	}
}, 0);

function setup() {
	createCanvas(windowWidth, windowHeight);
	frameRate(60);
	textFont(robotoFont);

	var exhaust =		//particles
	{
		name: "exhaust",
		colors: [[239, 47, 96, 255]],
		lifetime: 600,
		angle: [60, 120],
		size: [2, 7],
		speed: 3,
		speedx: 1,
		x: 0.5,
		y: 0.3,
		gravity: 0.005,
		sizePficent: 0.99
	};

	of = new Fountain(null, exhaust);

	background(10, 29, 59);
}

function drawGround() {
	fill(10, 29, 59); //19,47,86
	noStroke();
	rect(width / 2, height * 0.97, width, height * 0.1);
	stroke(19, 47, 86); //10,29,59
	strokeWeight(5);
	line(0, height * 0.92, width, height * 0.92);
	strokeWeight(3);
	for (let k = 0; k < width / 50; k++) {
		line(k * 55, height * 0.92, k * 55 - width / 30, height);
	}
}

let bestRocketGenome = neat.population[0];


function draw() {
	background(10, 29, 59);
	for (let i = 0; i < obj.count; i++) {
		noFill();
		c = color(168, 168, 168);
		stroke(c);
		strokeWeight(1);
		triangle(obj.kr * Math.cos(rocket[i].fi - Math.PI * 2.5 / 3) + rocket[i].x / obj.scale * height * 0.92, - obj.kr * Math.sin(rocket[i].fi - Math.PI * 2.5 / 3) - rocket[i].y / obj.scale * height * 0.92 + height * 0.92 - obj.kr*0.85, obj.kr * 1.5 * Math.cos(rocket[i].fi) + rocket[i].x / obj.scale * height * 0.92, - obj.kr * 1.5 * Math.sin(rocket[i].fi) - rocket[i].y / obj.scale * height * 0.92 + height * 0.92 - obj.kr*0.85, obj.kr * Math.cos(rocket[i].fi + Math.PI * 2.5 / 3) + rocket[i].x / obj.scale * height * 0.92, - obj.kr * Math.sin(rocket[i].fi + Math.PI * 2.5 / 3) - rocket[i].y / obj.scale * height * 0.92 + height * 0.92 - obj.kr*0.85);
	}

	let probabilities = bestRocketGenome.activate([/*bestRocket.x/500,*/bestRocket.y / obj.scale, bestRocket.vx / obj.spreadVx, bestRocket.vy / obj.spreadVy, bestRocket.fi / 2/*,bestRocket.m/obj.m*/]);
	bestRocket.step(probabilities);
	if (bestRocket.stop) {
		bestRocket.reset(obj.startX + Math.random() * obj.spreadX - obj.spreadX / 2, obj.startY + Math.random() * obj.spreadY - obj.spreadY / 2, Math.random() * obj.spreadVx - obj.spreadVx / 2, Math.random() * obj.spreadVy - obj.spreadVy / 2 - 24, Math.random() * obj.spreadAngle + (Math.PI / 2 - obj.spreadAngle / 2), obj.m, obj.jetMass, obj.jetV, true);
		bestRocket.stop = false;
		bestRocketGenome = neat.population[0];
	}

	c = color(0, 237, 213);
	stroke(c);
	strokeWeight(2);
	triangle(obj.kr * Math.cos(bestRocket.fi - Math.PI * 2.5 / 3) + bestRocket.x / obj.scale * height * 0.92, - obj.kr * Math.sin(bestRocket.fi - Math.PI * 2.5 / 3) - bestRocket.y / obj.scale * height * 0.92 + height * 0.92 - obj.kr*0.85, obj.kr * 1.5 * Math.cos(bestRocket.fi) + bestRocket.x / obj.scale * height * 0.92, - obj.kr * 1.5 * Math.sin(bestRocket.fi) - bestRocket.y / obj.scale * height * 0.92 + height * 0.92 - obj.kr*0.85, obj.kr * Math.cos(bestRocket.fi + Math.PI * 2.5 / 3) + bestRocket.x / obj.scale * height * 0.92, - obj.kr * Math.sin(bestRocket.fi + Math.PI * 2.5 / 3) - bestRocket.y / obj.scale * height * 0.92 + height * 0.92 - obj.kr*0.85);
	//circle(bestRocket.x / obj.scale * height * 0.92, height * 0.92 -bestRocket.y / obj.scale * height * 0.92, 5);

	noStroke();
	textSize(14);
	fill(255);
	text("X: " + nfc(bestRocket.x, 2) + "  Y: " + nfc(bestRocket.y, 2), (bestRocket.x + 79) / obj.scale * height * 0.9, -(bestRocket.y + 90) / obj.scale * height * 0.9 + height * 0.9);
	text("Vx: " + nfc(bestRocket.vx, 2) + "  Vy: " + nfc(bestRocket.vy, 2), (bestRocket.x + 79) / obj.scale * height * 0.9, -(bestRocket.y + 65) / obj.scale * height * 0.9 + height * 0.9);
	text("Ax: " + nfc(bestRocket.ax, 2) + "  Ay: " + nfc(bestRocket.ay, 2), (bestRocket.x + 79) / obj.scale * height * 0.9, -(bestRocket.y + 40) / obj.scale * height * 0.9 + height * 0.9);
	text("t: " + nfc(bestRocket.t * bestRocket.dt, 2), (bestRocket.x + 79) / obj.scale * height * 0.9, -(bestRocket.y + 15) / obj.scale * height * 0.9 + height * 0.9);
	text("m: " + nfc(bestRocket.m, 2), (bestRocket.x + 79) / obj.scale * height * 0.9, -(bestRocket.y - 10) / obj.scale * height * 0.9 + height * 0.9);
	text("out: " + nfc((probabilities[0] - 0.5) * 2, 3) + " " + nfc(probabilities[1], 3), (bestRocket.x + 79) / obj.scale * height * 0.9, -(bestRocket.y - 35) / obj.scale * height * 0.9 + height * 0.9);
	of.location = createVector(obj.kr * 0.95 * Math.cos(bestRocket.fi - Math.PI) + bestRocket.x / obj.scale * height * 0.92, -obj.kr * 0.95 * Math.sin(bestRocket.fi - Math.PI) - bestRocket.y / obj.scale * height * 0.92 + height * 0.92 - obj.kr*0.85);
	of.f.speed = 3 * obj.dt * 60;
	of.f.speedx = 1 * obj.dt * 60;
	of.f.angle = [(-bestRocket.fi - Math.PI) * 57.3 - 10, (-bestRocket.fi - Math.PI) * 57.3 + 10];
	of.Draw();
	if (Math.round(obj.dt * 60) < 1) {
		if (bestRocket.control2 * obj.dt * 60 > Math.random()) {
			of.Create()
		}
	} else {
		for (let ij = 0; ij < Math.round(obj.dt * 60); ij++) {
			if (bestRocket.control2 > Math.random()) {
				of.Create()
			}
		}
	}
	of.Step();
	drawGround();
}

var gui = new dat.GUI();

fenv = gui.addFolder("agent");
fenv.open();

var c3 = fenv.add(obj, 'dt', 0.001, 0.1).listen();
var c4 = fenv.add(obj, 'm', 10, 20000, 0.1).listen();
var c5 = fenv.add(obj, 'jetMass', 0.1, 100, 0.01).listen();
var c6 = fenv.add(obj, 'jetV', 1000, 8000).listen();
var c7 = fenv.add(obj, 'g', 1, 20, 0.01).listen();

fstc = gui.addFolder("starting conditions");
fstc.open();
var c8 = fstc.add(obj, 'spreadX', 0, 300).listen();
var c9 = fstc.add(obj, 'spreadY', 0, 300).listen();
var c10 = fstc.add(obj, 'spreadVx', 0, 200).listen();
var c11 = fstc.add(obj, 'spreadVy', 0, 200).listen();
var c12 = fstc.add(obj, 'spreadAngle', 0, Math.PI).listen();


fnet = gui.addFolder("network");
fnet.open();
var c17 = fnet.add(obj, 'loadNetwork').listen();
var c1 = fnet.add(obj, 'count', 50, 1000).step(10).listen();
var c2 = fnet.add(obj, 'batch', 1, 100).step(1).listen();
var c13 = fnet.add(obj, 'mutRate', 0, 0.5).listen();
var c14 = fnet.add(obj, 'networkWidth', 3, 12).step(1).listen();
var c15 = fnet.add(obj, 'layers', [1, 2]).listen();
var c16 = fnet.add(obj, 'actvation', ["STEP", "RELU", "TANH"]).listen();


c1.onFinishChange(function (value) {
	noLoop();
	obj.loadNetwork = false;
	resetEnv(true);
	loop();
});

c2.onFinishChange(function (value) {
	noLoop();
	obj.loadNetwork = false;
	resetEnv(false);
	loop();
});

c3.onFinishChange(function (value) {
	noLoop();
	obj.loadNetwork = false;
	resetEnv(true);
	loop();
});

c4.onFinishChange(function (value) {
	noLoop();
	obj.loadNetwork = false;
	resetEnv(true);
	loop();
});

c5.onFinishChange(function (value) {
	noLoop();
	obj.loadNetwork = false;
	resetEnv(true);
	loop();
});

c6.onFinishChange(function (value) {
	noLoop();
	obj.loadNetwork = false;
	resetEnv(true);
	loop();
});

c7.onFinishChange(function (value) {
	noLoop();
	obj.loadNetwork = false;
	resetEnv(true);
	loop();
});

c8.onFinishChange(function (value) {
	noLoop();
	obj.loadNetwork = false;
	resetEnv(true);
	loop();
});

c9.onFinishChange(function (value) {
	noLoop();
	obj.loadNetwork = false;
	resetEnv(true);
	loop();
});

c10.onFinishChange(function (value) {
	noLoop();
	obj.loadNetwork = false;
	resetEnv(true);
	loop();
});

c11.onFinishChange(function (value) {
	noLoop();
	obj.loadNetwork = false;
	resetEnv(true);
	loop();
});

c12.onFinishChange(function (value) {
	noLoop();
	obj.loadNetwork = false;
	resetEnv(true);
	loop();
});

c13.onFinishChange(function (value) {
	noLoop();
	obj.loadNetwork = false;
	resetEnv(false);
	loop();
});

c14.onFinishChange(function (value) {
	noLoop();
	obj.loadNetwork = false;
	resetEnv(true);
	loop();
});

c15.onFinishChange(function (value) {
	noLoop();
	obj.loadNetwork = false;
	resetEnv(true);
	loop();
});

c16.onFinishChange(function (value) {
	noLoop();
	obj.loadNetwork = false;
	resetEnv(true);
	loop();
});

c17.onFinishChange(function (value) {
	noLoop();
	if (value) {
		obj.batch = 1;
		obj.count = 7;
		obj.dt = 0.05;
		obj.m = 438;
		obj.jetMass = 0.366;
		obj.jetV = 2672;
		obj.g = 1.62;

		obj.startX = window.innerWidth / 2;
		obj.startY = 766;
		obj.spreadX = 15;
		obj.spreadY = 15;
		obj.spreadVx = 12;
		obj.spreadVy = 12;
		obj.spreadAngle = 0.1;

		obj.mutRate = 0;
		obj.networkWidth = 4;
		obj.layers = 1;
		obj.actvation = "RELU";
	}
	/*kr: 30,
	scale: 1000,
	batch: 1,
	count: 70,
	dt: 0.01667,
	m: 438,
	jetMass: 0.366,
	jetV: 2672,
	g: 1.62,

	startX: window.innerWidth/2,
	startY: 766,
	spreadX: 15,
	spreadY: 15,
	spreadVx: 12,
	spreadVy: 12,
	spreadAngle: 0.1,

	mutRate: 0.2,
	networkWidth: 4,
	layers: 1,
	actvation: "RELU",

	drawGraph: false,
	loadNetwork: false*/
	resetEnv(true);
	loop();
});