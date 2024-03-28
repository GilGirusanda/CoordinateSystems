const plt = require('nodeplotlib');

// Function to generate data points for trilateration method
function generateTrilaterationData(baseStation1, baseStation2, baseStation3, objectCoordinates, noiseVariance) {
    const trilaterationData = [];

    for (let i = 0; i < 1000; i++) {
        const noise1 = Math.random() * noiseVariance;
        const noise2 = Math.random() * noiseVariance;
        const noise3 = Math.random() * noiseVariance;

        // Calculate distances from object to base stations with noise
        const noisyDistanceToBase1 = Math.sqrt((objectCoordinates.x + noise1 - baseStation1.x) ** 2 + (objectCoordinates.y + noise1 - baseStation1.y) ** 2);
        const noisyDistanceToBase2 = Math.sqrt((objectCoordinates.x + noise2 - baseStation2.x) ** 2 + (objectCoordinates.y + noise2 - baseStation2.y) ** 2);
        const noisyDistanceToBase3 = Math.sqrt((objectCoordinates.x + noise3 - baseStation3.x) ** 2 + (objectCoordinates.y + noise3 - baseStation3.y) ** 2);

        // Determine object's coordinates using trilateration with noisy distances
        const result = performTrilateration(baseStation1, baseStation2, baseStation3, noisyDistanceToBase1, noisyDistanceToBase2, noisyDistanceToBase3);

        trilaterationData.push({ x: result.x, y: result.y });
    }

    return trilaterationData;
}

// Function to generate data points for triangulation method
function generateTriangulationData(baseStation1, baseStation2, objectCoordinates, noiseVariance) {
    const triangulationData = [];

    for (let i = 0; i < 1000; i++) {
        const noise1 = Math.random() * noiseVariance;
        const noise2 = Math.random() * noiseVariance;

        // Calculate angles with noise
        const theta1WithNoise = calculateAngle(baseStation1.x, baseStation1.y, objectCoordinates.x + noise1, objectCoordinates.y + noise1);
        const theta2WithNoise = calculateAngle(baseStation2.x, baseStation2.y, objectCoordinates.x + noise2, objectCoordinates.y + noise2);

        // Determine object's coordinates using triangulation with noisy angles
        const result = triangulation(baseStation1.x, baseStation1.y, theta1WithNoise, baseStation2.x, baseStation2.y, theta2WithNoise);

        triangulationData.push({ x: result.x, y: result.y });
    }

    return triangulationData;
}

// Function to generate data points for gradient descent method
function generateGradientDescentData(anchors, distances, initialGuess, learningRate, iterations, noiseVariance) {
	
	const noisyGradientDescentData = [];

    for (let i = 0; i < 1000; i++) {
        // Add noise to the distances
        const noisyDistances = distances.map(distance => distance + (Math.random() * noiseVariance)); // Adjust noise level as needed

        // Perform gradient descent with noisy data
        const [x, y] = gradientDescent(anchors, noisyDistances, initialGuess, learningRate, iterations);
        noisyGradientDescentData.push({ x, y });
    }

    return noisyGradientDescentData;
}

// Initial data
const baseStation1 = { x: 0, y: 0 };
const baseStation2 = { x: 10, y: 0 };
const baseStation3 = { x: 5, y: 10 };

const objectCoordinates = { x: 7, y: 5 };

var distanceToBase1 = getDistance(objectCoordinates, baseStation1);
var distanceToBase2 = getDistance(objectCoordinates, baseStation2);
var distanceToBase3 = getDistance(objectCoordinates, baseStation3);

const noiseVariance = 1;

// Generate data points for each method
const trilaterationData = generateTrilaterationData(baseStation1, baseStation2, baseStation3, objectCoordinates, noiseVariance);
const triangulationData = generateTriangulationData(baseStation1, baseStation2, objectCoordinates, noiseVariance);
const gradientDescentData = generateGradientDescentData([[baseStation1.x, baseStation1.y], [baseStation2.x, baseStation2.y], [baseStation3.x, baseStation3.y]], [distanceToBase1, distanceToBase2, distanceToBase3], [1, 1], Math.pow(0.1, 1), Math.pow(10, 3), noiseVariance);
const gradientDescentDataHR = generateGradientDescentData([[baseStation1.x, baseStation1.y], [baseStation2.x, baseStation2.y], [baseStation3.x, baseStation3.y]], [distanceToBase1, distanceToBase2, distanceToBase3], [1, 1], Math.pow(0.1, 3), Math.pow(10, 3), noiseVariance);
const gradientDescentDataMI = generateGradientDescentData([[baseStation1.x, baseStation1.y], [baseStation2.x, baseStation2.y], [baseStation3.x, baseStation3.y]], [distanceToBase1, distanceToBase2, distanceToBase3], [1, 1], Math.pow(0.1, 1), Math.pow(10, 4), noiseVariance);
const gradientDescentDataHRMI = generateGradientDescentData([[baseStation1.x, baseStation1.y], [baseStation2.x, baseStation2.y], [baseStation3.x, baseStation3.y]], [distanceToBase1, distanceToBase2, distanceToBase3], [1, 1], Math.pow(0.1, 3), Math.pow(10, 4), noiseVariance);

// Plot data points for each method
plt.plot([{ x: trilaterationData.map(point => point.x), y: trilaterationData.map(point => point.y), type: 'scatter', mode: 'markers', name: 'Trilateration' },
          { x: triangulationData.map(point => point.x), y: triangulationData.map(point => point.y), type: 'scatter', mode: 'markers', name: 'Triangulation' },
          { x: gradientDescentData.map(point => point.x), y: gradientDescentData.map(point => point.y), type: 'scatter', mode: 'markers', name: 'Gradient Descent' },
          { x: gradientDescentDataHR.map(point => point.x), y: gradientDescentDataHR.map(point => point.y), type: 'scatter', mode: 'markers', name: 'Gradient Descent(High Rate)' },
          { x: gradientDescentDataMI.map(point => point.x), y: gradientDescentDataMI.map(point => point.y), type: 'scatter', mode: 'markers', name: 'Gradient Descent(More Iters)' },
          { x: gradientDescentDataHRMI.map(point => point.x), y: gradientDescentDataHRMI.map(point => point.y), type: 'scatter', mode: 'markers', name: 'Gradient Descent(HR+MI)' },
],
          { title: 'Object Localization Methods Comparison', xaxis: { title: 'X' }, yaxis: { title: 'Y' } });



// Trilateration
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

function triangulation(x1, y1, theta1, x2, y2, theta2) {
	
	let tanTheta1 = Math.tan(theta1);
	let tanTheta2 = Math.tan(theta2);
	
	let x3 = ((y1 - y2) + tanTheta2 * x2 - tanTheta1 * x1) / (tanTheta2 - tanTheta1);
	let y3 = ((y1 * tanTheta2 - y2 * tanTheta1) - ((x1 - x2) * tanTheta2 * tanTheta1)) / (tanTheta2 - tanTheta1);
	
	return { x: x3, y: y3 };
}

function calculateAngle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}

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



