$(document).ready(function () {

	$('.slider').before('<ul id="nav">').cycle({
		fx: 'fade',
		speed: 200,
		next: '#next',
		prev: '#prev',
		slideResize: false,
		/*before: function() {
			title = $(this).find('a').attr('title');
			console.log(title);
			$('.slider_cont .slider_title').html(title);
		},*/

		// callback fn that creates a thumbnail to use as pager anchor
		/*pagerAnchorBuilder: function(idx, slide) {
			image = $(slide).find('a').attr('url');
			return '<li><a href="#"><img src="' + image + '" width="95" height="45" /></a></li>';
		}*/
	});

	function print() {
	    window.print();
	}

	$('a.online_help, .online_help_block > a, .slider-online-help, .online-help-right, #online-help').click(function (e) {
		e.preventDefault();
		newPopup(chat_url);
	});

	$("object[type='application/x-shockwave-flash']").append('<param name="wMode" value="opaque"/>');

	$("a[rel^='prettyPhoto']").prettyPhoto({
		deeplinking: false,
		social_tools: '',
	});


	(function (d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js = d.createElement(s);
		js.id = id;
		js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

	$('#tabs a:first').tab('show');

	$('.questions .list').click(function () {
		var item = $(this).find('.answer');
		var text = $(this).find('.click');
		item.slideToggle();
		setTimeout(function () {
			if (item.is(':visible')) {
				text.html(close);
			} else {
				text.html(view_more);
			}
		}, 500)
	});

	$('.slide_nav a, #back-top a.nav').bind('click', function (event) {
		var $anchor = $(this);

		$('html, body').stop().animate({
			scrollTop: $($anchor.attr('href')).offset().top
		}, 1500, 'easeInOutExpo');
		event.preventDefault();
	});

	function myPost(post_data) {
		var ids = post_data.ids;
		var options = post_data.options;
		var ids = ids.join(',');
		var options = options.join(',');

		$.ajax({
			type: 'get',
			dataType: 'json',
			url: Main.site_url + 'ajax/getMap/'+ids+'/'+options,
			success: function (data) {
				$('#map_wrapper').html(data.map);

				var inputs = $('.home_map_filter input[type="checkbox"]');

				$.each(inputs, function(index, row){
					$row = $(row);
					var id = $row.attr('id');

					if ($row.val() & data.options) {
						$row.attr('disabled', false);
						$('.home_map_filter label[for="'+id+'"]').removeClass('lbl-disabled');
					} else {
						$row.attr('disabled', 'disabled');
						$('.home_map_filter label[for="'+id+'"]').addClass('lbl-disabled');
					}
				});
			},
			error: function (jqXHR, textStatus, errorThrown) {

			}

		});
	}

	$('.map_event').on('change', 'select,input', function () {
		$('.home_map_filter button').show();
		var type = '';
		if ($(this).prop("tagName") == 'SELECT') {
			type = 'select';
		} else {
			type = 'input';
		}
		getIds(type)
	})

	function getIds(type) {
		var post_data = {};
		post_data.ids = [];
		post_data.options = [];

		post_data.ids = [];
		select_value = parseInt($('.home_map_filter').find('select').val());
		if (select_value) {
			post_data.ids.push(select_value);
		}
		$.when($.each($('.map_event input[type="checkbox"]'), function () {
			if (type == 'select') {
				post_data.options.push(parseInt(this.value));
			} else {
				if ($(this).is(':checked')) {
					post_data.options.push(parseInt(this.value));
				}
			}
		})).then(function () {
			myPost(post_data);
		});

	}

	// hide #back-top first
	$("#back-top").hide();

	// fade in #back-top
	$(function () {
		$(window).scroll(function () {
			if ($(this).scrollTop() > 300) {
				$('#back-top').fadeIn();
			} else {
				$('#back-top').fadeOut();
			}
		});

		// scroll body to 0px on click
		$('#back-top a.top').click(function () {
			$('body,html').animate({
				scrollTop: 0
			}, 800);
			return false;
		});
	});

    $('.select2-with-search').select2();

    $('.select2-without-search').select2({
        minimumResultsForSearch: -1
    });

	$("#choose, #choose1, #choose2, #choose3, #choose_no_margin, #countries").select2();

	$('#choose1').change(function () {
		var id = $(this).val();
		$('#choose2').removeAttr("disabled");

		if (id) {
			$.ajax({
				url: Main.site_url + 'ajax/getObjects/' + id,
				type: 'get',
				cache: false,
				timeout: 5000,
				dataType: 'html',
				beforeSend: function (jqXHR, settings) {
					$('#s2id_choose2').hide();
					$('.loading_one').css({
						'display': 'block'
					});
				},
				success: function (data) {
					$('.loading_one').css({
						'display': 'none'
					});
					$('#s2id_choose2').show();
					if (!data) {
						$('#choose2').select2('val', select_object);
						$('#choose3').select2('val', select_specialist);
						$('#choose2, #choose3').prop('disabled', true);
					} else {
						$('#choose2').html(data);
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {

				}
			});
		}
		return false;
	});

	$('#choose2').change(function () {
		var object_id = $(this).val();
		var direction_id = $('#choose1').val();
		$('#choose3').removeAttr("disabled");
		if (object_id) {
			$.ajax({
				url: Main.site_url + 'ajax/getDoctors/' + object_id + '/' + direction_id,
				type: 'get',
				cache: false,
				timeout: 5000,
				dataType: 'html',
				beforeSend: function (jqXHR, settings) {
					$('#s2id_choose3').hide();
					$('.loading_two').css({
						'display': 'block'
					});
				},
				success: function (data) {
					$('.loading_two').css({
						'display': 'none'
					});
					$('#s2id_choose3').show();
					if (!data) {
						$('#choose3').select2('val', select_specialist);
						$('#choose3').prop('disabled', true);
					} else {
						$('#choose3').html(data);
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {

				}
			});
		}
		return false;
	});


	$('.radio_yes').click(function () {
		$('.policy_number').css({
			'display': 'block'
		});
	});

	$('.radio_no').click(function () {
		$('.policy_number').css({
			'display': 'none'
		});
	});

	$('#visit_doctor_form').submit(function (e) {
		e.preventDefault();
		var letter_form = $(this);
		var url = letter_form.attr('action');
		var post_data = {};
		post_data.items = [];

		var inputs = $('#visit_doctor_form input[type="text"], #visit_doctor_form input[type="email"]');


		$.each(inputs, function () {
			var $this = $(this);
			var value = $this.val();
			if (!value) {
				return true;
			}
			value = $this.attr('name') + '=' + value;

			post_data.items.push(value);
		});

		var selects = $('#visit_doctor_form select');
		var button = $('#visit_doctor_form button');
		var loading = $('#visit_doctor_form img.loading');
		var output = $('#visit_doctor_form div.output');

		$.each(selects, function () {
			var $this = $(this);
			var value = $this.find('option:selected').val();
			if (!value) {
				return true;
			}
			value = $this.attr('name') + '=' + value;
			post_data.items.push(value);
		});

		post_data = post_data.items.join('&');
		$.ajax({
			url: url,
			data: post_data,
			type: 'post',
			cache: false,
			timeout: 5000,
			dataType: 'json',
			beforeSend: function (jqXHR, settings) {
				button.hide();
				loading.css({
					'display': 'block'
				});
			},
			success: function (data) {
				loading.hide();
				output.html(data.status);
				setTimeout(function () {
					output.hide();
					button.show();
					inputs.val("");
					selects.val("");
				}, 3000);
			},
			error: function (jqXHR, textStatus, errorThrown) {
				loading.hide();
				button.show();
			}
		});
	});

	$('.chain_wrapper .map_container button').click(function (e) {
		e.preventDefault();
		var loader = $('.chain_wrapper .chain_col img.chain_loader');

		var post_data = {};
		post_data.ids = [];
		post_data.options = [];

		post_data.ids = [];
		select_value = parseInt($('.home_map_filter').find('select').val());
		if (select_value) {
			post_data.ids.push(select_value);
		}
		$.when($.each($('.map_event input[type="checkbox"]'), function () {
			if ($(this).is(':checked')) {
				post_data.options.push(parseInt(this.value));
			}
		})).then(function () {
			var url = Main.site_url + 'ajax/getChainData/';
			$.ajax({
				url: url,
				data: post_data,
				type: 'post',
				cache: false,
				timeout: 5000,
				dataType: 'html',
				beforeSend: function (jqXHR, settings) {
					loader.css({
						'display': 'block'
					});
				},
				success: function (data) {
					loader.hide();
					$('.chain .row').html(data);
					$('html, body').animate({
						scrollTop: 930
					}, 'slow');
					$('.chain_wrapper .block').show();
				},
				error: function (jqXHR, textStatus, errorThrown) {

				}
			});
		});
	})

	if (show_blocks) {
		$('.chain_wrapper .block').show();
	}

	$(document).on('input', '[allowchars]', function () {

		var newValue = $(this).val();
		var newValue_filtred = newValue.replace(new RegExp($(this).attr('allowchars').replace(/^\[/, '[^'), 'g'), '');
		if (newValue_filtred != newValue) {
			$(this).val(newValue_filtred);
			$(this).css({
				'border-color': 'red',
				'outline': 'none'
			});
			var _this = this;
			setTimeout(function () {
				$(_this).css({
					'border-color': '',
					'outline': ''
				});
			}, 100);
		};

	});

	$('#datepicker, #visit_doctor_date').datetimepicker();

    var ddate = new Date();
    var ccurrentMonth = ddate.getMonth();
    var ccurrentDate = ddate.getDate();
    var ccurrentYear = ddate.getFullYear();
    $('#birth_date').datetimepicker({
        pickTime: false,
        maxDate: new Date(ccurrentYear, ccurrentMonth, ccurrentDate), 
        autoclose: true
    });


	$('.upload-cv').on('click', function(e) {
		e.preventDefault();

		var item = $(this);
        
		var cont_id = parseInt(item.data('id'));

		if(!cont_id) {
			var url = Main.site_url + 'ajax/requestUpload/';
		} else {
			var url = Main.site_url + 'ajax/requestUpload/' + cont_id;
		}

		$.ajax({
			url: url,
			type: 'post',
			cache: false,
			timeout: 5000,
			dataType: 'html',
			beforeSend: function (jqXHR, settings) {
				$('.menu-contact-wrapper.right').hide();
				$('button.close').show();
			},
			success: function (data) {
				$('#upload').html(data);
			},
			error: function (jqXHR, textStatus, errorThrown) {

			}
		});
	});

    $('.form-templates-button').on('click', function() {
        var item = $(this);
        var cont_id = parseInt(item.data('id'));
        var data_form = parseInt(item.data('form'));
        
        if(cont_id && data_form) {
            var url = Main.site_url + 'ajax/requestFormTemplate/' + cont_id + '/' + data_form;

            $.ajax({
                url: url,
                type: 'post',
                cache: false,
                timeout: 5000,
                dataType: 'html',
                beforeSend: function (jqXHR, settings) {
                    $('.menu-contact-wrapper.right').hide();
                    $('button.close').show();
                },
                success: function (data) {
                    $('#upload').html(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {

                }
            });
        }
    });

    $('#containersQuontity').on('change', function() {
        var item = $(this);
        var value = parseInt(item.val());

        $('.order-form .container-input, .order-form .container-input .container-input-area').hide();
        $('.order-form .container-input .container-input-area').prop('disabled', true);
        
        if(value) {
            for(var i = 1; i <= value; i++) {
                var selectBox = $('#orderForm input[data-id="'+ i +'"]');
                selectBox.prop('disabled', false);
                var cont = selectBox.parent().parent('.container-input');
                cont.show();
                selectBox.show();
            }
        } 
            
        var selectBox = $('#orderForm input[data-id="'+ i +'"');
        selectBox.prop('disabled', true);
        selectBox.val('');
            
        

        // if(value) {
        //     for(var i = 1; i <= value; i++) {
        //         var selectBox = $('#orderForm input[data-id="'+ i +'"');
        //         selectBox.prop('disabled', false);
        //         var cont = selectBox.parent().parent('.container-input');
        //         cont.show();
        //         selectBox.show();
        //     }
        // } else {
        //     for(var i = 1; i <= value; i++) {
        //         var selectBox = $('#orderForm input[data-id="'+ i +'"');
        //         selectBox.prop('disabled', true);
        //         selectBox.val('');
        //     }
        // }
    });

    $('.order-form .cont-input').keyup(function() {
        var item = $(this);
        
        enableContainerFields(item);   
    });

    var orderForm = $('#orderForm');

    orderForm.validate({
    	ignore: "input[type='text']:hidden",
        rules : {
            firstname : {
                required : true,
            },
            lastname : {
                required : true,
            },
            // email : {
            //     required: true,
            //     email: true
            // },
            city: {
                required: true
            },
            nationality: {
            	required: true
            },
            personal_number : {
                required:true,
                number:true,
                minlength: 11,
                maxlength: 11
            },
            // phone_number : {
            //     required:true,
            //     number:true,
            // },
            birth_date : {
            	required:true
            },
            name_of_institution : {
                required:true
            },
            section : {
                required:true
            },
            sender_doctor : {
                required:true
            },
            sender_doctor_phone_number : {
                required:true,
                number:true,
            },
            clinical_information : {
                required:true
            },
            clinical_diagnosis : {
                required:true
            },
            operation_type : {
                required:true
            },
            clinical_question : {
                required:true
            },
            passport_number: {
                required: true
            },
            'container[][]': {
            	required: true	
            }
        },

        messages: {
            firstname : {
                required : selectValidationErrorText
            },
            lastname : {
                required : selectValidationErrorText
            },
            email : {
                required: selectValidationErrorText
            },
            city: {
                required: selectValidationErrorText
            },
            personal_number : {
                required:selectValidationErrorText
            },
            phone_number : {
                required:selectValidationErrorText
            },
            name_of_institution : {
                required:selectValidationErrorText
            },
            section : {
                required:selectValidationErrorText
            },
            sender_doctor : {
                required:selectValidationErrorText
            },
            sender_doctor_phone_number : {
                required:selectValidationErrorText,
            },
            clinical_information : {
                required:selectValidationErrorText
            },
            clinical_diagnosis : {
                required:selectValidationErrorText
            },
            operation_type : {
                required:selectValidationErrorText
            },
            clinical_question : {
                required:selectValidationErrorText
            },
            passport_number: {
                required: selectValidationErrorText
            },
            nationality: {
                required: selectValidationErrorText
            },
        },
    });

// function adjustTextareaHeight(a) {

// 		$(a).height(0);
// 	    var scrollval = $(a)[0].scrollHeight;
// 	    $(a).height(scrollval);
// 	    if (parseInt($(a).height()) > $(window).height()) {
// 	        if(j==0){
// 	            max=a.selectionEnd;
// 	        }
// 	        j++;
// 	        var i =a.selectionEnd;
// 	        console.log(i);
// 	        if(i >=max){
// 	            $(document).scrollTop(parseInt($(a).height()));
// 	        }else{
// 	            $(document).scrollTop(0);
// 	        }
// 	    }
// }

function serializeObject(form) {
	return form
		.serializeArray()
		.map(function(item) {
			var obj = {};
			obj[item.name] = item.value;
			return obj;
		})
		.reduce(function(a, b) {
			return $.extend(a, b);
		});
}

function processFormData(form) {
	return form.serializeArray();
}



    $('#orderForm .form-submit').click(function(e){  
    	e.preventDefault();  

    	validateOrderFormSelects();
        validateContainerFields();
        var status = checkFields();        

    	if (orderForm.valid() && status) {

    		$.post(Main.site_url+'ajax/saveFormData', serializeObject(orderForm), function(resp, httpStatusText, jqXhr){
				var res = $.parseJSON(resp);
				//console.log(res);
				if (res == true) {
					$('.order-form').addClass('print');
					$('#orderForm').css('pointer-events','none');
					$('.order-form .print-page').show();
					$('.order-form .send-mail').show();
					$('textarea').hide();
					$('.textarea').show();
					$('textarea').each(function(){
						var text = $(this).val();
						$(this).parent('.form-row').find('.textarea').text(text);
					});
					// $('textarea').each(function(){
					// 	adjustTextareaHeight($(this));
					// });
				}
				// if (res.status == 'OK') {
				// 	orderForm.hide();					
				// };
			});
			// $.ajax({
			// 	type: "POST",
			// 	url: Main.site_url+'ajax/saveFormData',
			// 	data: data,
			// 	success: success,
			// 	dataType: dataType,
			// 	complete: function (jqXHR, status, statusMSG) {
			// 		console.log(status);
			// 	}
			// });
    	}
    });

    $('.order-form .send-mail').click(function(e){  
    	e.preventDefault();  	
    	if (orderForm.valid()) {
    		$('.mail-loading').show();
    		$.post(Main.site_url+'ajax/sendFormViaMail', processFormData(orderForm), function(resp, httpStatusText, jqXhr){
				var res = $.parseJSON(resp);
				$('.mail-loading').hide();
				// debugger;
				// console.log(res);
				if (res['status'] == 'ok') {
					$('#orderForm').hide();
					$('.order-form-text').hide();
					$('.send-mail').hide();
					$('.print-page').hide();
					$('.mail-message').html(res['msg']);
					$("html, body").animate({ scrollTop: 0 }, 600);
				}
				
			});			
    	}
    });

    $('#orderForm').submit(function(e) {
    	
    	e.preventDefault();
        validateOrderFormSelects();
        validateContainerFields();
        var status = checkFields();
        
        return status;
    });

    function checkFields() {
        orderFormSelects = $('#orderForm select');
        orderFormInputs = $( "#orderForm" ).find( ".cont-input:visible" ).not( "script" );
        orderFormSelectsQuontity = parseInt(orderFormSelects.length);
        orderFormInputsQuontity = parseInt(orderFormInputs.length);

        validatedField = 0;
        $('#orderForm select').each(function() {
            var item = $(this);
            var value = item.val();

            if(value != 0) {     
                validatedField++;
            }
        });

        orderFormInputs.each(function() {
            var item = $(this);
            var value = item.val();

            if(value) {
                validatedField++;
            }
        });

        if((orderFormSelectsQuontity + orderFormInputsQuontity) == validatedField) {
            return true;
        } else {
            return false;
        }
    }

    function validateOrderFormSelects() {
        $('#orderForm select').each(function() {
            var item = $(this);
            var value = item.val();
            var cont = item.parent();

            if(value == 0) {              	
                if(!cont.hasClass('error')) {
                    cont.addClass('error');                           
                    var name = item.attr('name');
                    var message = '<label for="'+ name +'" generated="true" class="error selectbox-error">'+ selectValidationErrorText +'</label>';
                    cont.prepend(message);                
                }
            }
        });
    }

    function validateContainerFields() {
        $('#orderForm .cont-input').each(function() {
            var item = $(this);

            if(!item.prop('disabled')) {
                var value = item.val();
                var cont = item.parent();

                if(!value) {     
                    if(!cont.hasClass('error')) {
                        cont.addClass('error');                           
                        var name = item.attr('name');
                        var message = '<label for="'+ name +'" generated="true" class="error selectbox-error">'+ selectValidationErrorText +'</label>';
                        cont.prepend(message);                
                    }
                }
            }
        });
    }

    function enableContainerFields(item) {
        var value = item.val();

        if(value) {
            var cont = item.parent();
            var errorMessage = cont.find('label.error');
            errorMessage.remove();
        }
    }

    $('select').select2().on('change', function() {
        var select_box = $(this);
        var val = select_box.val();

        if(val != 0) {
            enable(select_box);
        } else {
            disable(select_box);
        }
    });

    $('#opertaion-type, #clinical_diagnosis').on('change', function() {
        var input = $(this);
        var val = input.val();

        if(val != 0) {
            enable(input);
        } else {
            disable(input);
        }
    });

    function enable(select_box) {
        var cont = select_box.parent();
        cont.removeClass('error');
        var label = cont.find('label.error');
        label.remove();
    }

    function disable(select_box) {
        var cont = select_box.parent();
        if(!cont.hasClass('error')) {
            cont.addClass('error');
            var name = select_box.attr('name');
            var message = '<label for="'+ name +'" generated="true" class="error selectbox-error">'+ selectValidationErrorText +'</label>';
            cont.prepend(message);                
        }
    }

    $('#nationality').on('change', function() {
        var item = $(this);
        var value = parseInt(item.val());
        var personalNumberCont = $('.order-form .personal_number');
        var personalNumberField = personalNumberCont.find('input');
        var passportNumberCont = $('.order-form .passport_number');
        var passportNumberField = passportNumberCont.find('input');

        if(value == 180 || value == 339) {
            passportNumberCont.hide();
            personalNumberCont.show();
            personalNumberField.prop('disabled', false);
            passportNumberField.prop('disabled', true);
        } else {
            personalNumberCont.hide();
            passportNumberCont.show();
            personalNumberField.prop('disabled', true);
            passportNumberField.prop('disabled', false);
        }
    });

    // $('#orderForm').submit(function(){
    // 	if ($('#opertaion-type').val() == '') {
    // 		$('#opertaion-type').parents('.form-row').find('.select2-choices').css('border-color', '#efa7a7');
    // 	} else {
    // 		$(this).parents('.form-row').find('.select2-choices').css('border-color', '#dedede');
    // 	}
    // });


});
