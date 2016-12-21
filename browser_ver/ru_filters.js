// creating a quasi-namespace for Russian-specific filters, 
// by using an Object named RU
var RU = {
// Cyrillic alphabet
uppercase_alphabet : 
  'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ',
lowercase_alphabet : 
  'абвгдежзийклмнопрстуфхцчшщъыьэюя',

// Convert word_str into lowercase and strip punctuation signs, in order to
// compare the word represented by word_str with the normal form of a word.
to_lowercase : function(word_str) {
  var res = word_str;
  var N = this.uppercase_alphabet.length;
  for (var i = 0; i < N; i++) {
    res = res.replace(this.uppercase_alphabet[i], this.lowercase_alphabet[i]);
  }
  res = res.replace(/^[\"\'«—…]*([абвгдежзийклмнопрстуфхцчшщъыьэюя]*)[\.\;\:\?\!\"\',»—…]*$/, "$1");
  return(res);
},

// Return the string corresponding to DAT.sentences[idx] where 
// the selected words are highlighted by <em> tags.  Note that
// target_word_group is the id attribute of an element which contains
// checkboxes used to select the target words to be highlighted.
// Only the words that *exactly* (but in the case-insensitive way) match 
// one of the target words are highlighted.  Partial match is ignored.
check_exact_match : function(idx, target_word_group) {
  const words = DAT.sentences[idx].split(/\s+/);
  const selected_targets = COM_FUNC.get_checked_values(target_word_group);
  var str = "";
  for (var i = 0, L = words.length; i < L; i++) {
    if (selected_targets.includes(this.to_lowercase(words[i]))) {
      str += " <em>" + words[i] + "</em>";
    } else {
      str += " " + words[i];
    }
  }
  return(str);
},

check_affix : function(idx, target_affix_group, prefix_or_suffix) {
  const words = DAT.sentences[idx].split(/\s+/);
  const selected_affixes = COM_FUNC.get_checked_values(target_affix_group);
  var str = "";
  var REs = [];
  // creating regular expression patterns, each including each affix
  for (var j = 0, S = selected_affixes.length; j < S; j++) {
    if (prefix_or_suffix) {
      RE[j] = new RegExp('^' + selected_affixes[j]);
    } else {
      RE[j] = new RegExp(selected_affixes[j] + '$');
    }
  }
  // checking for each word of DAT.sentences[idx]
  for (var i = 0, L = words.length; i < L; i++) {
    for (j = 0, S = selected_affixes.length; j < S; j++) {
      if (RE[j].test(words[i])) { // if words[i] match the j-th affix ...
        str += " <em>" + words[i] + "</em>";
        break;
      }
    }
    if (j==S) { // if words[i] does not match any affix ...
      str += " " + words[i];
    }
  }
  return(str);
},

// Return the string corresponding to DAT.sentences[idx] where 
// the selected pronouns are highlighted by <em> tags.
pronouns: function(idx) {
  return(this.check_exact_match(idx, 'ru_pronouns'));
},

/*
// 文の数が多いと固まるのでやめた方がよい。
wiktionary_link: function() {
  document.getElementById("output_area").innerHTML="";
  for (var i = 0, N = DAT.sentences.length; i < N; i++) {
    var words = DAT.sentences[i].split(/\s+/);
    var str = "";
    for (var j = 0, L = words.length; j < L; j++) {
      var dict_form = this.to_lowercase(words[j]);
      if (dict_form == "") {
        str += " " + words[j];
      } else {
        str += " <a href=\"https://en.wiktionary.org/wiki/" + encodeURIComponent(dict_form) + "#Russian\" class=\"dict\" target=\"_wikt\">" + words[j] + "</a>";
      }
    }
    document.getElementById("output_area").innerHTML += (DAT.id_tags[i] + str + "\n");
  }
}
*/

}; // end of the declaration of the global Object named RU

