const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, schemas } = require("../../models/schema");
const { DB_SECRET_KEY } = process.env;

const listCurrent = async (req, res) => {
	const { name, email } = req.user;
	res.json({ name, email });
};

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

const logout = async (req, res) => {
	const { _id } = req.user;
	await User.findByIdAndUpdate(_id, { token: null });
	res.status(204).send();
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
			return res.sendStatus(401);
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
