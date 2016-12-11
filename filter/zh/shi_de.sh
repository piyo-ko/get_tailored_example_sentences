#!/bin/sh

# 「是〜的」構文の例文を抽出したい。

# この構文とは無関係な「的」が、「但是」の後に出現する場合があるので、それを
# 除外。「可是」「還是」あたりをどう考えるかは要検討。
# まあ、それでも無関係な「的」は多いので、あくまでもこれは粗いスクリーニング。

grep -v '但是' $1 | grep --color=auto "是.\+的"

# 以下でも良いかもしれない。「但是」と「是〜的」の双方を含む長めの文も掬える。
# (ただ色は最長一致でつけられてしまう。)
#grep "[^但]是.*的" $1 | grep --color=auto "是.\+的"
