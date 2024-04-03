var noiseVariance = 4;
var noise1 = Math.random() * noiseVariance;
var noise2 = Math.random() * noiseVariance;
var noise3 = Math.random() * noiseVariance;
console.log("\tNoise (for Trilateration, Triangulation): ", noise1, noise2, noise3);



// Trilateration
console.log("Trilateration");

function trilateration(x1, y1, r1, x2, y2, r2, x3, y3, r3) {
	var A = 2*x2 - 2*x1;
	var B = 2*y2 - 2*y1;
	var C = r1**2 - r2**2 - x1**2 - y1**2 + x2**2 + y2**2;
	var D = 2*x3 - 2*x2;
	var E = 2*y3 - 2*y2;
	var F = r2**2 - r3**2 - x2**2 - y2**2 + x3**2 + y3**2;
	var x = (C*E - F*B) / (E*A - B*D);
	var y = (C*D - A*F) / (B*D - A*E);
	if (!isNaN(x) && !isNaN(y)) {
		return {x: x, y: y};
	} else {
		return null;
	}
}

function getDistance(point2, point1) { 
	return Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2);
}

function performTrilateration(baseStation1, baseStation2, baseStation3, distanceToBase1, distanceToBase2, distanceToBase3) {
	return trilateration(
			baseStation1.x, baseStation1.y, distanceToBase1,
			baseStation2.x, baseStation2.y, distanceToBase2,
			baseStation3.x, baseStation3.y, distanceToBase3
	);
}

// Initial Data
var baseStation1 = {x: 0, y: 0};
var baseStation2 = {x: 10, y: 0};
var baseStation3 = {x: 5, y: 10};

var objectCoordinates = {x: 7, y: 5}; // Object's coordinates

// Calculate distances from object to base stations
var distanceToBase1 = getDistance(objectCoordinates, baseStation1);
var distanceToBase2 = getDistance(objectCoordinates, baseStation2);
var distanceToBase3 = getDistance(objectCoordinates, baseStation3);

// Determine object's coordinates WITHOUT NOISE using trilateration
var result = performTrilateration(baseStation1, baseStation2, baseStation3, distanceToBase1, distanceToBase2, distanceToBase3);

console.log("\t1) Object's Coordinates Without Noise:", result.x.toFixed(2), "y:", result.y.toFixed(2));

// Recalculate distances from object to base stations, but WITH NOISE
var noisyDistanceToBase1 = Math.sqrt((objectCoordinates.x + noise1 - baseStation1.x)**2 + (objectCoordinates.y + noise1 - baseStation1.y)**2);
var noisyDistanceToBase2 = Math.sqrt((objectCoordinates.x + noise2 - baseStation2.x)**2 + (objectCoordinates.y + noise2 - baseStation2.y)**2);
var noisyDistanceToBase3 = Math.sqrt((objectCoordinates.x + noise3 - baseStation3.x)**2 + (objectCoordinates.y + noise3 - baseStation3.y)**2);

// Determine object's coordinates using trilateration with new data
result = performTrilateration(baseStation1, baseStation2, baseStation3, noisyDistanceToBase1, noisyDistanceToBase2, noisyDistanceToBase3);

console.log("\t2) Object's Coordinates With Noise:", "x:", result.x.toFixed(2), "y:", result.y.toFixed(2));




// Triangulation
console.log("\nTriangulation");

function triangulation(x1, y1, theta1, x2, y2, theta2) {
	
	let tanTheta1 = Math.tan(theta1);
	let tanTheta2 = Math.tan(theta2);
	
	// Transform the equations to express x3 and y3
	let x3 = ((y1 - y2) + tanTheta2 * x2 - tanTheta1 * x1) / (tanTheta2 - tanTheta1);
	let y3 = ((y1 * tanTheta2 - y2 * tanTheta1) - ((x1 - x2) * tanTheta2 * tanTheta1)) / (tanTheta2 - tanTheta1);
	
	return { x: x3, y: y3 };
}

