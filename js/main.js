

/* live-dev server switch */
/*
  *
   */
var liveServer = true;
/*
  /
*/
/* /live-dev server switch */



// var devBaseURL = 'https://devserver.fujifilm-connect.com/store_app/';
var liveBaseURL = 'https://fujifilm-hop-app.com/kit-selector/';
// var liveConnectBaseURL = 'https://fujifilm-connect.com/';
// var devConnectBaseURL = 'https://devserver.fujifilm-connect.com/';
var baseURL = /*liveServer === false ? devBaseURL :*/ liveBaseURL;
// var connectBaseURL = liveServer === false ? devConnectBaseURL : liveConnectBaseURL;
var nav_delay = 400;

// console.log('baseURL:',baseURL);
// console.log('liveServer:',liveServer);

/* Doc ready */
$(document).ready(function () {

	$('#test_block').html('w = ' + window.outerWidth + ', h = ' + window.outerHeight);

    // Set up tracking
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject'] = r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                            })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    var GA_fields = {
        trackingId: 'UA-140724551-8'	// store screen GA property
    };


	// we store and provide the clientId ourselves in localstorage since there are no cookies in Cordova
	GA_fields.clientId = localStorage.getItem('ga:clientId');

	// disable GA's cookie storage functions
	GA_fields.storage = 'none';

	ga('create', GA_fields);

	// prevent tasks that would abort tracking
	ga('set', {
		// don't abort if the protocol is not http(s)
		checkProtocolTask: null,
		// don't expect cookies to be enabled
		checkStorageTask: null
	});

	// a callback function to get the clientId and store it ourselves
	ga(function(tracker){
		localStorage.setItem('ga:clientId', tracker.get('clientId'));
	});

	// send a screenview event
	ga('send', {
		// these are the three required properties, check GA's doc for the optional ones
		hitType: 'screenview',
		// you can edit these two values as you wish
		screenName: 'Home',						// TO DO - decide what first screen wants to be tracked as, or even if it needs a screenview forcing here
		appName: 'HOP - Screen Kit Selector'
	});

	ga('set', {
		appName: 'HOP - Screen Kit Selector'
	});



    // remove all feed and product data in local storage at start to prevent duplicates.
    localStorage.removeItem('feedItemData');
    localStorage.removeItem('productItemData');



    // global variables :(
    _swiped = false;
    _swipeRight = false;
    _animPlaying = false;
    _currentPage = "#" + $('.show_page').attr('id');
		_selected = 'product_finder';



    // Page Build
    var listPageNames = { 			// Pages to be loaded on DocReady
        0: "product_finder_v3",
        1: "product_finder_v3_results",
        2: "product_finder_lens_test"
    };

    for (var key in listPageNames) { // Load all pages on DocReady
        if (!listPageNames.hasOwnProperty(key)) {
            continue;
        }
        var pageInfo = {
            func: listPageNames[key],
            url: baseURL + 'kit_selector.php'
        };
        fetchDynamicPage(pageInfo);
    }

    function fetchDynamicPage(pageInfo) {
        var worker = new Worker('js/worker.js'); // create a new worker/thread
        worker.onmessage = buildDynamicPage; // function to handle response
        worker.postMessage(pageInfo); // pass info to worker
    }

    function buildDynamicPage(e) { // handle worker response
        _response = e.data;
        for (var key in _response) {	/* fires once for each key in the stored obj */

            // NEW
            if (key == 'sectionName') {		/* ensures one call per page */
								// console.log('_response', _response);
                pagesMarkUp(_response);
            }

        }
    }
    /* /Page Build */





	/* click events needed across all pages */
	$(document).on('click', '.nav_btn.reset', function (e) {				// reset btn click
//		console.log('clicked reset');

		// temporarily disable to prevent double-taps
		$('.nav_btn').addClass('disabled');

		// jump back to q1
		backTo(0);

    });
    /* /click events needed across all pages */


	/* PRODUCT FINDER */
	var q_num = 0;

	$(document).on('click', '#product_finder .nav_btn.next, .homepage_start_btn', function () {			// next btn click

//		console.log('next btn or homepage btn click');

		if (_animPlaying == false) {

			// PRODUCT FINDER question flow control:


			// Non linear navigation: (all other navigation is linear)

			// after Q1				- a.	nav to Q2 if Q1 = 'lens'
			//						- b.	nav to Q3 if Q1 = 'camera'

			// after Q2				- c.	nav to Q5 if Q2 = 'help me choose'
			//						- d.	nav to Q12 if Q2 != 'help me choose'

			// after Q5				- e.	nav to Q6 if Q5 = 'outdoors'
			//						- f.	nav to Q7 if Q5 = 'life'
			//						- g.	nav to Q8 if Q5 = 'journey'
			//						- h.	nav to Q9 if Q5 = 'people'
			//						- i.	nav to Q10 if Q5 = 'action'
			//						- j.	nav to results if Q5 = 'video'

			// after Q6|7|8|9|10	- k.	nav to Q11

			// after Q12			- l.	nav to Q13 if Q12 != 'macro'
			//						- m.	nav to Q14 if Q12 = 'macro'
			//						- n.	nav to results if Q12 = 'cine'

			// after Q13|14			- o.	nav to Q15

			// after Q4|11|15		- p/j/n.	show results


			var currentQ = $('#product_finder .question_container').index($('#product_finder .show_container'));
			var q_num = currentQ;
			var q1_is_camera = $('.question_container_1 .answer[data-tag="camera"]').hasClass('selected');
			var q2_is_selected = $('.question_container_2 .answer').hasClass('selected');
			var q4_is_selected = $('.question_container_4 .answer').hasClass('selected');
			q1_is_camera = false

			if (currentQ == 0 && !q1_is_camera) {						// a.	nav to Q2 if Q1 = 'camera'
					q_num = 4;

			} else if (currentQ == 1 && !q1_is_camera) {				// b.	nav to Q4 if Q1 = 'lens'
					q_num = 4;

			} else if (currentQ == 2 && q2_is_selected) {		// c.	nav to Q3 if Q2 = 'selected'
					q_num = 3;

			} else if (currentQ == 4) {			// d.	nav to Q5 if Q4 = 'selected'
					q_num = 5;

			} else if (currentQ == 5) {			// d.	nav to Q5 if Q4 = 'selected'
					q_num = 6;

			} else if (currentQ == 3 || currentQ == 6){ 			// p/j/n.	show results

				// store last question
				$('#product_finder').data('prev_q', $('#product_finder .question_container.show_container').attr('id'));

				// RESULTS ANIMATION
				// N.B. be careful editing these timings, they're currently all balanced to let one thing finish first then play the next part nicely

				// STAGE 1
				// - fill progress bar & disable nav btns
				$('#product_finder .progress_indicator span').width('100%');
				$('.nav_btn').addClass('disabled');

				// delay A: 500ms

				setTimeout(function () {
					// STAGE 2

					// - question text and answer boxes fade out
					$('.question, .answer').addClass('hide');

					// delay B: 500ms

					setTimeout(function () {
						// STAGE 3

						// - bgs fade out as progress bar grows and fades out
						$('.question_wrapper, .bg_container, .answer_bg_container > div').addClass('hide');
						// $('.progress_indicator span').addClass('grow_hide');

						setTimeout(function() {
							$('#generic_loader').addClass('show');
						}, 250);


						// - prep results page
						buildProductFinderResultsPage();

						// delay C: 3000ms

						setTimeout(function () {
							// - change pages
							$('#product_finder_results').removeClass('hide_page');
							$('#product_finder_results').addClass('show_page');
							$('#product_finder').removeClass('show_page');
							$('#product_finder').addClass('hide_page');

							// delay D: 500ms

							setTimeout(function () {
								// STAGE 4
								// - results content fades in from bottom
								$('#generic_loader').removeClass('show');
								$('#product_finder_results_inner').addClass('show');
								$('#product_finder_results .nav_btn_container').addClass('shown');

								// - tidy up markup after animations
								$('#product_finder .question_container').removeClass('animated fadeOutLeft keep_classes');
								$('#product_finder .colour_fill, #product_finder_results .colour_fill').remove();
								enableNavBtns();

								// track pageview, passing route stored in #tags_display
								ga('send', {
									hitType: 'pageview',
									page: 'results/' + $('#tags_display').html()
								});


							}, 250); // delay D

						}, 1500); // delay C

					}, 250); // delay B

				}, 250); // delay A

				return false; // stop other things happening


				// - normal case:
			} else {
				q_num++; // go to next one
			}




			// update progress
			updateProductFinderProgress(q_num); // update the progress bar and move the BGs

			// move to next question
			var oldQuestion = '#' + $(this).closest('.show_page').find('.show_container').attr('id');
			var newQuestion = '#' + $(this).closest('.show_page').find('.question_container').eq(q_num).attr('id');

//			console.log('q_num = ' + q_num, 'currentQ = ' + currentQ, 'oldQuestion = ' + oldQuestion, 'newQuestion = ' + newQuestion);

			questionAnimation('left', oldQuestion, newQuestion);
			$('#product_finder .nav_btn.next').addClass('disabled');



			// track page view for next question
			ga('send', {
				hitType: 'pageview',
				page: 'q'+q_num
			});

		}

	});

	$(document).on('click', '#product_finder .nav_btn.prev', function () {				// question prev btn click / question back btn click

//		console.log('click prev btn');

		if (_animPlaying == false) {

			// non linear backwards flow control:
			//
			// - back from Q3			- a.	nav to Q1
			// - back from Q5|12		- b.	nav to Q2
			// - back from Q6|7|8|9|10	- c.	nav to Q5
			// - back from Q11			- d. 	nav to Q6 if Q5 = 'outdoors'
			//							- e. 	nav to Q7 if Q5 = 'life'
			//							- f. 	nav to Q8 if Q5 = 'journeys'
			//							- g. 	nav to Q9 if Q5 = 'people'
			//							- h. 	nav to Q10 if Q5 = 'action'
			// - back from Q14			- i.	nav to Q12
			// - back from Q15			- j.	nav to Q13 if Q12 != 'macro'
			// 							- k.	nav to Q14 if Q12 = 'macro'
			//
			// * if we want to be able to come back from results to prev question, that'll need adding here */

			var currentQ = $('#product_finder .question_container').index($('#product_finder .show_container'));
			var q1_is_camera = $('.question_container_1 .answer[data-tag="camera"]').hasClass('selected');
			var q2_is_selected = $('.question_container_2 .answer').hasClass('selected');
			var q4_is_selected = $('.question_container_4 .answer').hasClass('selected');

			if (currentQ == 4) { 															// a.	nav to Q1
					q_num = 1;

			} else {
					q_num = currentQ - 1;
			}

			updateProductFinderProgress(q_num); // update the 'question #' slugs andthe progress bar, and move the BGs

			// move to prev question
			var oldQuestion = '#' + $(this).closest('.show_page').find('.show_container').attr('id');
			var newQuestion = '#' + $(this).closest('.show_page').find('.question_container').eq(q_num).attr('id');
			$(newQuestion).find('.answer').removeClass('selected');		// de-select prev question answers
			questionAnimation('right', oldQuestion, newQuestion);

//			console.log('q_num = ' + q_num, 'currentQ = ' + currentQ, 'oldQuestion = ' + oldQuestion, 'newQuestion = ' + newQuestion);
		}


		// track page view for next question
		ga('send', {
			hitType: 'pageview',
			page: 'q'+q_num
		});


	});

	$(document).on('click', '#product_finder .answer', function () {		// answer click
//		console.log('click answer');

		var answer_nav_delay = 350;		// delay between click and nav in ms

		if($(this).closest('.answer_wrapper').hasClass('multiple') && $(this).attr('data-tag') != 'range') {
		 // console.log('has multiple');
		 if($(this).hasClass('selected')) {
			 // console.log('already selected ' + "selected  " + $(this).closest('.multiple').find('.selected').length);
			 $(this).removeClass('selected');

		 } else {
			 // console.log("selected  " + $(this).closest('.multiple').find('.selected').length);
			 if($(this).closest('.multiple').find('.selected').length < 3) {
				 $(this).closest('.multiple').find('.selected[data-tag="range"]').removeClass('selected');
				 $(this).addClass('selected');
				 // console.log('selected');
			 }
		 }
	 } else {
		 // console.log('no multiple');
		 $(this).closest('.answer_wrapper').find('.answer').removeClass('selected');
		 $(this).addClass('selected');

		 	// then make the product finder navigate to the next question/stays hidden for one answer question
			$('#product_finder .nav_btn.next').addClass('disabled');
	 		setTimeout(function() {
	 			$('#product_finder .nav_btn.next').trigger('click');
	 		}, answer_nav_delay);
	 }

	 if($(this).closest('.answer_wrapper.multiple').find('.selected').length < 1 ) {
		 $('#product_finder .nav_btn.next').addClass('disabled');
	 } else if($(this).closest('.answer_wrapper.multiple').find('.selected').length >= 1 ) {
		 $('#product_finder .nav_btn.next').removeClass('disabled');
	 } else {
		 $('#product_finder .nav_btn.next').addClass('disabled');
	 }


		// $(this).closest('.answer_wrapper').find('.answer').removeClass('selected');
		// $(this).addClass('selected');

		updateProductFinder();

		// // then make the product finder navigate to the next question
		// setTimeout(function() {
		// 	$('#product_finder .nav_btn.next').trigger('click');
		// }, answer_nav_delay);
	});

	updateProductFinder();
	/* /PRODUCT FINDER */


	/* RESULTS */
	$(document).on('click', '.cam_panel_btn', function () {

		var btn_fade_duration = parseFloat(getComputedStyle($('.cam_panel_btn')[0])['transitionDuration']) * 1000;	// get css transition duration in ms
		var panel_slide_duration = parseFloat(getComputedStyle($('#cam_panel_container')[0])['transitionDuration']) * 1000;
		var animation_cushion = 50;
		var click_cushion = 100;
		var direction = ($(this).hasClass('prev')) ? 'prev' : 'next';

		setTimeout(function() {

			// first, hide .cam_panel_btns
			$('.cam_panel_btn').css('opacity', 0);

			// then slide cam panels
			setTimeout(function() {
				var panel_width_in_vw = Math.round(parseInt($('.cam_result_panel').css('width')) / window.outerWidth * 100);
				var slide_amount = window.outerWidth / 100 * panel_width_in_vw;
				var prev_left = parseInt($('#cam_panel_container').css('left'));
				var new_left = (direction == 'prev') ? prev_left + slide_amount : prev_left - slide_amount;
				$('#cam_panel_container').css('left', new_left);

				// finally, show .cam_panel_btn again
				setTimeout(function() {
					$('.cam_panel_btn').css('opacity', 1);
				}, panel_slide_duration + animation_cushion);

			}, btn_fade_duration + animation_cushion);

			// update main product lean more popups
			// - make an 'active' class be assigned to the cam panel in view
			var old_active_index = $('.cam_result_panel').index($('.cam_result_panel.active'));
			$('.cam_result_panel').removeClass('active');
			if(direction == 'prev') {
				$('.cam_result_panel').eq(old_active_index -1).addClass('active');
			} else if(direction == 'next') {
				$('.cam_result_panel').eq(old_active_index +1).addClass('active');
			}
			// - take the cam in view and pass to data-filling function
			setTimeout(function() {
				var new_main_product = $('.cam_result_panel.active .main_result_block').attr('data-product');
				fillLearnMorePopups(new_main_product);
			}, 500);


		}, click_cushion);

	});

	$(document).on('click', '.secondary_result_block', function () {

		// switch the products with the main section

		// var main_product_block = $(this).siblings('.main_result_block');
		var main_product_block = $(this).closest(".result_container").find(".main_result_block");
		var secondary_product_block = $(this);
		var old_main_product = main_product_block.attr('data-product');
		var new_main_product = $(this).attr('data-product');

		// console.log("main_product_block " + main_product_block);
		// console.log("secondary_product_block " + secondary_product_block);
		// console.log("old_main_product " + old_main_product);
		// console.log("new_main_product " + new_main_product);

		// fade the images out
		$('.main_result_img').css('opacity', 0);
		secondary_product_block.find('img').css('opacity', 0);

		// after images have faded out, replace the man and clicked secondary blocks' data
		setTimeout(function() {

			fillMainResultData(main_product_block, new_main_product);
			fillSecondaryResultData(secondary_product_block, old_main_product);

			// finally, fade the images in
			setTimeout(function() {
				$('.main_result_img').css('opacity', 1);
				secondary_product_block.find('img').css('opacity', 1);
			}, 500);

		}, 250);




	});

	$(document).on('click', '#product_finder_results .nav_btn.prev', function() {				// results back btn click
//		console.log('clicked results back btn');

		$(this).addClass('disabled');	// Disable btn imediately to prevent double taps


		// if popups are open, only need to close those
		if($('#product_finder_results').hasClass('popup_open')) {

			// if specs or sample popup is open, just close those to go back to learn more
			if($('#specs').hasClass('show') || $('#sample').hasClass('show')) {
				$('#specs, #sample').removeClass('show');
				$('#product_finder_results').removeClass('sample_open');
				$('#specs .scroll_outer, #sample .scroll_outer').scrollTop(0);
				setTimeout(function() {
					updateScrollState($('#specs .scroll_outer'));
					updateScrollState($('#sample .scroll_outer'));
					$('#specs .scroll_outer, #sample .scroll_outer').removeClass('scrolled');
				}, 200);


			} else if($('#learn_more').hasClass('show') && !$('#specs').hasClass('show') && !$('#sample').hasClass('show')) {
				// if only learn more is open, close that

				$('#learn_more').removeClass('show');
				$('#product_finder_results').removeClass('popup_open');
			}

			// reset classes
			$(this).removeClass('disabled');

			// don't to anything else
			return false;
		}


		// tidy up results page after page has exited
		setTimeout(function() {
			tidyUpPage('results');
		}, 500);


		// tidy up product finder page
		tidyUpPage('product_finder');


		// - show last question
		var prev_q = $('#product_finder').data('prev_q') || '';
		var prev_q_num = parseInt(prev_q.replace('pf_q',''));
		$('#product_finder .question_container').removeClass('show_container').addClass('hide_container');
		$('#'+prev_q).removeClass('hide_container').addClass('show_container');
		$('#'+prev_q).find('.answer').removeClass('selected');		// de-select prev question answers
		updateProductFinderProgress(prev_q_num);

		_selected = '#product_finder';
		startAnimRight(_selected);

		setTimeout(function() {
			$('#product_finder_results .nav_btn.prev').removeClass('disabled'); // Enable back button after delay
		}, 500);

	});

	$(document).on('click', '.main_result_block .learn_more_btn', function() {		// learn more btn click
//		console.log('click learn more btn');

		// snap learn_more and specs popup position to under title
		var title_y_vh = ($('.main_result_block .title').offset().top / window.outerHeight * 100) + 1;
		var title_h_vh = $('.main_result_block .title').outerHeight() / window.outerHeight * 100;
		var subtitle_h_vh = $('.main_result_block .subtitle').outerHeight() / window.outerHeight * 100;
		var title_bottom_edge_vh = title_y_vh + title_h_vh - subtitle_h_vh + 1;		// replace original subtitle height with 1vh which it becomes
		$('#learn_more, #specs').css('top', title_bottom_edge_vh + 'vh');

		setTimeout(function() {														// small delay so you can see the btn's hit state first
			$('#learn_more .scroll_outer').scrollTop(0);
			$('#learn_more').addClass('show');
			$('#product_finder_results').addClass('popup_open');
			updateScrollState($('#learn_more .scroll_outer'));

		}, 200);

		// track pageview
		var product = $(this).closest('.main_result_block').attr('data-product');
		ga('send', {
			hitType: 'pageview',
			page: 'learn_more/' + product
		});

	});

	$(document).on('click', '#learn_more .learn_more_popup_btn', function() {		// learn_more_popup_btn click - specs, sample & test
//		console.log('click learn_more_popup_btn');

		var btn = $(this).attr('data-btn');
		var product = $(this).closest('.main_result_block').attr('data-product');

		if(btn=='specs' || btn=='sample') {			// specs btn click & sample btn click

			setTimeout(function() {	// small delay so you can see the btn hit state

				$('#specs, #sample').removeClass('show');
				$('#product_finder_results').addClass('popup_open');

				// popup-specific functionality
				if(btn=='specs') {
					updateScrollState($('#specs .scroll_outer'));
					$('#'+btn).addClass('show');

					// track pageview
					ga('send', {
						hitType: 'pageview',
						page: 'specs/' + product
					});
				}

				if(btn=='sample') {
					$('#product_finder_results').addClass('sample_open');
					$('#generic_loader').addClass('show');					// show preloader while images are rendered

					var preload_time = $('#sample img').length * 200;		// preloader time relative to number of images
					setTimeout(function() {
						$('#sample .scroll_outer').scrollTop(0);
						updateScrollState($('#sample .scroll_outer'));
						$('#'+btn).addClass('show');

						setTimeout(function() {
							$('#generic_loader').removeClass('show');
						}, 200);

					}, preload_time);

					// track pageview
					ga('send', {
						hitType: 'pageview',
						page: 'sample/' + product
					});

				} else {
					$('#product_finder_results').removeClass('sample_open');
				}

			}, 200);


		} else if(btn == 'test') {							// test btn click

			console.log('test click | ' + $(this).attr('data-product'));

			var lens = $(this).attr('data-product');

			// first, put test page in setup mode
			$('#product_finder_lens_test').addClass('test_setup');

			// store initial lens for clear btn to reset back to that lens
			$('#product_finder_lens_test').attr('data-original', lens);


			// add all lenses to one panel (web version had them separated)
			if (!$('.option_panel[data-panel="prime_lens"]').has('.option_block.zoom').length) {
				$('.option_panel[data-panel="prime_lens"] .option_panel_inner').append($('.option_panel[data-panel="zoom_lens"] .option_panel_inner').html());
			}

			// exit compare mode if active
			var compare_exit_delay = 250;
			if($('#product_finder_lens_test').hasClass('compare')) {
				$('#product_finder_lens_test .btn.cancel').trigger('click');
				compare_exit_delay = 800;										// if we need to exit compare mode as well as prep the test page, more delay needed
			}

			setTimeout(function() {	// apply the compare_exit_delay

				// make lens option panel selected
				$('.option_panel_btn[data-option="lens"]').addClass('selected');
				$('.option_panel_btn').not($('.option_panel_btn[data-option="lens"]')).removeClass('selected');
				$('.option_panel').removeClass('show');
				$('.option_panel[data-panel="prime_lens"]').addClass('show');

				// pre-select lens
				// console.log('pre select lens:' + lens);
				var lens_block = $('.option_panel.show .option_block.lens[data-item="'+lens+'"]');
				if(!lens_block.is('.selected')) {
				   lens_block.trigger('click');
				}
				if (!$('.option_block.focal_length.selected').length) {
					$('.option_panel_btn[data-option="focal_length"]').addClass('highlight');
					$('.option_panel_btn[data-option="focal_length"] .selected_title').addClass('removed');
					$('.option_panel_btn[data-option="focal_length"] .btn_title').removeClass('removed');
				}

				// horizontally scroll selected lens to centre
				var h_scroll_interval = setInterval(function() {
//					console.log('check');
					if($('.option_panel.show .option_block.selected').length > 0) {
//						console.log('set and clear in a short while');
						setTimeout(function() {
//							console.log('set and clear now');
							var block_pos = $('.option_panel.show .option_block.selected').position().left;
							var block_width = $('.option_block').outerWidth(true);
							var block_to_edge = (window.innerWidth - block_width) / 2;
							$('.option_panel.show .option_panel_inner').scrollLeft( block_pos - block_to_edge );
						}, 500);
						clearInterval(h_scroll_interval);
					}
				}, 250);

				setTimeout(function() {
					// adjust UI to fit screen
					$('.lens_switch_btn').css('height', $('.option_panel_btn').height());
					$('#product_finder_lens_test').removeClass('test_setup');
				}, 3000);

				// snap scroll to top after exit transition
				setTimeout(function() {
					$('body').scrollTop(0);
				}, 500);

				// nav to lens test page
				$('#test_loader').addClass('show');
				setTimeout(function() {
					$('#test_loader').removeClass('show');
				}, 1000);

				_selected = '#product_finder_lens_test';
				startAnimLeft(_selected);

				// track pageview
				//trackPageView('test_lens', lens);

			}, compare_exit_delay);

			// track pageview
			ga('send', {
				hitType: 'pageview',
				page: 'test/' + product
			});

		}




	});

	$(document).on('click', '#specs_inner .close_btn', function() {

		$('#specs').removeClass('show');
		$('#specs .scroll_outer').scrollTop(0);
		setTimeout(function() {
			updateScrollState($('#specs .scroll_outer'));
			$('#specs .scroll_outer').removeClass('scrolled');
		}, 200);

	});

	$('.scroll_outer').scroll(function(e) {

		if($(this).hasClass('forcing_scroll')) {				// when forcing snaps to the top, don't register as a user scrolling
			return false;
		}

		$(this).siblings('.swipe_icon').removeClass('show');	// hide sibling swipe icon if present
		$(this).addClass('scrolled');							// tell the swipe icon not to come back during this page view

		// how/hide fades on scroll element (unless specified no fades)
		if(!$(this).hasClass('no_fades')) {
			updateScrollState($(this));
		}

		resetInactiveTimeout();			// prevent inactive timeout when user it just scrolling - see if this slows down scroll behaviour

	});
	/* /RESULTS */


	/* LENS TEST PAGE */
	$(document).on('click', '.option_panel_btn, .lens_type_btn', function() {
		var panel = $(this).attr('data-option');

		// set button appearance
		if (!$('.option_block.lens.selected').length) {
			$('.option_panel_btn[data-option="lens"]').addClass('highlight');
		}
		$(this).toggleClass('selected');
		$(this).closest('.option_panel_btns').find('.option_panel_btn').not($(this)).removeClass('selected');


		// then unless switching between tests, change panel btns shown
		if($('#product_finder_lens_test').is('.switching_tests') == false) {

			panel = (panel=='lens') ? $('.lens_type_btn.selected').attr('data-option') : panel;	// if selected lens, set to whichever sub lens category is selected

			if (panel != 'aperture' && !$('.option_block.aperture.selected').length) {
				$('.option_panel_btn[data-option="aperture"]').addClass('highlight');
			}
			$('.lens_type_btn[data-option="prime_lens"]').addClass('selected');

			// if not during test setup, change panel shown
			if(!$('#product_finder_lens_test').hasClass('test_setup')) {
				$('.option_panel').not($('.option_panel[data-panel="'+ panel +'"]')).removeClass('show');

				if ($('.option_panel[data-panel="'+ panel +'"]').hasClass('show')) {
					$('.option_panel[data-panel="'+ panel +'"]').removeClass('show');

				} else {
					$('.option_panel[data-panel="'+ panel +'"]').addClass('show');
				}

			}

		}
	});

	$(document).on('click', '#product_finder_lens_test .option_block', function() {			// option block click

		// console.log('option block click', $(this));

		// don't do anything if it's already selected
		if( $(this).is('.selected') ) {
			return false;
		}

		// hide option panel (unless during test age setup)
		var setup_mode = $('#product_finder_lens_test').hasClass('test_setup');
		var switching = $('#product_finder_lens_test').hasClass('switching_tests');
		if(!setup_mode) {
			$(this).closest('.option_panel').removeClass('show');
		}

		// set selected option
		if( $(this).is('.lens') ) {
			$('.option_block.lens').removeClass('selected');
			$('.option_panel_btn[data-option="aperture"]').addClass('disabled highlight');
			$('#product_finder_lens_test .option_panel_btn[data-option="aperture"] .selected_title').addClass('removed');
			$('#product_finder_lens_test .option_panel_btn[data-option="aperture"] .btn_title').removeClass('removed');

		} else {
			$(this).siblings('.option_block').removeClass('selected');

			if ($(this).siblings('.option_block').hasClass('selected') == 'false') {
				$('#product_finder_lens_test .option_panel_btn[data-option="aperture"]').removeClass('highlight');
				$('#product_finder_lens_test .option_panel_btn[data-option="aperture"] .selected_title').addClass('removed');
				$('#product_finder_lens_test .option_panel_btn[data-option="aperture"] .btn_title').removeClass('removed');
			}

		}
		$(this).addClass('selected');

		// control what happens to the rest of the page
		var aperture_obj = $('#product_finder_lens_test').data('aperture_obj');		// get data out of DOM data storage where it was stored after startup

		// - if clicked a lens, update the focal lengths, clear the apertures and blur the image
		if($(this).is('.lens')) {

			var selected_lens = $(this).find('.title').html();
			var focal_lengths = Object.keys(aperture_obj[selected_lens]);	// eg. ["16 mm", "22.3 mm", "34.2 mm"]
			var focal_length_panel = $('#product_finder_lens_test .option_panel[data-panel="focal_length"] .option_panel_inner');
			var aperture_panel = $('#product_finder_lens_test .option_panel[data-panel="aperture"] .option_panel_inner');

			// - - update option_panel_button with title of selected
			$('#product_finder_lens_test .option_panel_btn[data-option="lens"] .selected_title').html(selected_lens).addClass('select');
			$('#product_finder_lens_test .option_panel_btn[data-option="lens"]').removeClass('highlight');
			$('#product_finder_lens_test .option_panel_btn[data-option="lens"] .btn_title').addClass('removed');
			$('#product_finder_lens_test .option_panel_btn[data-option="lens"] .selected_title').removeClass('removed');


			// - - update the focal lengths
			focal_length_panel.empty();
			for(var f=0; f<focal_lengths.length; f++) {
				var title = focal_lengths[f];
				focal_length_panel.append(
					"<div class='option_block focal_length bg' data-item='"+title+"'>"+
						"<div class='title txt_centered body_copy_small centre_x_y'>"+ title +"</div>"+
					"</div>");
			}

			// - - clear the apertures
			aperture_panel.empty();

			// - - set image state to show the selection is incomplete, but not when just switching between tests
			var active_test_img_outer = ($('#product_finder_lens_test').hasClass('compare')) ? $('.test_img_outer.active') : $('#test_img_1');
			if(!switching) {
				active_test_img_outer.addClass('selection_incomplete');
			}

			// then if there's only one focal length, force a click on it to update the apertures
			if(focal_lengths.length == 1) {
				$('.option_block.focal_length').trigger('click');
				$('.option_panel_btn[data-option="aperture"]').removeClass('disabled');
				$('.option_panel_btn[data-option="focal_length"]').removeClass('disabled highlight');
			} else {
				$('.option_panel_btn[data-option="focal_length"]').addClass('disabled highlight');
				$('.option_panel_btn[data-option="aperture"]').addClass('disabled highlight');
				$('#product_finder_lens_test .option_panel_btn[data-option="focal_length"] .btn_title').removeClass('removed');
				$('#product_finder_lens_test .option_panel_btn[data-option="focal_length"] .selected_title').addClass('removed');
			}
			$('.option_panel_btn[data-option="focal_length"]').removeClass('disabled');

			// also clear the selection display as it's not a complete selection now
			active_test_img_outer.find('.selection_display').html();


		// - if clicked a focal_length, update the apertures and blur the image
		} else if($(this).is('.focal_length')) {

			var selected_lens = $('.option_block.lens.selected').find('.title').html();
			var selected_focal_length = $('.option_block.focal_length.selected').find('.title').html();
			var aperture_panel = $('#product_finder_lens_test .option_panel[data-panel="aperture"] .option_panel_inner');
			var apertures = aperture_obj[selected_lens][selected_focal_length];		// eg. ["f / 2", "f / 2.8"]

			// update the optional_panel_button with title of selected
			$('#product_finder_lens_test .option_panel_btn[data-option="focal_length"] .selected_title').html(selected_focal_length).addClass('select');
			$('#product_finder_lens_test .option_panel_btn[data-option="focal_length"]').removeClass('highlight');
			$('#product_finder_lens_test .option_panel_btn[data-option="focal_length"] .btn_title').addClass('removed');
			$('#product_finder_lens_test .option_panel_btn[data-option="focal_length"] .selected_title').removeClass('removed');


			// - - update the apertures
			aperture_panel.empty();
			for(var a=0; a<apertures.length; a++) {
				var title = apertures[a];
				aperture_panel.append(
					"<div class='option_block aperture bg' data-item='"+title+"'>"+
						"<div class='title txt_centered body_copy_small centre_x_y'>"+ title +"</div>"+
					"</div>");
			}

			// - - set image state to show the selection is incomplete, but not when just switching between tests
			var active_test_img_outer = ($('#product_finder_lens_test').hasClass('compare')) ? $('.test_img_outer.active') : $('#test_img_1');
			if(!switching) {
				active_test_img_outer.addClass('selection_incomplete');
			}

			$('.option_panel_btn[data-option="aperture"]').removeClass('disabled');
			$('#product_finder_lens_test .option_panel_btn[data-option="aperture"]').addClass('highlight');
			$('#product_finder_lens_test .option_panel_btn[data-option="aperture"] .btn_title').removeClass('removed');
			$('#product_finder_lens_test .option_panel_btn[data-option="aperture"] .selected_title').addClass('removed');

			// also clear the selection display as it's not a complete selection now
			active_test_img_outer.find('.selection_display').html();


		// - if clicked an aperture, update the image
		} else if($(this).is('.aperture')) {

			var selected_aperture = $('.option_block.aperture.selected').find('.title').html();

			// update the optional_panel_button with title of selected
			$('#product_finder_lens_test .option_panel_btn[data-option="aperture"] .selected_title').html(selected_aperture).addClass('select');
			$('#product_finder_lens_test .option_panel_btn[data-option="aperture"]').removeClass('highlight');
			$('#product_finder_lens_test .option_panel_btn[data-option="aperture"] .btn_title').addClass('removed');
			$('#product_finder_lens_test .option_panel_btn[data-option="aperture"] .selected_title').removeClass('removed');


			// selection should now be complete so reflect that in UI
			var active_test_img_outer = ($('#product_finder_lens_test').hasClass('compare')) ? $('.test_img_outer.active') : $('#test_img_1');
			var active_test_id = active_test_img_outer.attr('id');
			active_test_img_outer.removeClass('selection_incomplete');
			if (selected_aperture) {
				$('.overlay').addClass('removed');
				setTimeout(function() {
					$('#product_finder_lens_test .option_panel[data-panel="aperture"], .option_panel').removeClass('show');
				}, 500);
				$('#product_finder_lens_test .option_panel_btn[data-option="aperture"]').removeClass('selected');
			}

			$('#product_finder_lens_test .btn.compare, #product_finder_lens_test .cancel.compare').addClass('show');


			// assemble filename of the test image from all 3 parts
			var L = $('.option_block.lens.selected').find('.title').html();
			var F = $('.option_block.focal_length.selected').find('.title').html();
			var A = $(this).find('.title').html();

			// console.log('filename parts: [' + L +'] ['+ F +'] ['+ A +']' + ', setup_mode='+setup_mode);

			if(L && F && A && !switching) {	// don't apply new image if switching between tests

				// fill selection display (seen in wide view only)
				active_test_img_outer.find('.selection_display').html(L +', '+ F +', ' + A);

				// for whole numbered apertures, add ".0" to match filenames
				if(A.indexOf('.') == -1) { A += '.0'; }

				var fname = L.replaceAll(['.',' '],['_','_']) +'_'+ F.replaceAll(['mm','.'],['','_']) +'_'+ A.replaceAll(['ƒ / ','.'],['F','_']) + '.jpg';
				var img_path = baseURL +"images/lens_test_images/screen/"+ fname;

				// load image in
				$('#test_loader').addClass('show');
				$('body').append('<img id="test_img_loader" class="img_loader" src="'+img_path+'" data-test-id="'+active_test_id+'" />');

				$('#test_img_loader').on('load', function() {
					// console.log('test img loaded');

					var test_id = $(this).attr('data-test-id');
					var img_path = $(this).attr('src');

					// console.log('test img loaded', 'test_id', test_id, 'img_path', img_path);

//					// apply change to correct image, left or right
					$('#'+test_id).find('.test_img').css("background-image", "url("+ img_path +")");
					$(this).remove();
					setTimeout(function() {
						$('#test_loader').removeClass('show');	// reveal image after a second to give hardware a change to render it
					}, 1000);

				});

			}


		}

		// slide all option panels down on click, unless in test setup mode
		// console.log('maybe about to close the panel');
		// console.log($('#product_finder_lens_test').hasClass('test_setup'));
		if(!$('#product_finder_lens_test').hasClass('test_setup')) {
			// console.log('close the panel');
			$('#product_finder_lens_test .option_panel').removeClass('show');
		}


		// also store selection for when we need to pull it out and apply it to the option blocks on switch of active lens
		var active_test_index = ($('#product_finder_lens_test').hasClass('compare')) ? $('.test_img_outer').index($('.test_img_outer.active')) : 0;	// pick active test lens (0 or 1)
//		console.log('active_test_index ' + active_test_index);
		$('.test_img_outer').eq(active_test_index).attr('data-selected-lens', $('.option_block.lens.selected').attr('data-item'));						// store selected item in active test's data
		$('.test_img_outer').eq(active_test_index).attr('data-selected-focal_length', $('.option_block.focal_length.selected').attr('data-item'));
		$('.test_img_outer').eq(active_test_index).attr('data-selected-aperture', $('.option_block.aperture.selected').attr('data-item'));


		// finally, remove clear setup mode
		$('#product_finder_lens_test').removeClass('test_setup');

	});

	$(document).on('click', '#product_finder_lens_test .compare.btn', function() {

		switchActiveTestLens(1);


//		console.log('remove it 1');
		$('#product_finder_lens_test').removeClass('switching_tests');

		// show right hand image and make left one 50% width
		$('#product_finder_lens_test').addClass('compare');
		$('#test_img_1').addClass('col span_1_of_2');

		// disable buttons except lens in no lens selected
		var selected_lens = $('.option_block.lens.selected').length;
		if (!selected_lens) {
			$('.option_panel_btn[data-option="lens"]').addClass('highlight').removeClass('selected');
			$('.option_panel[data-panel="prime_lens"]').removeClass('show');
			$('.option_panel_btn').not($('.option_panel_btn[data-option="lens"]')).addClass('disabled highlight');
			$('#product_finder_lens_test option_panel_btn .btn_title').removeClass('removed');
			$('#product_finder_lens_test option_panel_btn .selected_title').addClass('removed');
		} else {
			$('.option_panel_btn').not($('.option_panel_btn[data-option="lens"]')).addClass('disabled highlight');
		}
	});

	$(document).on('click', '#product_finder_lens_test .cancel.btn', function() {

		// hide test img 2 and make test img 1 100% width and active
		$('#product_finder_lens_test').removeClass('compare');
		$('#test_img_1').removeClass('col span_1_of_2');
		switchActiveTestLens(0);	// pass in 0-based index

		// clear stored selections
		$('.test_img_outer').attr({'data-selected-lens':'', 'data-selected-focal_length':'', 'data-selected-aperture':''}).addClass('selection_incomplete');

		// remove active img
		$('.test_img_outer').removeClass('active');

		// enable buttons if aperture is selected
		var selected_aperture = $('.option_block.aperture.selected').length;
		if (selected_aperture > 0) {
			$('.option_panel_btn').removeClass('disabled');
		}

	});

	$(document).on('click', '#product_finder_lens_test .lens_switch_btn, test_img_outer', function() {

		// if in compare mode, set active test lens
		if($('#product_finder_lens_test').hasClass('compare')) {

			// get which lens is wanted from the index of the element pressed, whether an image or btn
			var test_lens_index = ($(this).is('.test_img_outer')) ? $('.test_img_outer').index($(this)) : $('.lens_switch_btn').index($(this));
			// console.log(test_lens_index);
			switchActiveTestLens( test_lens_index );

		}

	});

	$(document).on('click', '#product_finder_lens_test .test_img_outer', function() {

		// if in compare mode, set active test lens
		if($('#product_finder_lens_test').hasClass('compare')) {

			var test_lens_index = $('.test_img_outer').index($(this));		// 0 or 1
			switchActiveTestLens( test_lens_index );

		}

	});

	$(document).on('click', '#product_finder_lens_test .nav_btn.prev', function() {				// results back btn click
//		console.log('clicked test back btn');

		// disable btn imediately to prevent double taps
		$(this).addClass('disabled');

		// page nav
		_selected = '#product_finder_results';
		startAnimRight(_selected);

		// after delay, enable button and tidy test page
		setTimeout(function() {
			$('#product_finder_results .nav_btn.prev').removeClass('disabled');
			tidyUpPage('test');
		}, 500);

	});

	$(document).on('click', '#product_finder_lens_test .clear', function() {
		// console.log('click new clear btn');

		// Clear all selections and re-select the original lens only

		// exit compare mode if needed
		var exit_compare_delay = 0;
		if($('#product_finder_lens_test').hasClass('compare')) {
			$('#product_finder_lens_test .cancel.btn').trigger('click');
			exit_compare_delay = 100;
		}

		setTimeout(function() {

			// clear all selections
			$('.option_block').removeClass('selected');

			// select original lens only
			var original_lens = $('#product_finder_lens_test').attr('data-original');
			$('.option_block[data-item="'+original_lens+'"').trigger('click');

			// enable btns
			enableNavBtns();

		}, exit_compare_delay);

	});

	// set placeholder test images on startup
	var test_img_bg_path = baseURL + "images/lens_test_images/XF14mmF2_8_R_14_F2_8.jpg";
	$('#product_finder_lens_test .test_img').css("background-image", "url("+ test_img_bg_path + ")");
	$('.test_img_outer').addClass('selection_incomplete');
	/* /LENS TEST PAGE */


	/* SCREEN TIMEOUT */
	$(document).on('click', function() {

		resetInactiveTimeout();

	});
	/* /SCREEN TIMEOUT */

});	// /doc ready






