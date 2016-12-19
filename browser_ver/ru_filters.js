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
  res = res.replace(/^[\"\'«—]*([абвгдежзийклмнопрстуфхцчшщъыьэюя]+)[\.\;\:\?\!\"\',»—]*$/, "$1");
  //console.log(word_str + " / " + res);
  return(res);
},

// Return the string corresponding to DAT.sentences[idx] where 
// the selected words are highlighted by <em> tags.  Note that
// target_word_group is the id attribute of an element which contains
// checkboxes used to select the target words to be highlighted.
// Only the words that *exactly* (but in the case-insensitive way) match 
// one of the target words are highlighted.  Partial match is ignored.
check_exact_match : function(idx, target_word_group) {
  const words = DAT.sentences[idx].split(/[\s+]/);
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

// Return the string corresponding to DAT.sentences[idx] where 
// the selected pronouns are highlighted by <em> tags.
/*pronouns : function(idx) {
  const words = DAT.sentences[idx].split(/\s+/);
  const selected_pronouns = COM_FUNC.get_checked_values('ru_pronouns');
  var str = "";
  for (var i = 0, L = words.length; i < L; i++) {
    if (selected_pronouns.includes(this.to_lowercase(words[i]))) {
      str += " <em>" + words[i] + "</em>";
    } else {
      str += " " + words[i];
    }
  }
  return(str);
}*/
pronouns: function(idx) {
  return(this.check_exact_match(idx, 'ru_pronouns'));
}

}; // end of the declaration of the global Object named RU