function calculateAngle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}

let x1 = -2, y1 = 2;// station1
let x2 = 2, y2 = 2;// station2

let theta1 = calculateAngle(x1, y1, objectCoordinates.x, objectCoordinates.y);
let theta2 = calculateAngle(x2, y2, objectCoordinates.x, objectCoordinates.y);
let position = triangulation(x1, y1, theta1, x2, y2, theta2)


let theta1WithNoise = calculateAngle(x1, y1, objectCoordinates.x + noise1, objectCoordinates.y + noise1);
let theta2WithNoise = calculateAngle(x2, y2, objectCoordinates.x + noise2, objectCoordinates.y + noise2);
let positionWithNoise = triangulation(x1, y1, theta1WithNoise, x2, y2, theta2WithNoise)

console.log(`\t1) Coordinates of the object Without noise: x = ${position.x.toFixed(2)}, y = ${position.y.toFixed(2)}`);
console.log(`\t2) Coordinates of the object With noise: x = ${positionWithNoise.x.toFixed(2)}, y = ${positionWithNoise.y.toFixed(2)}`);



// Gradient Descent
console.log("\nGradient Descent");

// Function to calculate Euclidean distance between two points
function euclideanDistance(x1, y1, x2, y2) {
	return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// Loss function (sum of squared differences between measured and calculated distances)
function lossFunction(x, y, anchors, distances) {
	let loss = 0;

	for (let i = 0; i < anchors.length; i++) {
		const measuredDistance = distances[i];
		const calculatedDistance = euclideanDistance(x, y, anchors[i][0], anchors[i][1]);
		loss += (calculatedDistance - measuredDistance) ** 2;
	}

	return loss;
}

// Gradient of the loss function
function gradient(x, y, anchors, distances) {
	let gradX = 0, gradY = 0;
	
	for (let i = 0; i < anchors.length; i++) {
		const dx = x - anchors[i][0];
		const dy = y - anchors[i][1];
		
		const measuredDistance = distances[i];
		
		const calculatedDistance = euclideanDistance(x, y, anchors[i][0], anchors[i][1]);

		gradX += (calculatedDistance - measuredDistance) * (dx / calculatedDistance);
		gradY += (calculatedDistance - measuredDistance) * (dy / calculatedDistance);
	}

	return [gradX, gradY];
}

// Gradient descent to determine the object's coordinates
function gradientDescent(anchors, distances, initialGuess, learningRate, iterations) {
	let [x, y] = initialGuess;
	
	for (let i = 0; i < iterations; i++) {
		const [gradX, gradY] = gradient(x, y, anchors, distances);
		x -= learningRate * gradX;
		y -= learningRate * gradY;
	}

	return [x, y];
}

// Perform gradient descent with different noise levels and calculate loss
function performGradientDescentWithNoise(anchors, initialGuess, learningRate, iterations, noise1, noise2, noise3) {
    const noisyDistances = [
        Math.sqrt((objectCoordinates.x + noise1 - baseStation1.x)**2 + (objectCoordinates.y + noise1 - baseStation1.y)**2),
        Math.sqrt((objectCoordinates.x + noise2 - baseStation2.x)**2 + (objectCoordinates.y + noise2 - baseStation2.y)**2),
        Math.sqrt((objectCoordinates.x + noise3 - baseStation3.x)**2 + (objectCoordinates.y + noise3 - baseStation3.y)**2)
    ];

    return gradientDescent(anchors, noisyDistances, initialGuess, learningRate, iterations);
}

// Function to calculate average loss
function calculateAverageLoss(anchors, initialGuess, learningRate, iterations, noiseMax, numIterationsToAverage) {
    let totalLoss = 0;
    var resX = 0;
    var resY = 0;

    for (let i = 0; i < numIterationsToAverage; i++) {
        // Generate random noise values
        // const noise1 = Math.random() * noiseMax;
        // const noise2 = Math.random() * noiseMax;
        // const noise3 = Math.random() * noiseMax;

        // Perform gradient descent with noise and get the estimated coordinates
        const [x, y] = performGradientDescentWithNoise(anchors, initialGuess, learningRate, iterations, noiseArr1[i], noiseArr2[i], noiseArr3[i]);

        // Calculate loss for the current iteration
        const noisyDistances = [
            Math.sqrt((objectCoordinates.x + noiseArr1[i] - baseStation1.x)**2 + (objectCoordinates.y + noiseArr1[i] - baseStation1.y)**2),
            Math.sqrt((objectCoordinates.x + noiseArr2[i] - baseStation2.x)**2 + (objectCoordinates.y + noiseArr2[i] - baseStation2.y)**2),
            Math.sqrt((objectCoordinates.x + noiseArr3[i] - baseStation3.x)**2 + (objectCoordinates.y + noiseArr3[i] - baseStation3.y)**2)
        ];

        const accurateDistances = [
        	distanceToBase1, distanceToBase2, distanceToBase3
        ];

        const loss = lossFunction(x, y, anchors, accurateDistances);

        // Accumulate the loss
        totalLoss += loss;
        resX = x;
        resY = y;
    }

    // Calculate average loss
    const averageLoss = totalLoss / numIterationsToAverage;
    return [averageLoss, resX, resY];
}

// Calculate average loss
function displayAndGetAverageLoss(anchors, initialGuess, rate, iters, noiseMax, numIterationsToAverage) {
	const [averageLoss, x, y] = calculateAverageLoss(anchors, initialGuess, rate, iters, noiseMax, numIterationsToAverage);
	console.log(`\t\t\t\tCoordinates: (${x.toFixed(2)} ; ${y.toFixed(2)})`);
	console.log(`\t\t\t\tAverage Loss (rate=${rate}, i=${iters}, init_guess=${initialGuess}): ${averageLoss.toFixed(2)}`);
	return averageLoss;
}

// Randomizer
function generateRandomNoise(noiseMax, numValues) {
    const noiseValues = [];
    for (let i = 0; i < numValues; i++) {
        noiseValues.push(Math.random() * noiseMax);
    }
    return noiseValues;
}

// Input data: coordinates of anchors and distances to the object
const anchors = [[baseStation1.x, baseStation1.y], [baseStation2.x, baseStation2.y], [baseStation3.x, baseStation3.y]]; // Init anchor coordinates
const distances = [distanceToBase1, distanceToBase2, distanceToBase3]; // Init measured distances to the object

// Initial guess, learning rate, and number of iterations
const initialGuess = [[1, 1], [29, 80]];
const learningRate = [
	3,
	2,
	1,
	0.5,
	0.3,
	0.1,
	0.01, 
	0.008,
	0.004,
	0.001,
	0.0008,
	0.0006,
	0.0004,
	0.0001
];
const iterations = [100, 1000, 2500, 5000];

// Number of iterations to average results
const numIterationsToAverage = 1000;

// Generate random noise values
const noiseArr1 = generateRandomNoise(noiseVariance, numIterationsToAverage);
const noiseArr2 = generateRandomNoise(noiseVariance, numIterationsToAverage);
const noiseArr3 = generateRandomNoise(noiseVariance, numIterationsToAverage);

const lossesArr = [];

// Displaying results
for(let i = 0; i < initialGuess.length; i++) {
	console.log(`\n-------- ${initialGuess[i]} initial guess --------`);
	for(let k = 0; k < iterations.length; k++) {
		console.log(`\n\t-------- ${iterations[k]} iterations --------`);
		for(let j = 0; j < learningRate.length; j++) {
			console.log(`\n\t\t[ RATE ${learningRate[j]} ]:`);
			loss = displayAndGetAverageLoss(anchors, initialGuess[i], learningRate[j], iterations[k], noiseVariance, numIterationsToAverage);
			lossesArr.push(loss);
		}
	}
}