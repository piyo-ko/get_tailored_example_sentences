var RU = {
uppercase_alphabet : 
  'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ',
lowercase_alphabet : 
  'абвгдежзийклмнопрстуфхцчшщъыьэюя',

to_lowercase : function(word_str) {
  var res = word_str;
  var N = this.uppercase_alphabet.length;
  for (var i = 0; i < N; i++) {
    res = res.replace(this.uppercase_alphabet[i], this.lowercase_alphabet[i]);
  }
  return(res);
},

pronouns : function(idx) {
  const words = DAT.sentences[idx].split(/\s+/);
  const selected_pronouns = COM_FUNC.get_checked_values('ru_pronouns');
  var str = "";
  var found = false;
  for (var i = 0, L = words.length; i < L; i++) {
    if (selected_pronouns.includes(this.to_lowercase(words[i]))) {
      str += " <em>" + words[i] + "</em>";
      found = true;
    } else {
      str += " " + words[i];
    }
  }

}

}; // end of the declaration of the global Object named RU

