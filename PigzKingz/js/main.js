(function(){
	// FAQ Template - by CodyHouse.co
  var FaqTemplate = function(element) {
		this.element = element;
		this.triggers = this.element.getElementsByClassName('accordion-item-trigger');
		this.faqContainer = this.element.getElementsByClassName('accordion-wrapper')[0];
		this.faqOverlay = this.element.getElementsByClassName('cd-faq__overlay')[0];
		this.faqClose = this.element.getElementsByClassName('cd-faq__close-panel')[0];
		this.scrolling = false;
		initFaqEvents(this);
  };

  function initFaqEvents(faqs) {
  	// click on a faq category
		faqs.faqsCategoriesContainer.addEventListener('click', function(event){

			var mq = getMq(faqs),
				selectedCategory = category.getAttribute('href').replace('#', '');
			if(mq == 'mobile') { // on mobile, open faq panel
				event.preventDefault();
				faqs.faqContainer.scrollTop = 0;
				Util.addClass(faqs.faqContainer, 'accordion-wrapper--slide-in');
				Util.addClass(faqs.faqClose, 'cd-faq__close-panel--move-left');
				Util.addClass(faqs.faqOverlay, 'cd-faq__overlay--is-visible');
				var selectedSection = faqs.faqContainer.getElementsByClassName('cd-faq__group--selected');
				if(selectedSection.length > 0) {
					Util.removeClass(selectedSection[0], 'cd-faq__group--selected');
				}
				Util.addClass(document.getElementById(selectedCategory), 'cd-faq__group--selected');
			} else { // on desktop, scroll to section
				if(!window.requestAnimationFrame) return;
				event.preventDefault();
				var windowScrollTop = window.scrollY || document.documentElement.scrollTop;
				Util.scrollTo(document.getElementById(selectedCategory).getBoundingClientRect().top + windowScrollTop + 2, 200);
			}
		});

		// on mobile -> close faq panel
		faqs.faqOverlay.addEventListener('click', function(event){
			closeFaqPanel(faqs);
		});
		faqs.faqClose.addEventListener('click', function(event){
			event.preventDefault();
			closeFaqPanel(faqs);
		});

		// on desktop -> toggle faq content visibility when clicking on the trigger element
		faqs.faqContainer.addEventListener('click', function(event){
			if(getMq(faqs) != 'desktop') return;
			var trigger = event.target.closest('accordion-item-trigger');
			if(!trigger) return;
			event.preventDefault();
			var content = trigger.nextElementSibling,
				parent = trigger.closest('div'),
				bool = Util.hasClass(parent, 'accordion-item-visible');

			Util.toggleClass(parent, 'accordion-item-visible', !bool);

			//store initial and final height - animate faq content height
			Util.addClass(content, 'accordion-item-content--visible');
			var initHeight = bool ? content.offsetHeight: 0,
				finalHeight = bool ? 0 : content.offsetHeight;
			
			if(window.requestAnimationFrame) {
				Util.setHeight(initHeight, finalHeight, content, 200, function(){
					heighAnimationCb(content, bool);
				});
			} else {
				heighAnimationCb(content, bool);
			}
		});
		
		if(window.requestAnimationFrame) {
			// on scroll -> update selected category
			window.addEventListener('scroll', function(){
				if(getMq(faqs) != 'desktop' || faqs.scrolling) return;
				faqs.scrolling = true;
				window.requestAnimationFrame(updateCategory.bind(faqs)); 
			});
		}
  };

  function closeFaqPanel(faqs) {
  	Util.removeClass(faqs.faqContainer, 'accordion-item--slide-in');
  	Util.removeClass(faqs.faqClose, 'cd-faq__close-panel--move-left');
  	Util.removeClass(faqs.faqOverlay, 'cd-faq__overlay--is-visible');
  };

  function getMq(faqs) {
		//get MQ value ('desktop' or 'mobile') 
		return window.getComputedStyle(faqs.element, '::before').getPropertyValue('content').replace(/'|"/g, "");
  };

  function heighAnimationCb(content, bool) {
		content.removeAttribute("style");
		if(bool) Util.removeClass(content, 'accordion-item-content--visible');
  };

  var faqTemplate = document.getElementsByClassName('faq'),
  	faqArray = [];
  if(faqTemplate.length > 0) {
		for(var i = 0; i < faqTemplate.length; i++) {
			faqArray.push(new FaqTemplate(faqTemplate[i])); 
		}
  };
})();