/* Other functions: */

String.prototype.replaceAll = function (find, replace) {
	// replicates PHP's replace functionality

    if (typeof find === 'string') { // string
        return this.split(find).join(replace);

    } else { // array
        var str = this;

        find.forEach(function (el, i) {
            str = str.split(el).join(replace[i]);
        });

        return str;
    }


}


function buildProductFinderResultsPage() {

//	$('#test_block').append(' buildProductFinderResultsPage(); ');

    var page_data = $('#product_finder_results').data('page_data'); // DB _response is here
    var chosen_prods = $('#product_finder_results').data('chosen_prods').split(','); // prep array of products chosen by the quesiton tags
    var recommended_prods = [],
		cam_result_structure = [];
    var html = '';
    var cam_html = '';
	var camera_journey = ($('.answer[data-tag="camera"]').hasClass('selected')) ? true : false;
	var is_range = ($('.answer[data-tag="range"]').hasClass('selected')) ? true : false;

    // remove empty slots, gather reccomended products in an array, and count cameras and lenses
    for (var p = 0; p < chosen_prods.length; p++) {
		var prod = chosen_prods[p];

        if (prod != '') {

            recommended_prods.push(prod);

			// gather structure of camera results, eg. [[cam, lens, lens], [cam, lens, lens]]
			if(camera_journey) {
				var is_cam = (prod.indexOf('mm')==-1) ? true : false;
				if(is_cam) {
					cam_result_structure.push([prod]);						// if it's a camera, add another camera array
				} else {
					cam_result_structure[cam_result_structure.length-1].push(prod);		// if it's a lens, add it to the current camera array
				}
			}
        }
    }

	// console.log(recommended_prods);
//	$('#test_block').append(JSON.stringify(recommended_prods));


	/*
		- camera journey:
			- each camera result gets a sub-panel
				- camera gets filled into the top place
				- image, title, price, subheading, bullets, learn more button
				- learn more button reveals laern more panel
				- next 1 or 2 lenses fill blocks below
				- if there's >1 camera, add a next camera button
			-

		- lens journey
			- first item (lens) gets filled into the top place
				- image, title, price, subheading, bullets, learn more button
			- next 1 or 2 fill blocks below
	*/


	// journey-specific markup
	if(camera_journey) {

		// CAMERA JOURNEY RESULTS

		// add camera panel
		// ( cam_result_structure eg. [[cam, lens, lens], [cam, lens, lens]] )

		html += "<div id='cam_panel_container'>";

		for(var c = 0; c < cam_result_structure.length; c++) {

			var cam = cam_result_structure[c][0]; // CAPS shorthand string, eg. 'X-T100'

			html +=
				"<div class='cam_result_panel result_container txt_centered active'>"+

					"<div class='main_result_block cam' data-product='"+cam+"'>"+

						// price
						//"<div class='price'><span class='price_subtext'>FROM</span><br/>£"+ page_data[cam + '_price'] +"<br/><span class='price_subtext'>BODY ONLY</span></div>"+

						// image
						"<div class='main_result_img bg cam' style='background-image: url(" + baseURL + "images/products/" + cam + ".png);' />";

						// subtitle
						// - 'recommended camera' for first or all range results, 'also consider' for others
						var subtitle_key = (c==0 || is_range) ? 'Subtitle_cam' : 'Subtitle_2';
						html +=
						"<div class='subtitle h4 orange'>"+ page_data[subtitle_key] +"</div>"+

						// title
						"<div class='title h3 dark_grey'>" + page_data[cam + '_title'] + "</div>";

						// bullets
						var b = 0;
						var bullet_top_margin = null;
						for (n = 0; n < Object.keys(page_data).length; n++) { // loop through all bits of page data
							if (Object.keys(page_data)[n].indexOf(cam + '_b') != -1) { // - if the key starts with the product name then '_b' it's a bullet for that product
								bullet_top_margin = (b == 0) ? 'marginT_2' : 'marginT_1';
								html += "<div class='bullet h8 " + bullet_top_margin + "'>" + page_data[Object.keys(page_data)[n]] + "</div>";
								b++;
							}
						}

						// learn more button
						html += "<div class='learn_more_btn h8 txt_centered'>"+ page_data['CTA'] +"<div class='arrow white right'></div></div>"+

					"</div>"; // close .main_result_block


			// add lens blocks within camera panel
			var num_lenses_in_cam_block = cam_result_structure[c].length - 1;
			// console.log("no. of lens" + num_lenses_in_cam_block);

			if (num_additional_lenses <= 2) {
				for(l = 1; l <= num_lenses_in_cam_block; l++) {
					var lens = cam_result_structure[c][l];

					// get class for bg grad - currently there can only be 1 or 2 lenses, so each one can be 1/1, 1/2 or 2/2
					var bg_class = (l==1 && num_lenses_in_cam_block==1) ? 'one_of_one' : (l==1 && num_lenses_in_cam_block==2) ? 'one_of_two' : 'two_of_two';

					html +=
						"<div class='secondary_result_block light_green "+bg_class+"' data-product='"+lens+"'>"+

							// image
							"<img class='result_img lens' src='" + baseURL + "images/products/400px_wide_no_shadow/" + lens + ".png' />"+

							// subheading (pair with)
							"<div class='subtitle h9 uppercase'>"+ page_data['Subtitle_3'] +"</div>"+

							// title
							"<div class='title h7'>"+ page_data[lens +'_title'] +"</div>"+

							// bg
							"<div class='bg'></div>"+

						"</div>";
				}

			} else {

				html += "<div class='secondary_result_wrapper'><div class='secondary_result_panel'><div class='secondary_result_panel_inner'>";

				for(l = 1; l <= num_lenses_in_cam_block; l++) {
					var lens = cam_result_structure[c][l];
					// console.log("l" + l);

					var bg_class = "";
					// get class for bg grad - currently there can only be 1 or 2 lenses, so each one can be 1/1, 1/2 or 2/2
					// var bg_class = (l==1 && num_lenses_in_cam_block==3) ? 'one_of_two' : 'two_of_two' : 'three_of_three' : (l==1 && num_lenses_in_cam_block==4) ? 'one_of_two' : 'two_of_two' : 'three_of_three' : 'four_of_four';


					html +=
						"<div class='secondary_result_block light_green "+bg_class+"' data-product='"+lens+"'>"+

							// image
							"<img class='result_img lens' src='" + baseURL + "images/products/400px_wide_no_shadow/" + lens + ".png' />"+

							// subheading (pair with)
							"<div class='subtitle h9 uppercase'>"+ page_data['Subtitle_3'] +"</div>"+

							// title
							"<div class='title h7'>"+ page_data[lens +'_title'] +"</div>"+

							// bg
							"<div class='bg'></div>"+

						"</div>";
				}
				html +=	"</div></div></div>";

			}



			// add next/prev cam panel buttons where appropriate
			var prev_cam_present = (c+1 > 1) ? true : false;										// is this is higher than the 1st there must be previous
			var next_cam_present = (c+1 < cam_result_structure.length) ? true : false;				// if there are any more cams after this


			if(prev_cam_present) {
				var prev_cta = (!is_range) ? page_data['Subtitle_5'] : page_data['Subtitle_2'];		// currently 'recommended', unless it's a range result, then it's 'also consider'
				html += "<div class='cam_panel_btn prev'>"+
							"<div class='arrow'></div>"+
							"<div class='cam_panel_btn_cta h8 txt_centered'>" + prev_cta + "</div>"+
							// "<div class='arrow'></div>"+
						"</div>";
			}
			if(next_cam_present) {
				html += "<div class='cam_panel_btn next'>"+
							// "<div class='arrow right'></div>"+
							"<div class='cam_panel_btn_cta h8 txt_centered'>" + page_data['Subtitle_2'] + "</div>"+
							"<div class='arrow right'></div>"+
						"</div>";
			}


			html += "</div>"; // close .cam_result_panel
		}

		html += "</div>"; // close #cam_panel_container

	} else {

		// LENS JOURNEY RESULTS
		var lens = recommended_prods[0]; // CAPS shorthand string, eg. 'XF16-80mmF4'

		html +=
			"<div class='lens_result_container result_container txt_centered'>"+

				"<div class='main_result_block lens' data-product='"+lens+"'>"+

					// price
					//"<div class='price'>£"+ page_data[lens + '_price'] +"</div>"+

					// image
					"<div class='main_result_img bg lens' style='background-image: url(" + baseURL + "images/products/400px_wide_no_shadow/" + lens + ".png);' />"+

					// subtitle (recommended lens)
					"<div class='subtitle h4 green'>"+ page_data['Subtitle_lens'] +"</div>"+

					// title
					"<div class='title h3 dark_grey'>" + page_data[lens + '_title'] + "</div>";

					// bullets
					var b = 0;
					var bullet_top_margin = null;
					for (n = 0; n < Object.keys(page_data).length; n++) { // loop through all bits of page data
						if (Object.keys(page_data)[n].indexOf(lens + '_b') != -1) { // - if the key starts with the product name then '_b' it's a bullet for that product
							bullet_top_margin = (b == 0) ? 'marginT_2' : 'marginT_1';
							html += "<div class='bullet h8 " + bullet_top_margin + "'>" + page_data[Object.keys(page_data)[n]] + "</div>";
							b++;
						}
					}

					// learn more button
					html += "<div class='learn_more_btn h8 txt_centered'>"+ page_data['CTA'] +"<div class='arrow white right'></div></div>"+

				"</div>"; // close .main_result_block


		// add additional lens blocks
		var num_additional_lenses = recommended_prods.length - 1;
		// console.log("no. of lens" + num_additional_lenses);

		if (num_additional_lenses <= 2) {
			for(l = 1; l <= num_additional_lenses; l++) {
				var lens = recommended_prods[l];

				// get class for bg grad - currently there can only be 1 or 2 lenses, so each one can be 1/1, 1/2 or 2/2
				var bg_class = (l==1 && num_additional_lenses==1) ? 'one_of_one' : (l==1 && num_additional_lenses==2) ? 'one_of_two' : 'two_of_two';

				html +=
					"<div class='secondary_result_block light_green "+bg_class+"' data-product='"+lens+"'>"+

						// image
						"<img class='result_img lens' src='" + baseURL + "images/products/400px_wide_no_shadow/" + lens + ".png' />"+

						// subheading (also consider)
						"<div class='subtitle h9 uppercase black'>"+ page_data['Subtitle_2'] +"</div>"+

						// title
						"<div class='title h7 black'>"+ page_data[lens +'_title'] +"</div>"+

						// bg
						"<div class='bg'></div>"+

					"</div>";

			}
		} else {

			html += "<div class='secondary_result_wrapper'><div class='secondary_result_panel'><div class='secondary_result_panel_inner'>";

			for(l = 1; l <= num_additional_lenses; l++) {
				var lens = recommended_prods[l];

				// get class for bg grad - currently there can only be 1 or 2 lenses, so each one can be 1/1, 1/2 or 2/2
				// var bg_class = (l==1 && num_additional_lenses==1) ? 'one_of_one' : (l==1 && num_additional_lenses==2) ? 'one_of_two' : 'two_of_two';

				html +=
					"<div class='secondary_result_block grad_bg "+bg_class+"' data-product='"+lens+"'>"+

						// image
						"<img class='result_img lens' src='" + baseURL + "images/products/400px_wide_no_shadow/" + lens + ".png' />"+

						// subheading (also consider)
						"<div class='subtitle h9 uppercase'>"+ page_data['Subtitle_2'] +"</div>"+

						// title
						"<div class='title h7'>"+ page_data[lens +'_title'] +"</div>"+

						// bg
						"<div class='bg'></div>"+

					"</div>";

			}
				html += "</div></div></div>";

		}


	}




    // add to page
    $('#product_finder_results_inner').html(html);


	// fill learn more popups
	setTimeout(function() {
		var main_product = $('.main_result_block').attr('data-product');
		fillLearnMorePopups(main_product);
	}, 500);



    // ensure results page is snapped to the top
	setTimeout(function() {
		$('#product_finder_results .content_container').scrollTop(0);
	}, 500);

}


