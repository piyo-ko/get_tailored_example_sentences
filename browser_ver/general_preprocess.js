"use strict";

// a global Object to hold IDs and sentences read from a specified file,
// as well as holding auxiliary data.
var DAT = {
  // sentence IDs, each with a <span> tag and a tab character
  id_tags : [],
  // sentences included in a specified file
  sentences : [],
  // is_selected[i] is true if sentences[i] has been selected, by a filter, 
  // as an element of a potential base subset which may be used as a base of
  // a narrowing down operation to be done by another filter.
  is_selected : [],
  // If type_of_base_subset as defined below is 'pattern_specified' and 
  // is_selected[i] is true, then displayed_sentences[i] is a string that
  // corresponds to sentences[i] and includes an <em> tag; otherwise,
  // is_selected[i] is an empty string.  
  displayed_sentences : [],
  // the type of the potential base subset ('none', 'length_limited', or 
  // 'pattern_specified')
  type_of_base_subset: 'none',
  // Once the number of words/characters of sentences[i] has been counted, 
  // it will be recorded for the later use.
  num_of_words : [],
  num_of_chars : [],
  num_of_words_has_been_counted : false,
  num_of_chars_has_been_counted : false, 
  // When a new file is specified to be read, reset_all() should be executed.
  reset_all : function () {
    this.id_tags = [];
    this.sentences = [];
    this.is_selected = [];
    this.displayed_sentences = [];
    this.type_of_base_subset = 'none';
    this.num_of_words = [];
    this.num_of_chars = [];
    this.num_of_words_has_been_counted = false;
    this.num_of_chars_has_been_counted = false;
  }
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
  DAT.reset_all();
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

// Re-set the text counter.
COM_FUNC.reset_counter = function(c) {
  document.getElementById("sentence_counter").textContent = c;
};

// Set the font used for the example sentences, depending on 
// the language of them.  Note that filter_page.css defines some language-
// dependent fonts.
COM_FUNC.set_font = function(lang_name) {
  document.getElementById("output_area").lang = lang_name;
};

// A somewhat general filter applicable to multiple languages.
// Constrain the length of sentences, which is counted by the number 
// of characters.
// This is suitable for Chinese or Japanese text, which are written 
// without whitespace characters between words.
COM_FUNC.constrain_num_of_chars = function() {
  var base_type = document.f.base_set.value;
  var min_len=parseInt(document.f.min_chars.value);
  var max_len=parseInt(document.f.max_chars.value);
  var i, N, L, str, c;
  N = DAT.sentences.length;
  str = "";
  c = 0;
  if (base_type == 'whole' || base_type == 'len_lim') {
    // In this case, the potential base subset is to be newly set.
    DAT.type_of_base_subset = 'length_limited';
    
    // ここから先、if と for の入れ子の順をどうするか、比較中。
    // 意味的にはどっちでもいいんだが、読みやすさと速さの問題。
    // トレードオフかな? でも大して変わらないような気もする。
    if (DAT.num_of_chars_has_been_counted) {
      for (i = 0; i < N; i++) {
        L = DAT.num_of_chars[i];
        if (min_len <= L && L <= max_len) {
          str += (DAT.id_tags[i] + DAT.sentences[i] + "\n");
          c++;
          DAT.is_selected[i] = true;
        } else {
          DAT.is_selected[i] = false;
        }
        DAT.displayed_sentences[i] = '';
      }
    } else { // DAT.num_of_chars_has_been_counted is false
      for (i = 0; i < N; i++) {
        L = DAT.sentences[i].length;
        if (min_len <= L && L <= max_len) {
          str += (DAT.id_tags[i] + DAT.sentences[i] + "\n");
          c++;
          DAT.is_selected[i] = true;
        } else {
          DAT.is_selected[i] = false;
        }
        DAT.displayed_sentences[i] = '';
      }
      DAT.num_of_chars_has_been_counted = true;
    }




    for (i = 0; i < N; i++) {
      if (DAT.num_of_chars_has_been_counted) {
        L = DAT.num_of_chars[i];
      } else {
        L = DAT.sentences[i].length;
        DAT.num_of_chars[i] = L;
      }
      if (min_len <= L && L <= max_len) {
        str += (DAT.id_tags[i] + DAT.sentences[i] + "\n");
        c++;
        DAT.is_selected[i] = true;
      } else {
        DAT.is_selected[i] = false;
      }
      DAT.displayed_sentences[i] = '';
    }
    DAT.num_of_chars_has_been_counted = true;



  } else if (base_type == 'specific_pattern') {
    // In this case, the potential base subset should not be changed.
    
  } else {
    alert("Oops! An error occurred at COM_FUNC.constrain_num_of_chars.");
  }
  document.getElementById("output_area").innerHTML=str;
  COM_FUNC.reset_counter(c);
};

// A similar general filter applicable to multiple languages.
// Constrain the length of sentences, which is counted by the number 
// of words.
// This is suitable for Russian, English, Germany, etc., which are written 
// with whitespace characters between words.
COM_FUNC.constrain_num_of_words = function() {
  var min_len = parseInt(document.f.min_words.value);
  var max_len = parseInt(document.f.max_words.value);
  for (var i = 0, N = DAT.sentences.length, str = "", c = 0; i < N; i++) {
    var w = DAT.sentences[i].split(/[—\-\s]+/);
    for (var j = 0, L = w.length; j < L; j++) {
      if (w[j] == "") { L--; }
    }
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

