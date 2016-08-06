/*
TODO:
  - Functions
    - require-like function, name to url mapping for libraries (ex. jQuery)
    - add style element through object key to value mapping for styling
    - event handler that fires on any input event and gives object with details
    - easy animations
  - General
    - Document the code
    - Move relevant code to folders as modules
    - Look for more code and save your goodies!
*/

/* Get style object from style string
  Arguments:
    style_string (String): string representing CSS style of single element as string

  Example:
    in:
      > style_string = 'background:black; top:0px; display:inline; left:15%;';
      > JSON.stringify(
        get_style_dict(style_string),
        null,
        2
      );
    
    out:
      "{
        "background": "black",
        "top": "0px",
        "display": "inline",
        "left": "15%"
      }"
*/
function get_style_dict(style_string) {
  // Array of 'key : value' style properties
  style_arr = style_string
    // Strip semicolons, colons and whitespace for clear input
    .replace(/^[;:\s]+|[;:\s]+$/, '')
    .split(';')
  ;
  
  // Object that will contain key, value pairs of style properties
  style_dict = {};
  
  for (var i = 0; i < style_arr.length; i++) {
    var style_attribute = style_arr[i]
      // Strip semicolons, colons and whitespace for clear input
      // Note: Perhaps turn it into a function?
      .replace(/^[;:\s]+|[;:\s]+$/, '');
    if (style_attribute === '') {
      continue;
    }
    
    var style_key_val = style_attribute.split(':');
    // We must get exactly 2 elements: key and value
    if (style_key_val.length !== 2) {
      continue;
    }
    
    var style_key = style_key_val[0].trim();
    var style_value = style_key_val[1].trim();
    
    style_dict[style_key] = style_value;
  }
  
  return style_dict;
}


/* Get object difference (added, removed, modified)
  Arguments:
    old_obj (Object): old object
    new_obj (Object): new object

  Example:
    in:
      > var old_obj = {
        "remove_key": "remove_val",
        "modify_key": "old_val"
      };
      > var new_obj = {
        "add_key": "new_val",
        "modify_key": "new_val"
      };
      > JSON.stringify(
        get_obj_diff(old_obj, new_obj),
        null,
        2
      );
    
    out:
      "{
        "added": {
          "add_key": {
            "new": "new_val"
          }
        },
        "removed": {
          "remove_key": {
            "old": "remove_val"
          }
        },
        "modified": {
          "modify_key": {
            "old": "old_val",
            "new": "new_val"
          }
        },
        "changed": {
          "remove_key": "removed",
          "modify_key": "modified",
          "add_key": "added"
        }
      }"
*/
function get_obj_diff(old_obj, new_obj) {
  // Object that will contain differences
  //   beween the objects being compared
  var obj_diff = {
    'added': {},
    'removed': {},
    'modified': {},
    'changed': {}
  };
  
  // Object that will contain keys and values
  //   from both objects being compared
  var combined_obj = {};
  
  // Populate the combined object with keys from old object,
  //   storing old value and initializing new empty value
  for (var key in old_obj) {
    if (old_obj.hasOwnProperty(key)) {
      var val = old_obj[key];
      combined_obj[key] = {
        'old': val,
        'new': ''
      };
    }
  }
  
  // Populate the combined objects with keys from new object,
  //   storing new value if key exists in old object, otherwise
  //   storing new value and initializing empty old value
  for (var key in new_obj) {
    if (new_obj.hasOwnProperty(key)) {
      var val = new_obj[key];
      if (combined_obj.hasOwnProperty(key)) {
        combined_obj[key]['new'] = val;
      } else {
        combined_obj[key] = {
          'old': '',
          'new': val
        }
      }
    }
  }
  
  // Create object diff from combined object
  // Create value for key depending on status of change:
  //   added, removed or modified
  // Add status to key 'changed' for quick lookup, instead
  //   of looping through 3 status keys
  for (var key in combined_obj) {
    if (combined_obj.hasOwnProperty(key)) {
      var val = combined_obj[key];
      if (val['old'] === '' && val['new'] !== '') {
        obj_diff['added'][key] = {
          'new': val['new']
        }
        obj_diff['changed'][key] = 'added';
      } else if (val['new'] === '' && val['old'] !== '') {
        obj_diff['removed'][key] = {
          'old': val['old']
        }
        obj_diff['changed'][key] = 'removed';
      } else if (val['new'] !== val['old']) {
        obj_diff['modified'][key] = {
          'old': val['old'],
          'new': val['new']
        }
        obj_diff['changed'][key] = 'modified';
      }
    }
  }
  
  return obj_diff;
}


function play_audio(url) {
  new Audio(url).play();
}