function fillLearnMorePopups(main_product) {
	// param new_main_product: string & key of object containing result page data
//	console.log('fillLearnMorePopups ' + main_product);
//	$('#test_block').append(' [fillLearnMorePopups()]');

	var pd = $('#product_finder_results').data('page_data');
	var is_cam = (main_product.indexOf('mm')==-1) ? true : false;
	var spec_html = '';
	var cam_specs = ['resolution', 'sensor_size', 'sensor_type', 'image_size', 'iso_range', 'metering_system', 'shutter_range', 'continuous_shooting', 'exposure_modes', 'exposure_compensation', 'monitor', 'focusing', 'video', 'connectivity', 'storage_media', 'weight'];
	var lens_specs = ['lens_config', 'focal_length', 'angle_of_view', 'max_aperture', 'min_aperture', 'aperture_control', 'focus_range', 'max_magnification', 'external_dimensions', 'weight', 'filter_size'];
	var compact_cams = ['X100V'];
	var compact_cam_additional_specs = ['focal_length', 'aperture'];
	var is_cine_lens = (main_product.indexOf('MKX')!=-1) ? true : false;
	var cine_lens_additional_specs = ['t_no'];


	// learn more txt
	$('#learn_more .standfirst').html(pd[main_product+'_standfirst']);
	$('#learn_more .description').html(pd[main_product+'_description']);
	if(is_cam) {
		var perk_html =
			'<br/>' +
			'<div class="great_for_header gilroy_bold orange">'+ pd['Screen_learn_more_heading_1'] +': </div>' +
			'<div class="great_for_text gilroy_bold">'+ pd[main_product+'_great_for'] +'</div>';
		$('#learn_more .description').append(perk_html);
	}

	// learn more btns
	$('#learn_more .learn_more_btn.specs span').html(pd['Screen_lean_more_btn_specs']);
	$('#learn_more .learn_more_btn.sample span').html(pd['Screen_lean_more_btn_sample']);
	$('#learn_more .learn_more_btn.test span').html(pd['Screen_lean_more_btn_test']);

	// specs header
	$('#specs .specs_header').html(pd['Screen_specs_heading']);

	// prep specs rows
	if(is_cam) {

		// if cam is a compact, add the compact_cam_additional_specs to the front
		if($.inArray(main_product, compact_cams) != -1) {
			cam_specs = compact_cam_additional_specs.concat(cam_specs);
		}

		// add camera spec rows
		for(var n=0; n<cam_specs.length; n++) {

			// include specs only if the value is filled
			if(pd[main_product+'_spec_'+cam_specs[n]] != '') {
				spec_html +=
						'<div class="spec_row">'+
							'<div class="spec_row_heading h8 uppercase">'+ pd['Spec_title_'+cam_specs[n]] +': </div>'+
							'<div class="spec_row_detail h8 gilroy_light">' + pd[main_product+'_spec_'+cam_specs[n]] + '</div>' +
						'</div>';
			}
		}

		$('#learn_more').addClass('cam').removeClass('lens');	// #learn_more class controlling which btns are shown

	} else {

		// is a cine lens, add additional specs
		if(is_cine_lens) {
			lens_specs = cine_lens_additional_specs.concat(lens_specs);
			$('#learn_more').addClass('cine_lens');
		} else {
			$('#learn_more').removeClass('cine_lens');
		}

		// add lens spec rows
		for(var n=0; n<lens_specs.length; n++) {
			if(pd[main_product+'_spec_'+lens_specs[n]] != '') {
				spec_html +=
						'<div class="spec_row">'+
							'<div class="spec_row_heading h8 uppercase">'+ pd['Spec_title_'+lens_specs[n]] +': </div>'+
							'<div class="spec_row_detail h8 gilroy_light">' + pd[main_product+'_spec_'+lens_specs[n]] + '</div>' +
						'</div>';
			}
		}

		$('#learn_more').addClass('lens').removeClass('cam');	// #learn_more class controlling which btns are shown

		$('.learn_more_popup_btn.test').attr('data-product', main_product);	// add product here to tell test page which lens to pre-select


		// sample images
		// console.log('fetch sample imgs for ' + main_product);
		var sample_img_markup = '';
		$.ajax({
			url: baseURL + 'kit_selector.php',
			type: 'POST',
			data: {
				func: 'fetch_sample_imgs',
				product: main_product
			},
			async: false,
			success: function (data) {
				// console.log('sample img success_data', data);
//				$('#test_block').html(' [ajax success]');

				var data = JSON.parse(data);
				var sample_imgs = data['sample_imgs'];
				var sample_img_credits = data['sample_img_credits'];

				for(n=0; n<sample_imgs.length; n++) {

					var img = sample_imgs[n].replace('/var/www/html/kit-selector/', baseURL);	// replace the string needed
					var credit_key = img.substr( img.lastIndexOf('/') +1 );	// filename only without path
					var credit = sample_img_credits[credit_key];

					sample_img_markup +=
						"<div class='sample_img'>" +
							"<img src='"+ img +"' />";

					if(credit) {
						sample_img_markup +=
							"<div class='sample_img_credit body_copy_small'>"+ credit +"</div>";
					}

					sample_img_markup +=
						"</div>";
				}

				if(sample_imgs.length == 0) {
					$('#learn_more').addClass('no_sample_imgs');
				} else {
					$('#learn_more').removeClass('no_sample_imgs');
				}

			},
			error: function (error_data) {
				console.log('error_data', error_data);
			}
		});

		// add sample image markup
		$('#sample .sample_img_inner').html(sample_img_markup);
	}


	// add specs rows
	$('#specs .specs_details_inner').html(spec_html);

}


