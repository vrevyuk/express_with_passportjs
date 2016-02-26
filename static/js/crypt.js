/**
 * Created by Vitaly Revyuk on 25.02.16.
 */
(function () {
	$('#text_password').on('input', function (e) {
		$('#password').val(CryptoJS.HmacSHA1($(this).val(), $('[name=username]').val()).toString());
	});
	$('#text_old_password, #text_new_password, #text_retyped_password').on('input', function (e) {
		$('[name=' + $(this).attr('id').replace('text_', '') + ']').val(CryptoJS.HmacSHA1($(this).val(), $('[name=username]').val()).toString());
	});
})();