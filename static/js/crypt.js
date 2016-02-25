/**
 * Created by glavnyjpolzovatel on 25.02.16.
 */
(function () {
	var password_field = document.getElementById('text_password');
	if (password_field) {
		password_field.addEventListener('input', function (e) {
			var username_field = document.getElementById('text_username');
			var hash = CryptoJS.HmacSHA1(password_field.value, username_field.value).toString();
			document.getElementById('password').value = hash;
			document.getElementById('username').value = username_field.value;
		}, true);
	}
})();