function startInactiveTimeout(timeout_duration) {

	window.inactive_timeout = setTimeout(function () {

		// if not on start screen, go back to start screen
		var on_start_screen = ($('#product_finder').hasClass('show_page') && $('#pf_q0').hasClass('show_container')) ? true : false;
		if(!on_start_screen) {
			backTo(0);
		}

	}, timeout_duration);
}


function resetInactiveTimeout() {

	clearTimeout(window.inactive_timeout);													// clear previous timeout cycle

	var timeout_duration_ms = $('#product_finder').data('timeout');							// take duration stored as milliseconds
	startInactiveTimeout(timeout_duration_ms);												// begin next timeout cycle

}


function fillSecondaryResultData(secondary_product_block, old_main_product) {
	// param secondary_product_block: jQuery object containing the secondary product block element to be changed
	// param old_main_product: string & key of object containing result page data

	var page_data = $('#product_finder_results').data('page_data');
	var chosen_prods = $('#product_finder_results').data('chosen_prods').split(',');
	var is_cam = (old_main_product.indexOf('mm') == -1) ? true : false;					// whether new product is a camera
	var is_recommended = (old_main_product == chosen_prods[0]) ? true : false;			// whether new product is the recommended one
	var is_cam_journey = $('#pf_q1 .answer[data-tag="camera"]').is('.selected');

	// stored product
	secondary_product_block.attr('data-product', old_main_product);

	// img
	var img_path = (is_cam) ? 'images/products/' : 'images/products/400px_wide_no_shadow/';
	var img_class = (is_cam) ? 'cam' : 'lens';
	secondary_product_block.find('img').attr('src', baseURL + img_path + old_main_product + '.png').removeClass('cam lens').addClass(img_class);

	// subtitle
	/*
		- cam journey & recommended = sub_cam
		- cam journey & !recommended & cam = sub_2
		- cam journey & !recommended & !cam = sub_3
		- !cam journey & recommended = sub_lens
		- !cam journey & !recommended = sub_2
	*/
	var subtitle = '';
	if(is_cam_journey && is_recommended) {
		subtitle = page_data['Subtitle_cam'];
 	} else if(is_cam_journey && !is_recommended && is_cam) {
		subtitle = page_data['Subtitle_2'];
 	} else if(is_cam_journey && !is_recommended && !is_cam) {
		subtitle = page_data['Subtitle_3'];
 	} else if(!is_cam_journey && is_recommended) {
		subtitle = page_data['Subtitle_lens'];
 	} else if(!is_cam_journey && !is_recommended) {
		subtitle = page_data['Subtitle_2'];
 	}
	secondary_product_block.find('.subtitle').html( subtitle );

	// title
	secondary_product_block.find('.title').html( page_data[old_main_product + '_title'] );
}


