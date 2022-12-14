// const swaggerUi = require("swagger-ui-express");
// // const swaggerDocument = require("./swagger.json");
// const swaggerJsdoc = require("swagger-jsdoc");

// const useSwagger = function (app) {
// 	const options = {
// 		definition: {
// 			openapi: "3.0.0",
// 			info: {
// 				title: "Hello World",
// 				version: "1.0.0",
// 			},
// 		},
// 		apis: ["./routes/api/*.js"], // files containing annotations as above
// 	};

// 	const swaggerDocument = swaggerJsdoc(options);
// 	console.log(swaggerDocument);
// 	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// };

// module.exports = { useSwagger };
