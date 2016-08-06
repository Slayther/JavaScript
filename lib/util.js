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
  style_arr = style_string.replace(/^[;:\s]+|[;:\s]+$/, '').split(';');
  
  style_dict = {};
  
  for (var i = 0; i < style_arr.length; i++) {
    var style_attribute = style_arr[i].replace(/^[;:\s]+|[;:\s]+$/, '');
    if (style_attribute === undefined) {
      continue;
    }
    
    var style_key_val = style_attribute.split(':');
    if (style_key_val.length < 2) {
      continue;
    }
    
    var style_key = style_key_val[0].trim();
    var style_value = style_key_val[1].trim();
    
    style_dict[style_key] = style_value;
  }
  
  return style_dict;
}


/*
=========================================================================
*/


/* Get obj difference
  Arguments:
    obj1 (Object): old object
    obj2 (Object): new object

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
function get_obj_diff(obj1, obj2) {
  var obj_diff = {
    'added': {},
    'removed': {},
    'modified': {},
    'changed': {}
  };
  
  var combined_obj = {};
  
  for (var key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      var val = obj1[key];
      combined_obj[key] = {
        'old': val,
        'new': ''
      };
    }
  }
  
  for (var key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      var val = obj2[key];
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