function fillMainResultData(main_product_block, new_main_product) {
	// param main_product_block: jQuery object containing the main product block element to be changed
	// param new_main_product: string & key of object containing result page data

	var page_data = $('#product_finder_results').data('page_data');
	var chosen_prods = $('#product_finder_results').data('chosen_prods').split(',');
	var is_cam = (new_main_product.indexOf('mm') == -1) ? true : false;					// whether new product is a camera
	var is_recommended = (new_main_product == chosen_prods[0]) ? true : false;			// whether new product is the recommended one
	var is_cam_journey = $('#pf_q1 .answer[data-tag="camera"]').is('.selected');
	var prod_type_class = (is_cam) ? 'cam' : 'lens';

	// stored product and type
	main_product_block.attr('data-product', new_main_product).removeClass('cam lens').addClass(prod_type_class);

	// price
	main_product_block.find('.price').html( '£' + page_data[new_main_product + '_price'] );

	// image
	var img_path = (is_cam) ? 'images/products/' : 'images/products/400px_wide_no_shadow/';
	var img_class = (is_cam) ? 'cam' : 'lens';
	main_product_block.find('.main_result_img').css('background-image', 'url(' + baseURL + img_path + new_main_product + '.png)').removeClass('cam lens').addClass(img_class);

	// subtitle
	/*
		- cam journey & recommended = sub_cam
		- cam journey & !recommended & cam = sub_2
		- cam journey & !recommended & !cam = sub_3
		- !cam journey & recommended = sub_lens
		- !cam journey & !recommended = sub_2
	*/
	var subtitle = '';
	if(is_cam_journey && is_recommended) {
		subtitle = page_data['Subtitle_cam'];
 	} else if(is_cam_journey && !is_recommended && is_cam) {
		subtitle = page_data['Subtitle_2'];
 	} else if(is_cam_journey && !is_recommended && !is_cam) {
		subtitle = page_data['Subtitle_3'];
 	} else if(!is_cam_journey && is_recommended) {
		subtitle = page_data['Subtitle_lens'];
 	} else if(!is_cam_journey && !is_recommended) {
		subtitle = page_data['Subtitle_2'];
 	}
	main_product_block.find('.subtitle').html( subtitle );

	// title
	main_product_block.find('.title').html( page_data[new_main_product + '_title'] )

	// bullets
	main_product_block.find('.bullet').remove();	// clear bullets before re-doing just in case there's a different number of bullets
	var bullet_html = '';
	var bullet_top_margin = null;
	for(var b=1; b<=4; b++) {
		var bullet_key = new_main_product + '_b' + b;
		if($.inArray( bullet_key, Object.keys(page_data) )) {
			bullet_top_margin = (b == 1) ? 'marginT_2' : 'marginT_1';
			bullet_html += "<div class='bullet h8 " + bullet_top_margin + "'>" + page_data[bullet_key] + "</div>";
		}
	}
	main_product_block.find('.learn_more_btn').before(bullet_html);

	// update learn more popups
	setTimeout(function() {
		fillLearnMorePopups(new_main_product);
	}, 500);


}


