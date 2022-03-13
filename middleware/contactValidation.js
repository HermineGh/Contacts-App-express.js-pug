exports.validator = (req, res, next) => {
	const amCodes = [11, 33, 41, 43, 49, 55, 77, 91, 93, 94, 95, 96, 98, 99];
	const cellPhoneCode = req.body.phone.slice(5, 7) * 1;

	const code = amCodes.find((el) => el === cellPhoneCode);

	if (!code) req.mess = 'no such mobile code';
	else req.mess = null;
	next();
};
