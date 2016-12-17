"use strict";

// a global Object to hold IDs and sentences read from a specified file
var DAT = {
  // sentence IDs, each with a <span> tag and a tab character
  id_tags : [],
  // sentences included in a specified file
  sentences : []
};

// Create a quasi-namespace for general common functions,
// by using an Object named COM_FUNC.
var COM_FUNC = {};

// Read a selected text file, which is in the tab-separated format.
COM_FUNC.read_in = function() {
  var reader = new FileReader();
  reader.onload = COM_FUNC.txt_loaded;
  var input_file = document.getElementById("input_txt_file");
  reader.readAsText(input_file.files[0], "utf-8");
};

// This is called from COM_FUNC.read_in().
// Set the values in DAT, and display all the sentences.
COM_FUNC.txt_loaded = function(e) {
  var lines = e.target.result.split('\n');
  for (var i = 0, N = lines.length-1, str=""; i < N; i++) {
    var tmp=lines[i].split("\t");
    DAT.id_tags[i] = "<span class=\"tag\">" + tmp[0] + "</span>\t";
    DAT.sentences[i] = tmp[1];
    str += (DAT.id_tags[i] + DAT.sentences[i] + "\n");
  }
  document.getElementById("output_area").innerHTML=str;
  COM_FUNC.reset_counter(N);
};

// Reset the text counter.
COM_FUNC.reset_counter = function(c) {
  document.getElementById("sentence_counter").textContent = c;
};

// Set the font used for the example sentences, depending on 
// the language of them.
COM_FUNC.set_font = function(lang_name) {
  document.getElementById("output_area").lang = lang_name;
};

// A somewhat general filter applicable to multiple languages.
// Constrain the length of sentences, which is counted by the number 
// of characters.
// This is suitable for the Chinese or Japanese text, which are written 
// without white space characters between words.
COM_FUNC.constrain_char_len = function() {
  var min_len=parseInt(document.f.min_char_len.value);
  var max_len=parseInt(document.f.max_char_len.value);
  for (var i = 0, N = DAT.sentences.length, str = "", c = 0; i < N; i++) {
    var L=DAT.sentences[i].length;
    if (min_len <= L && L <= max_len) {
        str += (DAT.id_tags[i] + DAT.sentences[i] + "\n");
        c++;
    }
  }
  document.getElementById("output_area").innerHTML=str;
  COM_FUNC.reset_counter(c);
};

// A wrapper function that is called in order to apply a language-
// specific filter.
COM_FUNC.call_filter_of = function(filter_set_name) {
  var op_list = document.getElementById(filter_set_name);
  var filter_name = op_list.options[op_list.selectedIndex].value;
  for (var i = 0, N = DAT.sentences.length, str = "", c = 0; i < N; i++) {
    var check_sentence_result = eval(filter_name + "(" + i + ")" );
    if (check_sentence_result !== DAT.sentences[i]) {
        str += (DAT.id_tags[i] + check_sentence_result + "\n");
        c++;
    }
  }
  document.getElementById("output_area").innerHTML=str;
  COM_FUNC.reset_counter(c);
};

// Switch the user interface (UI) language.
COM_FUNC.set_UI_lang = function(lang_code) {
  var i, j, Ni, Nj, attName;
  attName = 'data-' + lang_code + '-value';
  // for the text in <span class="ui" ...> tags
  var UI_text_blocks = document.getElementsByClassName('ui');
  for (i = 0, Ni = UI_text_blocks.length; i < Ni; i++) {
    if (UI_text_blocks[i].getAttribute('lang') == lang_code) {
      UI_text_blocks[i].style.display = 'inline';
    } else {
      UI_text_blocks[i].style.display = 'none';
    }
  }
  // for the text displayed on <input type="button" ...>
  var buttons = document.getElementsByTagName('input');
  for (i = 0, Ni = buttons.length; i < Ni; i++) {
    if (buttons[i].getAttribute('type') == 'button') {
      if (buttons[i].hasAttribute(attName)) {
        buttons[i].value = buttons[i].getAttribute(attName);
      }
    }
  }
  // for the text in <option> tags
  var selectors = document.getElementsByTagName('select');
  for (i = 0, Ni = selectors.length; i < Ni; i++) {
    for (j = 0, Nj = selectors[i].options.length; j < Nj; j++) {
      var op = selectors[i].options[j];
      if (op.hasAttribute(attName)) {
        op.textContent = op.getAttribute(attName);
      }
    }
  }
};

// Switch between the hidden state and the displayed state of 
// the language-specific filters included in <div> tag identified by divID.
COM_FUNC.hide_or_display = function(divID) {
  if (document.getElementById(divID).style.display=='none') {
    document.getElementById(divID).style.display='block';
  } else {
    document.getElementById(divID).style.display='none';
  }
};