function successFunction() {
    //    console.info("It worked!");
}


function errorFunction(error) {
    //    console.error(error);
}


function backToTop() {
    $(".content_container").animate({
        scrollTop: 0
    }, 1000);
}


function updateProductFinder() {
//	console.log('updateProductFinder');

    var prod_type = $('.question_container_1 .answer[data-tag="camera"]').hasClass('selected') ? 'cam' : 'lens';
    var current_q = ($('#product_finder .show_container').index('#product_finder .question_container'));
	var cam_start_q = 2;
	var cam_end_q = 3;
	var lens_start_q = 4;
	var lens_end_q = 6;
	var start_q, end_q;

    // when changing between camera and lens, deselect all of the other path's answers
    if (prod_type == 'cam') {
		start_q = lens_start_q;
		end_q = lens_end_q;
	} else if (prod_type == 'lens') {
		start_q = cam_start_q;
		end_q = cam_end_q;
    }
	for (var q = start_q; q <= end_q; q++) {
		$('.question_container_' + q + ' .answer').removeClass('selected');
	}

    // when going back and changing answers, clear out everything in front of it
    for (q = current_q + 1; q <= $('#product_finder .question_container').length; q++) {
        $('#product_finder .question_container').eq(q).find('.answer').removeClass('selected');
    }

    // don't bother suggesting products until Q3 for cams, or Q10 for lenses
    if ((prod_type == 'cam' && current_q < 3) ||
		(prod_type == 'lens' && (current_q < 5))) {
        return false;
    }

    // suggest products based on route taken
    if ($('#product_finder').data('prod_tags')) {

        // build unique route string from question tags
        var route = '';
        $('#product_finder .answer.selected').each(function () {
			var separator = ($(this).attr('data-tag').length > 0) ? '_' : '';
            route += $(this).attr('data-tag') + separator;
        });
        route = route.substr(0, route.length - 1); // remove trailing '_'

        // pull matching list of products out of DB data
        var prod_tags = $('#product_finder').data('prod_tags'); // get tags data (which was stored here in pages.js)
        var suggested_prods = prod_tags['tag_' + route];

        // store suggested products
        $('#product_finder_results').data('chosen_prods', suggested_prods);

        // and display (for dev only - doesn't matter if left in)
        $('#products_display').html(suggested_prods);
        $('#tags_display').html(route);

    }
}


