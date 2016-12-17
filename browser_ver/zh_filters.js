/*「是〜的」構文の例文を抽出したい。
この構文とは無関係な「的」が、「但是」の後に出現する場合があるので、それを
除外。「可是」「還是」あたりをどう考えるかは要検討。
まあ、それでも無関係な「的」は多いので、あくまでもこれは粗いスクリーニング。
*/
function ZH_shi_de(idx) {
  //console.log("shi_de() is called.");
  var res, RE;
  var sent=sentences[idx];

  RE = /[^但]是.+的/;
  if (RE.test(sent)) {
    res = sent.replace(/(是[^是的]+的)/g, "<em>$1</em>");
    return(res);
  } else {
    res = sent.replace(/^(是[^是的]+的)/g, "<em>$1</em>");
    return(res);
  }
}

/*「又〜又〜」の例文を抽出したい。*/
function ZH_you_you(idx) {
  return(sentences[idx].replace(/(又.{1,2}又.{1,2})/g, "<em>$1</em>"));
}

/*「越〜越〜」の例文を抽出したい。*/
function ZH_yue_yue(idx) {
  return(sentences[idx].replace(/(越.+越.)/g, "<em>$1</em>"));
}

/*数の入っている例文を抽出したい。*/
function ZH_numerical(idx) {
  return(sentences[idx].replace(/([零〇一二三四五六七八九十百千万亿億兆]+.)/g, "<em>$1</em>"));
}

/*反復疑問 (「A不A」または「有没有」もしくは「有沒有」) */
function ZH_repetitive_question(idx) {
  var res = sentences[idx].replace(/((.{1,2})不\2)/g, "<em>$1</em>");
  return(res.replace(/(有[没沒]有)/g, "<em>$1</em>"));
}

/*受け身*/
function ZH_passive(idx) {
  return(sentences[idx].replace(/([被叫让譲讓])/g, "<em>$1</em>"));
}

/*「了」*/
function ZH_le(idx)  {
  return(sentences[idx].replace(/(了)/g, "<em>$1</em>"));
}
