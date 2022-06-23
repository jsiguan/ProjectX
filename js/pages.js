

function pagesMarkUp(_response) {

   // console.log(_response);


    /* Product finder page - X-Series */
	// non-linear journey controlled in main.js
    if(_response.sectionName == "product_finder_v3") {
        //		console.log(_response);
        $('#product_finder').empty();
        $('#product_finder').html(

			"<div class='content_container with_tab_bar product_finder shown'>"+

				"<div id='pf_q0' class='question_container force_gpu question_container_0 show_container homepage_start_btn'>"+
					"<div class='question_wrapper'>"+										// Home page
						"<div id='home_title' class=''>"+
						"HELP ME<br>CHOOSE<br>A LENS" +
						"</div>"+
					"</div>"+
					"<div class='answer_wrapper'>"+
						"<img class='bounce' src='images/touch_symbol.svg' />"+
						"<span class='h2'>"+_response.Screen_homepage_cta+"</span>"+
					 "</div>"+
				"</div>"+

				"<div id='pf_q1' class='question_container force_gpu question_container_1 hide_container'>"+
					"<div class='question_wrapper'>"+										// Q1 - camera or lens?
						"<p class='question h1 white txt_centered'>"+_response.Q1+"</p>"+
					"</div>"+
					"<div class='answer_wrapper'>"+
						//"<div class='answer h8' data-tag='camera'><span class='centre_x_y'>"+_response.Q1_A1+"</span></div>"+
						"<div class='answer h8 selected' data-tag='lens'><span class='centre_x_y'>"+_response.Q1_A2+"</span></div>"+
					 "</div>"+
				"</div>"+

				"<div id='pf_q2' class='question_container force_gpu question_container_2 hide_container'>"+
					"<div class='question_wrapper'>"+										// Q2 - Cameras Q1 - What would you like to use the camera for (select up to three options)?
						"<p class='question h1 white txt_centered'>"+_response.Camera_Q1+"</p>"+
					"</div>"+
					"<div class='answer_wrapper multiple'>"+
							"<div class='answer h8' data-tag='people'><span class='centre_x_y'>"+_response.Camera_Q1_A1+"</span></div>"+		// keep this data-tag empty to match old results
							"<div class='answer h8' data-tag='land_city'><span class='centre_x_y'>"+_response.Camera_Q1_A2+"</span></div>"+
              "<div class='answer h8' data-tag='wild_sport'><span class='centre_x_y'>"+_response.Camera_Q1_A3+"</span></div>"+
              "<div class='answer h8' data-tag='life'><span class='centre_x_y'>"+_response.Camera_Q1_A4+"</span></div>"+
              "<div class='answer h8' data-tag='doc_street'><span class='centre_x_y'>"+_response.Camera_Q1_A5+"</span></div>"+
              "<div class='answer h8' data-tag='video'><span class='centre_x_y'>"+_response.Camera_Q1_A6+"</span></div>"+
              "<div class='answer h8' data-tag='range'><span class='centre_x_y'>"+_response.Camera_Q1_A7+"</span></div>"+
					"</div>"+
				"</div>"+

				"<div id='pf_q3' class='question_container force_gpu question_container_3 hide_container'>"+
					"<div class='question_wrapper'>"+										// Q3 - Camera Q2 - What is your photographic level?
						"<p class='question h1 white txt_centered'>"+_response.Camera_Q2+"</p>"+
					"</div>"+
					"<div class='answer_wrapper'>"+
						"<div class='answer h8' data-tag='beginner'><span class='centre_x_y'>"+_response.Camera_Q2_A1+"</span></div>"+
						"<div class='answer h8' data-tag='advanced'><span class='centre_x_y'>"+_response.Camera_Q2_A2+"</span></div>"+
					"</div>"+
				"</div>"+

				"<div id='pf_q4' class='question_container force_gpu question_container_4 hide_container'>"+
					"<div class='question_wrapper'>"+										// Q4 - Lenses_A Q1 - What would you like to use the lens for (pick up to three options)?
						"<p class='question h1 white txt_centered'>"+_response.Lens_Q1+"</p>"+
					"</div>"+
					"<div class='answer_wrapper multiple'>"+
						"<div class='answer h8' data-tag='people'><span class='centre_x_y'>"+_response.Lens_Q1_A1+"</span></div>"+
						"<div class='answer h8' data-tag='land_city'><span class='centre_x_y'>"+_response.Lens_Q1_A2+"</span></div>"+
						"<div class='answer h8' data-tag='wild_sport'><span class='centre_x_y'>"+_response.Lens_Q1_A3+"</span></div>"+
            "<div class='answer h8' data-tag='life'><span class='centre_x_y'>"+_response.Lens_Q1_A4+"</span></div>"+
            "<div class='answer h8' data-tag='doc_street'><span class='centre_x_y'>"+_response.Lens_Q1_A5+"</span></div>"+
            "<div class='answer h8' data-tag='video'><span class='centre_x_y'>"+_response.Lens_Q1_A6+"</span></div>"+
            "<div class='answer h8' data-tag='range'><span class='centre_x_y'>"+_response.Lens_Q1_A7+"</span></div>"+
					"</div>"+
				"</div>"+

				"<div id='pf_q5' class='question_container force_gpu question_container_5 hide_container'>"+
					"<div class='question_wrapper'>"+										// Q5 - Lenses_A Q2a - What's most important - versatility or quality?
						"<p class='question h1 white txt_centered'>"+_response.Lens_Q2+"</p>"+
					"</div>"+
					"<div class='answer_wrapper'>"+
						"<div class='answer h8' data-tag='versatility'><span class='centre_x_y'>"+_response.Lens_Q2_A1+"</span></div>"+
						"<div class='answer h8' data-tag='quality'><span class='centre_x_y'>"+_response.Lens_Q2_A2+"</span></div>"+
					"</div>"+
				"</div>"+

				"<div id='pf_q6' class='question_container force_gpu question_container_6 hide_container'>"+
					"<div class='question_wrapper'>"+									// Q6 - Lenses_A Q2b - What's most important - size or performance?
						"<p class='question h1 white txt_centered'>"+_response.Lens_Q3+"</p>"+
					"</div>"+
					"<div class='answer_wrapper'>"+
						"<div class='answer h8' data-tag='size'><span class='centre_x_y'>"+_response.Lens_Q3_A1+"</span></div>"+
						"<div class='answer h8' data-tag='performance'><span class='centre_x_y'>"+_response.Lens_Q3_A2+"</span></div>"+
					"</div>"+
				"</div>"+




				// dev div:
				// also used for passing the results journey to GA for tracking
				"<div id='dev_results'>"+
					"<p>all tags based on answers:</p>"+
					"<div id='tags_display'></div>"+
					"<p>all products based on matching tags:</p>"+
					"<div id='products_display'></div>"+
					"</div>"+
				"</div>"+
				// /dev div


				// progress bar
				"<div class='progress_indicator'><span></span></div>"+


				// question bgs
				"<div class='bg_container'>"+
					"<div class='bg_overlay'></div>"+
					"<div id='bg0' class='bg force_gpu shown'></div>"+
					"<div id='bg1' class='bg force_gpu'></div>"+
					"<div id='bg2' class='bg force_gpu'></div>"+
					"<div id='bg3' class='bg force_gpu'></div>"+
					"<div id='bg4' class='bg force_gpu'></div>"+
					"<div id='bg5' class='bg force_gpu'></div>"+
					"<div id='bg6' class='bg force_gpu'></div>"+
				"</div>"+


				// answer bg
				"<div class='answer_bg_container'>"+
					"<div class='green_bg'></div>"+
				"</div>"+


				// bottom nav btns
				"<div class='nav_btn_container'>"+

					"<div class='btn nav_btn reset dark_grey disabled'>"+
						"<div class='centre_x_y'>"+
							"<div class='icon'></div>"+
							"<span class='txt_centered'></span>"+
						"</div>"+
					"</div>"+

					"<div class='btn nav_btn prev white'>"+
						"<div class='centre_x_y'>"+
							"<div class='icon'></div>"+
							"<span class='txt_centered'></span>"+
						"</div>"+
					"</div>"+

					// next button will exist for functionality uniformity across all versions but is hidden in this screen version
					"<div class='btn nav_btn white next disabled'>"+
            "<div class='centre_x_y'>"+
              "<div class='icon'></div>"+
              "<span class='txt_centered'></span>"+
            "</div>"+
          "</div>"+

				"</div>"+


			// close content container
			"</div>");



        // store tags data with this container
        if(Object.keys($('#product_finder').data()).indexOf('prod_tags') == -1) {	// only if prod_tags not set yet

            // prep array of just the tags
            var prod_tags = [];
            for(var p in _response) {
                if(p.indexOf('tag_') != -1) {
                    prod_tags[p] = _response[p];
                }
            }

            // stick it on the page element for later use
            $('#product_finder').data('prod_tags', prod_tags);
        }



		// begin screen timeout cycle
		var timeout_duration_ms = parseInt(_response.Screen_timeout_mins) * 60 * 1000;	// take duration stored as minutes and convert to milliseconds
		startInactiveTimeout(timeout_duration_ms);										// begin timeout cycle
		$('#product_finder').data('timeout', timeout_duration_ms);						// also store in ms for next reset




		// fill all nav btns' text with the copy stored with this page
		$('.nav_btn.reset span').html(_response.Screen_btn_reset);
		$('.nav_btn.prev span').html(_response.Screen_btn_back);
    $('.nav_btn.next span').html(_response.Screen_btn_next);



		// finally, begin preloading function for bg imgs
		loadBgImgs();


    }
    /* /Product finder page - X-Series */


    /* Product finder results page */
    if(_response.sectionName == "product_finder_v3_results") {

        // store the _response data for use later when we build the results page
        if(Object.keys($('#product_finder_results').data()).indexOf('page_data') == -1) {
            $('#product_finder_results').data('page_data', _response);
        }

		// add text to learn results page popups - learn more, specs, sample imgs
		$('#learn_more .learn_more_popup_btn.specs span').html(_response.Screen_lean_more_btn_specs);
		$('#learn_more .learn_more_popup_btn.sample span').html(_response.Screen_lean_more_btn_sample);
		$('#learn_more .learn_more_popup_btn.test span').html(_response.Screen_lean_more_btn_test);

		// also add in the copy for the lens test page, which is in the same json object
		// TO DO - tidy up when we know btns aren't needed
		$('#product_finder_lens_test .page_title').html(_response.Lens_test_title);
		$('#product_finder_lens_test .standfirst').html(_response.Lens_test_standfirst);
		$('#product_finder_lens_test .option_panel_btn[data-option="lens"] .btn_title').html(_response.Screen_test_property_btn_lens);
		$('#product_finder_lens_test .option_panel_btn[data-option="focal_length"] .btn_title').html(_response.Screen_test_property_btn_focal_length);
		$('#product_finder_lens_test .option_panel_btn[data-option="aperture"] .btn_title').html(_response.Screen_test_property_btn_aperture);
		$('#product_finder_lens_test .btn.clear span').html(_response.Screen_test_clear);
		$('#product_finder_lens_test .btn.compare span').html(_response.Screen_test_compare_btn);
		$('#product_finder_lens_test .compare_btns .lens_1, #product_finder_lens_test .option_panel_btns .lens_1 span').html(_response.Screen_test_lens_1_btn);
		$('#product_finder_lens_test .compare_btns .lens_2, #product_finder_lens_test .option_panel_btns .lens_2 span').html(_response.Screen_test_lens_2_btn);
		$('#product_finder_lens_test .btn.cancel span').html(_response.Screen_test_exit_comparison_btn);
    }
    /* /Product finder results page */


  	/* /Product finder lens test page */
  	if(_response.sectionName == "product_finder_lens_test") {

  		/*
  			- copy for this page is stored in the product_finder_results json, and so is filled in the block above
  			- this _response contains the aperture data for each lens, so we just build the selection options here
  		*/

  		var aperture_data = _response;
  //		console.log(aperture_data);

  		/*
  			- data inherited for project stored in DB as a single row for each aperture
  			- data structure = multiple lenses, each has multiple focal lengths, and each of those has multiple apertures
  			- so to build the UI we want this structure:
  				{
  					lens {
  						focal_length : [apertures]
  					}
  				}

  			- eg.	L {
  						F : [A,A],
  						F : [A,A,A]
  				 	}
  		*/

  		var aperture_obj = {}
  		for(var r=0; r<Object.keys(aperture_data).length - 2; r++) {
  			var row = aperture_data[r];		// row from DB (inherited from promultis data)
  			var L = row[0];					// string content eg. "XF23mmF2"
  			var F = row[1];					// string content eg. "23 mm"
  			var A = row[2];					// string content eg. "f / 2.8"

  			if(Object.keys(aperture_obj).indexOf(L) == -1) {
  				// new lens so create all 3 levels
  				var focal_length_property = {};
  				focal_length_property[F] = [A];
  				aperture_obj[L] = focal_length_property;

  			} else {
  				// lens exists
  				if(Object.keys(aperture_obj[L]).indexOf(F) == -1) {
  					// new focal length so create that inside the lens
  					aperture_obj[L][F] = [A];

  				} else {
  					// lens and focal length exist so just add aperture
  					aperture_obj[L][F].push(A);
  				}
  			}
  		}

  		// console.log(aperture_obj);

  		// build lens option blocks
  		var num_lenses = Object.keys(aperture_obj).length;

  		for(var l=0; l<num_lenses; l++) {

  			var title = Object.keys(aperture_obj)[l];
  			var product_filename = (title.indexOf(' ')==-1) ? title : title.substring(0, title.indexOf(' ')); 	// take title up to the first space (if present) to match filename
  			var img_path = baseURL + 'images/products/' + product_filename + '.png';
  			var category = (title.indexOf('-') == -1) ? 'prime' : 'zoom';

  			// Tweak for the 200mm + Teleconverter
  			// There's both a [200mm] and a [200mm + Teleconverter] option, so make sure there's a difference in the stored data-item
  			product_filename = (title.indexOf('+')==-1) ? product_filename : product_filename + '+';

  			$('#product_finder_lens_test .option_panel[data-panel="'+category+'_lens"] .option_panel_inner').append(
  				"<div class='option_block lens bg "+category+"' data-item='"+product_filename+"' style='background-image: url("+ img_path +")'>"+
  					"<div class='title txt_centered body_copy_smaller'>"+ title +"</div>"+
  				"</div>");
  		}
  		$('#product_finder_lens_test .option_panel[data-panel="lens"] .option_panel_inner').append( "<div class='clearfix'></div>" );


  		// add all lenses to one panel
  		$('.option_panel[data-panel="prime_lens"] .option_panel_inner').append($('.option_panel[data-panel="zoom_lens"] .option_panel_inner').html());
  		$('#product_finder_lens_test .option_panel[data-panel="focal_length"] .option_panel_inner').html();
  		$('#product_finder_lens_test .option_panel[data-panel="aperture"] .option_panel_inner').html();


  		// store aperture object in DOM data for use later
  		$('#product_finder_lens_test').data('aperture_obj', aperture_obj);


  		// set Option Block Title style as screen can't accurately use vw/vh that small
  //		var obt_vh_font_size = 0.7;				// vh equivalent
  //		var obt_vh_line_height = 0.7;			// vh equivalent
  //		var vh = window.outerHeight / 100;
  //		$('#test_block').append('<br/> initial = ' + $('.option_block .title').css('font-size') + ', 1vh = ' + vh );
  //		$('.option_block .title').css({
  //			'font-size': (vh * obt_vh_font_size) + 'px',
  //			'line-height': (vh * obt_vh_line_height) + 'px'
  //		});
  //		$('#test_block').append(', calculated = ' + (vh * obt_vh_font_size) + 'px, new = ' + $('.option_block .title').css('font-size'));

  	}
  	/* /Product finder lens test page */

}
