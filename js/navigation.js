
var _animiationEnd = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";

var animationType = { 
	'InRight': {
		1:"animated fadeInRight show_page",
		2:"animated fadeInRight"
	},
	'QuestionInRight': {
		1:"animated fadeInRight show_container",
		2:"animated fadeInRight"
	},
	'OutRight': {
		1:"animated fadeOutRight",
		2:"animated fadeOutRight show_page",
		3:"hide_page"
	},
	'QuestionOutRight': {
		1:"animated fadeOutRight",
		2:"animated fadeOutRight show_container",
		3:"hide_container"
	},
	'InLeft': {
		1:"animated fadeInLeft show_page",
		2:"animated fadeInLeft"
	},
	'QuestionInLeft': {
		1:"animated fadeInLeft show_container",
		2:"animated fadeInLeft"
	},
	'OutLeft': {
		1:"animated fadeOutLeft",
		2:"animated fadeOutLeft show_page",
		3:"hide_page"
	},
	'QuestionOutLeft': {
		1:"animated fadeOutLeft",
		2:"animated fadeOutLeft show_container",
		3:"hide_container"
	},
	'InUp': {
		1:"animated fadeInUp show_page page_ontop",
		2:"animated fadeInUp"
	},
	'OutUp': {
		1:"animated fadeOutUp",
		2:"animated fadeOutUp show_page",
		3:"hide_page"
	},
	'InDown': {
		1:"animated fadeInDown show_page page_ontop",
		2:"animated fadeInDown"
	},
};


function animatePage(selector, direction, callback) {
//	console.log('animatePage selector:' + selector + ', direction:' + direction);
	_animPlaying = true;
	'use strict';											// um, strict mode disallows global vars - why is it needed here? does this even work?
	var add = animationType[direction][1];
	var remove = animationType[direction][2] + ' AND_THE_REST fadeInLeft fadeInRight fadeOutLeft fadeOutRight';	// why be specific about which to remove?

	
	
	//console.log('add class [' + add + '] to [' + selector + ']');
	$(selector).removeClass("hide_page page_ontop").addClass(add).one(_animiationEnd, function(e) {
		
//		console.log('_animiationEnd', e);
		
		/* 
			bug fix 1 - Where To Buy was having it's .show_page class stripped because of an unwanted animationEnd trigger - those buttons use animations
			bug fix 2 - After deeplink forces multiple rapid clicks, the first's _animationEnd never had chance to fire, 
						meaning an extra _animationEnd fires next time, detectable because only in this case does the target is not .animated
			bug fix 3 - When internally linking back and forth between items and inbox msgs, on every 2nd nav it wanted to remove the only remaining show-page, so prevent that
						
		*/
		
		if($(e.target).is('button') || 												// bug fix 1
		   $(e.target).hasClass('animated')==false || 								// bug fix 2
		   (remove.indexOf('show_page') != -1 && $('.show_page').length == 1)) {	// bug fix 3
				console.log('cancel callback. direction='+direction);
				return false;
		}	
		$(selector).removeClass(remove);
		
		if(animationType[direction][3]){
			$(selector).addClass(animationType[direction][3]);
		}
		e.stopPropagation();
		e.preventDefault();
		
//		console.log('animation end - hide generic loader');
		$('#generic_loader').removeClass('show');	// hide generic loader which just hides the interim pages

		// re-enable disabled nav btns
		enableNavBtns();
		
		
		if(callback){
			_animPlaying = false;
			callback();
		}
	});
}


function animateQuestion(selector, direction, callback) {		
	
	_animPlaying = true;
	'use strict';
	var add = animationType[direction][1];
	var remove = animationType[direction][2] + ' AND_THE_REST fadeInLeft fadeInRight fadeOutLeft fadeOutRight';	// why be specific about which to remove?
	
//	console.log('animateQuestion. selector:'+selector+', direction:'+direction+', callback:'+callback+', and add:' + add+', and remove:'+remove);
	
	$(selector).removeClass('hide_container').addClass(add).one(_animiationEnd, function(e) {
		
//		console.log('_animiationEnd', e);
		
		// add classes which perform the animation
		if(animationType[direction][3]){
			$(selector).addClass(animationType[direction][3]);
		}		
		
		// protect classes when added manually, like during product finder results anim			
		if(!$(selector).hasClass('keep_classes')) {		
			$(selector).removeClass(remove);
		}
		
		// re-enable disabled nav btns
		enableNavBtns();
		
		// prevent event bubbling
		e.stopPropagation();
		e.preventDefault();
		
		
		if(callback){
			if(direction == "QuestionInLeft") {
				$('.hide_container').scrollTop(0);
			}
			_animPlaying = false;
			callback();
		}
		
	});
	
}




