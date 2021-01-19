

// Stripe.setPublishableKey('pk_test_51I52zbD4mIfJcCL7GqtnX5nH6ZsLcKtyiqQQBMUNg1KyBMNuMVSnrp6CaSrAEFiJ3F168avrcJPybUHUKj75tG9S00YVPe58AD');
Stripe.setPublishableKey('pk_test_51I52zbD4mIfJcCL7GqtnX5nH6ZsLcKtyiqQQBMUNg1KyBMNuMVSnrp6CaSrAEFiJ3F168avrcJPybUHUKj75tG9S00YVPe58AD');
  var $form = $('#checkout-form');

  $form.submit(function (event){
      $('#charge-error').addClass('hidden');
        $form.find('button').prop('disable',true);
        Stripe.card.createToken({
            number: $('#card-number').val(),
            cvc: $('#card-cvc').val(),
            exp_month: $('#card-expiry-month').val(),
            exp_year: $('#card-expiry-year').val(),
            name : $('#card-name').val(),
            // address : $('#address').val()

          }, stripeResponseHandler);
        return false;
  });
  function stripeResponseHandler(status, response) {

      // Grab the form:
      
    
      if (response.error) { // Problem!
    
        // Show the errors on the form
        $('#charge-error').text(response.error.message);
        $('#charge-error').removeClass('hidden');
        $form.find('button').prop('disabled', false); // Re-enable submission
    
      } else { // Token was created!
    
        // Get the token ID:
        var token = response.id;
    
        // Insert the token into the form so it gets submitted to the server:
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));
    
        // Submit the form:
        $form.get(0).submit();
    
      }
    }