function productFinderQ_ID_to_questionNumber(input) {
	var input = parseInt(input);
    var output = input;

		if ($.inArray(input, [2,4]) != -1) {
					output = 2;

		} else if ($.inArray(input, [3, 5]) != -1) {
				output = 3;

		} else if ($.inArray(input, [6]) != -1) {
				output = 4;

		}

    return output;
}


function updateProductFinderProgress(newQ) {

//	console.log('updateProductFinderProgress ' + newQ);

    // update progress bar
	var is_camera = ($('.question_container_1 .answer[data-tag="camera"]').hasClass('selected')) ? true : false;
    var total_steps = (is_camera) ? 4 : 6; // including results
    var progress_step = productFinderQ_ID_to_questionNumber(newQ);
    var progress = Math.ceil(progress_step / total_steps * 100);
    progress = (progress > 100) ? 100 : progress; // max 100
    $('#product_finder .progress_indicator span').css('width', +progress + '%');

    // question bg movement
	/* [bg animation not wanted in this version due to hardware struggling]
    var bgMoveAmount = 10; // % bg will move horizontally
    var currentQ = $('#product_finder .show_container').index('#product_finder .question_container');
    var prevPos = $('#product_finder .bg').css('background-position');
    prevPos = parseInt(prevPos.substring(0, prevPos.indexOf('%')));
    var newPos = (newQ > currentQ) ? (prevPos + bgMoveAmount) : (prevPos - bgMoveAmount);
    $('#product_finder .bg').css('background-position', (newPos + '% 50%'));
	*/

    // bg image
	var image_change_delay = 550;	// currently set to 50ms after the text has stopped moving
	setTimeout(function () {

        // show all up to and including the new bg, hide the rest
		/*
        for (var n = 0; n <= $('#product_finder .question').length; n++) {
            if (n <= newQ) {
                $('#product_finder #bg' + n).addClass('shown');
            } else {
				$('#product_finder #bg' + n).removeClass('shown');
			}
        }
		*/

		// show only the new img
		$('#product_finder .bg_container > .bg').removeClass('shown');
		$('#product_finder #bg' + newQ).addClass('shown');


    }, image_change_delay);

	// answer bg movement
	$('#answer_bg_container').removeClass('cameras lenses');
	if($('#pf_q1 .answer[data-tag="camera"]').is('.selected')) {
		$('#answer_bg_container').addClass('cameras');

	} else if($('#pf_q1 .answer[data-tag="lens"]').is('.selected')) {
		$('#answer_bg_container').addClass('lenses');
	}

	// homepage vs normal question elements
	if(newQ > 0) {
		$('#product_finder .nav_btn_container, .progress_indicator').addClass('shown');
	} else {
		$('#product_finder .nav_btn_container, .progress_indicator').removeClass('shown');
	}


}