/* Anim functions */
function animation(_toShow) {
	_currentPage = "#" + $('.show_page').attr('id');                    	// Get current page
//	console.log('currentPage: '+_currentPage);

	_selected = '#'+_toShow;
//	console.log("animation _selected: "+_selected);
	
	if(!$(_selected).hasClass("show_page") && $(_currentPage).hasClass("anim_up")) {        // Animate page
		startAnimUp(_selected);
	} else {
		
		// for main page transitions, decide whether to animate left or right
		if($(_selected).hasClass('page_container') && ($(_selected).parent()[0]==$('body')[0])) {		// if it's a .page_container and a direct child of body
			
			var old_page_index = $('.page_container').index($('.page_container.show_page'));
			var new_page_index = $('.page_container').index($(_selected));

			if(new_page_index < old_page_index) {
				startAnimRight(_selected);
			} else {
				startAnimLeft(_selected);
			}
			
		// other page transitions
		} else {
			startAnimLeft(_selected);
		}
		
	}
	
}


function questionAnimation(direction, oldQuestion, newQuestion) {
	
//	console.log('questionAnimation', 'direction = ' + direction, 'oldQuestion = ' + oldQuestion, 'newQuestion = ' + newQuestion );
	
	if(!$(_selected).hasClass("show_container")) {                       	// Animate question
		if(direction=='left') {
			questionStartAnimLeft(oldQuestion, newQuestion);
			
		} else if(direction=='right') {
			questionStartAnimRight(oldQuestion, newQuestion);
		}
	}
}


function questionStartAnimLeft(oldQuestion, newQuestion) {
	
//	console.log('questionStartAnim L. oldQuestion:' + oldQuestion + ', newQuestion:' + newQuestion);
	
	_animPlaying = true;	
	animateQuestion(oldQuestion, 'QuestionOutLeft');						// Animate question out of view
	animateQuestion(newQuestion, 'QuestionInRight', function() {			// Animate question into view
		_animPlaying = false;
	});
}


function questionStartAnimRight(oldQuestion, newQuestion) {
	
//	console.log('questionStartAnim R. oldQuestion:' + oldQuestion + ', newQuestion:' + newQuestion);
	
	_animPlaying = true;
	animateQuestion(oldQuestion, 'QuestionOutRight');						// Animate question out of view
	animateQuestion(newQuestion, 'QuestionInLeft', function() {				// Animate question into view
		_animPlaying = false;
	});
}


function startAnimLeft(_selected) {
	_animPlaying = true;
	_notSelected = '#' + $('.page_container.show_page').attr('id');
	animatePage(_notSelected,'OutLeft');									// Animate page out of view
	animatePage(_selected,'InRight', function() {							// Animate page into view
		_animPlaying = false;
	});
}


function startAnimRight(selector) {
	_animPlaying = true;
	_notSelected = '#' + $('.page_container.show_page').attr('id');
	animatePage(_notSelected,'OutRight');									// Animate page out of view
	animatePage(selector,'InLeft', function() {								// Animate page into view
		_animPlaying = false;
	});
}


function startAnimUp(_selected) {
	_animPlaying = true;
	_notSelected = '#' + $('.page_container.show_page').attr('id');
	animatePage(_notSelected,'OutUp');										// Animate page out of view
	animatePage(_selected,'InUp', function() {								// Animate page into view
		_animPlaying = false;
	});
}


function startAnimDown(_selected) {
	_animPlaying = true;
	_notSelected = '#' + $('.page_container.show_page').attr('id');
	animatePage(_notSelected,'OutUp');										// Animate page out of view
	animatePage(_selected,'InDown', function() {							// Animate page into view
		_animPlaying = false;
	});
}
/* / Anim functions */

