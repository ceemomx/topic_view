var check_session_is_expired;
check_session_is_expired = function(req, res, next) {
	if (req.session.current_user) {
		console.dir(req.session.current_user);
		console.log('session user=' + req.session.current_user);
		var user = req.session.current_user;
		return next();
	} else {
		console.log('no session');
		return res.json({
			data:null,
			status: {
				code:1,
				msg: 'no session！'
			}
		});
	}
};
module.exports = check_session_is_expired;
