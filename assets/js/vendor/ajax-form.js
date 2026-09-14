$(function() {

	// Get the form.
	var form = $('#contact-form');

	// Get the messages div.
	var formMessages = $('.ajax-response');
	var isArabic = document.documentElement.lang === 'ar';
	function localizedMessage(message, success) {
		if (!isArabic) return message;
		if (success) return 'شكراً لك! تم إرسال رسالتك.';
		if (message.indexOf('not configured') !== -1) return 'خدمة البريد الإلكتروني غير مهيأة حالياً. يرجى المحاولة لاحقاً.';
		if (message.indexOf('complete the form') !== -1) return 'يرجى استكمال النموذج والتحقق من البريد الإلكتروني ثم المحاولة مجدداً.';
		return 'تعذر إرسال رسالتك. يرجى المحاولة مجدداً لاحقاً.';
	}

	// Set up an event listener for the contact form.
	$(form).submit(function(e) {
		// Stop the browser from submitting the form.
		e.preventDefault();

		// Serialize the form data.
		var formData = $(form).serialize();

		// Submit the form using AJAX.
		$.ajax({
			type: 'POST',
			url: $(form).attr('action'),
			data: formData
		})
		.done(function(response) {
			// Make sure that the formMessages div has the 'success' class.
			$(formMessages).removeClass('error');
			$(formMessages).addClass('success');

			// Set the message text.
			$(formMessages).text(localizedMessage(response, true));

			// Clear the form.
			$('#contact-form input,#contact-form textarea').val('');
		})
		.fail(function(data) {
			// Make sure that the formMessages div has the 'error' class.
			$(formMessages).removeClass('success');
			$(formMessages).addClass('error');

			// Set the message text.
			if (data.responseText) {
				$(formMessages).text(localizedMessage(data.responseText, false));
			} else {
				$(formMessages).text(localizedMessage('Please complete the form and try again', false));
			}
		});
	});

});