function copy_text_to_clipboard(text) {
	var textArea = document.createElement("textarea");

	// Place in top-left corner of screen regardless of scroll position.
	textArea.style.position = 'fixed';
	textArea.style.top = 0;
	textArea.style.left = 0;

	// Ensure it has a small width and height. Setting to 1px / 1em
	//   doesn't work as this gives a negative w/h on some browsers.
	textArea.style.width = '2em';
	textArea.style.height = '2em';

	// We don't need padding, reducing the size if it does flash render.
	textArea.style.padding = 0;

	// Clean up any borders.
	textArea.style.border = 'none';
	textArea.style.outline = 'none';
	textArea.style.boxShadow = 'none';

	// Avoid flash of white box if rendered for any reason.
	textArea.style.background = 'transparent';

	textArea.value = text;

	document.body.appendChild(textArea);

	textArea.select();
  
  var successful = false;
	try {
		successful = document.execCommand('copy');
	} catch (err) {
		console.warn('Unable to copy to clipboard.');
	}

	document.body.removeChild(textArea);
	
	return successful;
}


function get_style_from_selector(selector) {
  /*
    TODO:
      - Add programatically added styles to serach
  */
  for (var i = 0; i < document.styleSheets.length; i++) {
  	var styleSheet = document.styleSheets[i];
  
  	var rules = styleSheet.cssRules || styleSheet.rules;
  	
  	if (rules != undefined) {
  		for (var j = 0; j < rules.length; j++) {
  			var rule = rules[j];
  
  			if (rule.selectorText === selector) {
  				return rule.style;
  			}
  		}
  	}
  }
  
  return null;
}


function get_ancestor_element(elem, check_func) {
  if (check_func) {
    while (elem) {
      elem = elem.parentElement;
      if (check_func(elem)) {
        break;
      }
    }
  } else {
    while (elem.parentElement) {
      elem = elem.parentElement;
    }
  }
  return elem;
}


function wait_for_script_load(src, look_for, callback) {
  /*
    TODO:
      - Add custom check_loaded function as parameter
  */
  if (window[look_for] !== undefined) {
    return callback();
  }
  
  var s = document.createElement('script');
  s.type = "text/javascript";
  s.src = src;
  document.head.appendChild(s);
  
  var wait_interval = setInterval(() => {
    if (window[look_for]) {
      clearInterval(wait_interval);
      callback(window[look_for]);
    }
  }, 10);
}


function add_jQuery(onload, version) {
  /*
    TODO:
      - Add no conflict option
      - Add latest version
      - Add feature support to version mapping
  */
  version = version || "1.11.1";
  var url = "https://ajax.googleapis.com/ajax/libs/jquery/" + version + "/jquery.min.js";
  wait_for_script_load(url, 'jQuery', onload);
}


function get_youtube_video_info(id, callback) {
  /*
    TODO:
      - remove jQuery dependency
  */
  var url = 'https://www.youtube.com/watch?v=' + id;
  add_jQuery(() => {
    $.getJSON(
      'https://noembed.com/embed',
      {format: 'json', url: url},
      callback
    );
  });
}


function html_to_dom(html_str) {
  var elem = document.createElement('html');
  elem.innerHTML = html_str;
  
  return elem;
}


function http_get(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.send();
  
  xhr.onload = () => {
    callback(xhr.responseText);
  };
}


function wait_for_notification_approval(callback) {
  // Keep requesting until an option is chosen
  if (Notification.permission === "default") {
    Notification.requestPermission();
    setTimeout(wait_for_notification_approval, 500);
  } else {
    callback();
  }
}


function get_canvas_image_url(canvas, callback) {
  canvas.toBlob((blob) => {
    var url = URL.createObjectURL(blob);
    callback(url);
  }
}


function check_popup_blocked(window) {
  return !newWin || newWin.closed || typeof newWin.closed=='undefined';
}


function truncate_to(n, i) {
	var integer = Math.trunc(n);
	var sliced = String(integer).slice(0,i);
	return Number(sliced);
}


function zero_pad(n, i) {
  if (i <= 1) {
    return n;
  } else if (Number(n) < Math.pow(10, i - 1)) {
    n = "0" + n;
    return zero_pad(n, i - 1);
  }
  return n;
}


function get_time() {
  /*
    TODO:
      - Add custom formatting option
  */
  var today = new Date();

  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  var ms = today.getMilliseconds()

  // add a zero in front of numbers<10
  m = zeroPad(m, 2);
  s = zeroPad(s, 2);
  ms = truncateTo(ms, 1)

  return {
    "timestamp": today,

    "h": h,
    "m": m,
    "s": s,
    "ms": ms,

    "time": h + ":" + m + ":" + s + "." + ms
  }
}