function resetProductFinder() {

    // go back to Q1
    $('#product_finder .question_container').removeClass('show_container hide_container');
    $('#product_finder .question_container:not(.question_container_1)').addClass('hide_container');
    $('#product_finder .question_container_1').addClass('show_container');
    updateProductFinderProgress(1);

    // de-select all answers
    $('#product_finder .answer').removeClass('selected');

    // ensure backgrounds are in the middle
    $('#product_finder .bg').css('background-position', '35% 0');

    // ensure buttons are shown and reset to starting state
    $('#product_finder .nav_btn_container').addClass('shown');
    $('#product_finder .nav_btn').addClass('disabled');

    // reset results page
    $('#product_finder_results').scrollTop(0);
    $('#product_finder_results_inner').empty().removeClass('show');
    $('#product_finder .colour_fill, #product_finder_results .colour_fill').remove();

}


function switchActiveTestLens(test_lens_index) {

	// set this to tell the system that we're switching tests
	$('#product_finder_lens_test').addClass('switching_tests');

	// buttons
	$('.lens_switch_btn').removeClass('selected');
	$('.lens_switch_btn').eq(test_lens_index).addClass('selected');

	// make select lens active
	$('.compare_btns').addClass('removed');
	$('.option_panel_btns .lens_switch_btn').removeClass('selected removed');
	$('.lens_switch_btn').eq(test_lens_index).addClass('selected').addClass('removed');


	// test images
	$('.test_img_outer').removeClass('active');
	$('.test_img_outer').eq(test_lens_index).addClass('active');


	// option blocks
	/*
		- selected options are stored in data attribute of each outer test img div
		- so grab the data of the active lens and trigger clicks to rebuild and select the right option blocks
		- or if that element isn't stored, unselect the options
	*/
	var test_img = $('.test_img_outer').eq(test_lens_index);
	var L = test_img.attr('data-selected-lens');
	var F = test_img.attr('data-selected-focal_length');
	var A = test_img.attr('data-selected-aperture');

	if(L) {
		var lens_type = (L.indexOf('-')==-1) ? 'prime' : 'zoom';
		$('.option_block.lens[data-item="'+L+'"]').trigger('click');
		$('.lens_type_btn[data-option="'+lens_type+'_lens"]').trigger('click');
	} else {
		$('.option_block.lens').removeClass('selected');
		$('.option_panel_btn').addClass('highlight').removeClass('selected');
		$('.option_panel_btn').not($('.option_panel_btn[data-option="lens"]')).addClass('disabled');
		$('.option_panel_btn .selected_title').addClass('removed');
		$('.option_panel_btn .btn_title').removeClass('removed');

	}
	setTimeout(function() {	// add timeouts here to allow the markup to be added before the next click is triggered
		if(F) {
			$('.option_block.focal_length[data-item="'+F+'"]').trigger('click');
		} else {
			$('.option_block.focal_length').removeClass('selected');
		}
		setTimeout(function() {
			if(A) {
				$('.option_block.aperture').removeClass('selected');
				$('.option_block.aperture[data-item="'+A+'"]').trigger('click');
				$('.option_block.aperture[data-item="'+A+'"]').addClass('selected');

			} else {
				$('.option_block.aperture').removeClass('selected');
			}

			// finally, unset this to tell the system that we're done switching tests
			$('#product_finder_lens_test').removeClass('switching_tests');

		}, 50);
	}, 50);

}


function loadBgImgs() {

	/*
		- this shows the main loading graphic until all question background images have loaded
		- we could consider waiting only until the first few Qs have loaded, but load order will be random
	*/

//	console.log('loadBgImgs()');

var bg_img_dir = baseURL + 'images/kit_selector_bgs/screen/';
var bg_img_filenames = {
	0: 'q1.jpg',
	1: 'q1.jpg',
	2: 'cam_q1.jpg',
	3: 'cam_q2.jpg',
	4: 'lens_q1.jpg',
	5: 'lens_q2.jpg',
	6: 'lens_q3.jpg'
}

	// add the image loader elements
	for(var n=0; n<=$('#product_finder .bg_container .bg').length-1; n++) {
		var img_src = bg_img_dir + bg_img_filenames[n];
		$('#product_finder .bg_container').append('<img id="img_loader_'+ n +'" src="'+ img_src +'" />');
	}

	// add image load handler
	$('img[id^="img_loader"]').on('load', function() {
//		console.log('loaded bg img');

		var bg_num = $(this).attr('id').replace('img_loader_','');
		var bg_path = $(this).attr('src');

		// remove loading image element and prevent memory leak
		$(this).remove();

		// set css background image of bg element
		$('#bg'+bg_num).css('background-image', 'url('+ bg_path +')').addClass('has_loaded');

		// if they've all loaded, set loaded state
		var total_bgs = $('#product_finder .bg_container .bg').length;
		var total_loaded = $('#product_finder .bg_container .bg.has_loaded').length;
		if( total_bgs - total_loaded == 0 ) {

			// move to loaded state after another second for safety
			setTimeout(function() {
				$('#product_finder').addClass('loaded');
			}, 1000);

		}
	});

}


function backTo(targetScreen) {		// param targetScreen = integer. Either 0 (for home screen) or 1 (for first question).

	// prevent attempts to jump back to anything other than q0 or q1 because it could cause unwanted behaviour
	var targetScreen = parseInt(targetScreen);
	if(targetScreen!=0 && targetScreen!=1) {
		return false;
	}

	var current_page = $('.show_page').attr('id');
	if(current_page == 'product_finder') {
		// do question nav back to q0

		var oldQuestion = '#' + $('.show_page').find('.show_container').attr('id');
		var newQuestion = '#pf_q' + targetScreen;
		questionAnimation('right', oldQuestion, newQuestion);

	} else {
		// do page nav back to product finder, and show q0

		// tidy up pages
		tidyUpPage('results');
		tidyUpPage('product_finder');

		// show q0
		$('.question_container').removeClass('show_container').addClass('hide_container');
		$('#pf_q' + targetScreen).removeClass('hide_container').addClass('show_container');
		enableNavBtns();

		// page nav
		_selected = '#product_finder';
		startAnimRight(_selected);

	}

	// common functionality
	$('.answer').removeClass('selected');	// deselect all answers - will cause unwanted bahaviour if anything other than 0 or 1 is given
	$('#product_finder_results').removeClass('sample_open');
	$('.learn_more_popup').removeClass('show');
	$('.scroll_outer').removeClass('scrolled');
	updateProductFinderProgress(targetScreen);
	tidyUpPage('test');


}


function tidyUpPage(page) {
	// just a small helper function - these tidying bits are needed in various places

	if(page == 'product_finder') {
		$('#product_finder .bg').css('background-position', '35% 50%');
		$('#product_finder .nav_btn_container').addClass('shown');
		$('.question, .answer, .question_wrapper, .bg_container, .answer_bg_container > div').removeClass('hide');
		$('.progress_indicator span').removeClass('grow_hide');

	} else if(page == 'results') {
		$('#product_finder_results_inner').removeClass('show');
		$('.scroll_outer').removeClass('scrolled');

	} else if(page == 'test') {
		// console.log('tidy up test');
		$('#product_finder_lens_test').removeClass('test_setup');
		$('#product_finder_lens_test .option_panel .option_panel_inner').scrollLeft(0);
		$('#product_finder_lens_test .option_panel').removeClass('show');
		$('#product_finder_lens_test .cancel.btn').trigger('click');
		$('#product_finder_lens_test .clear.btn').trigger('click');
	}

}


function enableNavBtns() {
	// re-enable disabled nav btns

	var current_q = $('.question_container.show_container').attr('id').replace('pf_q','');

	if(current_q == '1') {
		$('.nav_btn').removeClass('disabled');
		$('.nav_btn.reset, .nav_btn.next').addClass('disabled');

	} else {
		$('.nav_btn.prev, .nav_btn.reset').removeClass('disabled');
	}

}


function updateScrollState(outer_scroll_element) {
//	console.log('updateScrollState()');

	// param outer_scroll_element: jquery object containing a .scroll_outer element which is between .content_fade siblings

	/*
		- if content is taller than container, show bottom fade initially
		- on scroll, calculate which fades to show:
			- if offset is negative show top
			- if content height + offset > container height show bottom
	*/

	var content_height = outer_scroll_element.find('.scroll_inner').outerHeight();
	var content_pos = outer_scroll_element.find('.scroll_inner').position().top;
	var container_height = outer_scroll_element.outerHeight();

	// calc weather to show top fade
	if(content_pos < 0) {
		outer_scroll_element.siblings('.content_fade.top').addClass('show');
	} else {
		outer_scroll_element.siblings('.content_fade.top').removeClass('show');
	}

	// calc whether to show bottom fade
	if(content_height + content_pos > container_height) {
		outer_scroll_element.siblings('.content_fade.bottom').addClass('show');
		if( !outer_scroll_element.hasClass('scrolled') ) {
			outer_scroll_element.siblings('.swipe_icon').addClass('show');			// only bring the icon back if current page hasn't been scrolled already
		}
	} else {
		outer_scroll_element.siblings('.content_fade.bottom, .swipe_icon').removeClass('show');
	}

}
