/**
 * Change position of nodes
 * @param {Object} DOM Entity
 * @param {Object} DOM Entity
 * @param {Array<DOM Entity>} nodes
 */
(function(topField,  leftField, nodes){
	/*
	 * Constants
	 */
	var POST_FORMS_APP = "post_form_app";
		
	/*
	 * Set default value
	 */	
	var setting = get(POST_FORMS_APP);
	topField.value = setting && setting.top ? setting.top : 0;   
	leftField.value = setting && setting.left ? setting.left : 0;
	moveHandler();
	
	/*
	 * Set listeners
	 */
	topField.addEventListener("change", moveHandler, false);
	leftField.addEventListener("change", moveHandler, false);
				
	/*
	 * Change position
	 */
	function moveHandler(){	
		for (var i = 0, length = nodes.length; i < length; i++) {
			nodes[i].style.left = leftField.value + "mm";
			nodes[i].style.top = topField.value + "mm";					
		}
		
		save({"top":topField.value, "left":leftField.value});
	}
	
	/*
	 * Save object to storage
	 */
	function save(obj){		
		if( !isLocalStorage() ){
			return;
		}
	
		localStorage.setItem(POST_FORMS_APP, JSON.stringify(obj));		
	}
	
	/*
	 * Get object from storage
	 */
	function get(key){
		if( !isLocalStorage() ){
			return;
		}
		
		return JSON.parse(localStorage.getItem(key));		
	}
	
	/*
	 * Is local storage
	 */
	function isLocalStorage(){
		try {
   			return 'localStorage' in window && window['localStorage'] !== null;
  		} catch (e) {
    		return false;
  		}
	}
	
	
})( document.getElementById("MOVE_TO_TOP"), document.getElementById("MOVE_TO_LEFT"), document.querySelectorAll(".text_fields"));
