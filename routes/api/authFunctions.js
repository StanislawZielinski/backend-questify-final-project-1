const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, schemas } = require("../../models/schema");
const { DB_SECRET_KEY } = process.env;

/**
 * @openapi
 * /api/auth/signup:
 *   post:
 *     summary: Register new user
 *     description: Create new user account
 *     requestBody:
 *       content:
 *         'application/json':
 *           schema: # Request body contents
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *             example: # Sample object
 *               email: test@test.pl
 *               name: Jessica Smith
 *               password: test111
 *     responses:
 *       201:
 *         description: Returns a newly created user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *       409:
 *         description: Error when the email is already in use by other user account.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email in use
 *       400:
 *         description: Error when the validation of request body fails.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: array
 *                   example: [{
 *                    "message":"\"password\" length must be at least 6 characters long",
 *                    "path":["password"],
 *                    "type":"string.min",
 *                    "context":{
 *                      "limit":6,
 *                      "value":"paswd",
 *                      "label":"password",
 *                      "key":"password"
 *                    }
 *                  }]
 *
 */
const registration = async (req, res) => {
	const { error } = schemas.registerSchema.validate(req.body);
	if (error) {
		res.status(400).json({ message: error.details });
		return;
	}
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (user) {
		res.status(409).json({ message: "Email in use" });
		return;
	}
	const hashPassword = await bcrypt.hash(password, 10);
	const result = await User.create({
		...req.body,
		password: hashPassword,
	});
	res.status(201).json({
		user: {
			name: result.name,
			email: result.email,
		},
	});
};

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Authenticates user
 *     description: Authenticates user and returns token
 *     requestBody:
 *       content:
 *         'application/json':
 *           schema: # Request body contents
 *             email:
 *               type: string
 *             password:
 *               type: string
 *             example: # Sample object
 *               email: test@test.pl
 *               password: test111
 *     responses:
 *       201:
 *         description: Returns a newly created user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: HERE WILL BE GENERATED TOKEN
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *       401:
 *         description: Error when for provided email the user does not exist or the password is incorrect.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email or password is wrong
 *       400:
 *         description: Error when the validation of request body fails.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: array
 *                   example: [{
 *                    "message":"\"password\" length must be at least 6 characters long",
 *                    "path":["password"],
 *                    "type":"string.min",
 *                    "context":{
 *                      "limit":6,
 *                      "value":"paswd",
 *                      "label":"password",
 *                      "key":"password"
 *                    }
 *                  }]
 *
 */
const login = async (req, res) => {
	const { error } = schemas.loginSchema.validate(req.body);
	if (error) {
		res.status(400).json({ message: error.details });
		return;
	}
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		res.status(401).json({ message: "Email or password is wrong" });
		return;
	}
	const comparePassword = await bcrypt.compare(password, user.password);
	if (!comparePassword) {
		res.status(401).json({ message: "Email or password is wrong" });
		return;
	}
	const payload = {
		id: user._id,
	};
	const token = jwt.sign(payload, DB_SECRET_KEY, { expiresIn: "1h" });
	await User.findByIdAndUpdate(user._id, { token });
	res.json({
		token,
		user: {
			email,
			name: user.name,
		},
	});
};

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 * /api/auth/logout:
 *   get:
 *     summary: Deletes user session
 *     description: Logouts user and invalidates his/hers token
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: Successful logout - returns not content.
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not authorized
 *
 */
const logout = async (req, res) => {
	const { _id } = req.user;
	await User.findByIdAndUpdate(_id, { token: null });
	res.status(204).send();
};

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 * /api/auth/current:
 *   get:
 *     summary: Returns authenticated user data
 *     description: returns details of currently authenticated user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns users' data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: john.doe@example.com
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not authorized
 *
 */
const listCurrent = async (req, res) => {
	const { name, email } = req.user;
	res.json({ name, email });
};

const authorization = async (req, res, next) => {
	const { authorization = "" } = req.headers;
	const [bearer, token] = authorization.split(" ");
	if (bearer !== "Bearer") {
		return res.status(401).json({ message: "Not authorized" });
	}
	try {
		const { id } = jwt.verify(token, DB_SECRET_KEY);
		const user = await User.findById(id);
		if (!user || !user.token) {
			return res.status(401).json({ message: "Not authorized" });
		}
		req.user = user;
		next();
	} catch (error) {
		return res.status(401).json({ message: "Not authorized" });
	}
};

module.exports = {
	listCurrent,
	login,
	logout,
	registration,
	authorization,
};
