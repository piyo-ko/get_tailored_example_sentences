#!/usr/local/bin/perl

#
# This script is intended to be used for Chinese or Japanese text, which are
# written without white space characters between words.  The purpose of this
# script is to filter out too short sentences (which, in most cases, are 
# too simple to learn) and/or too long sentences (which, in most cases, are 
# too difficult to learn).
#
# 単語間に空白を置かない言語 (中国語、日本語など) 向け。短すぎたり長すぎたり
# する文 (簡単すぎたり難しすぎたりして、現状の学習レベルでの例文に向かない
# もの) を取り除くことが目的のフィルタ。文の長さとして文字列長を使う。
#
# Usage: ./constrain_char_len.pl [-min minimum_length] [-max maximum_length] < input.txt > output.txt
#
# input.txt should consist of lines each containing a tag, a tab character, 
# and a sentence. 

use strict;
use warnings;
use utf8;
binmode STDIN,  ":utf8";
binmode STDOUT, ":utf8";
binmode STDERR, ":utf8";

my $min_len = 1;
my $max_len = -1;

# check options
my $a=0;
my $err_msg = "Usage: ./constrain_char_len.pl [-min minimum_length] [-max maximum_length] < input.txt > output.txt\n";
if ($#ARGV != 1 && $#ARGV != 3) {
  die "[# of ARGV is $#ARGV]... $err_msg";
}
while ($a < $#ARGV) {
  if ($ARGV[$a] eq '-min') {
    $min_len = $ARGV[++$a];
    $a++;
    next;
  }
  if ($ARGV[$a] eq '-max') {
    $max_len = $ARGV[++$a];
    $a++;
    next;
  }
  die $err_msg;
}

while(<STDIN>) {
  if (/^(.+)\t(.+)$/) {
    my $tag = $1;
    my $sent = $2;
    my $len = length($sent);
    if ($len < $min_len) {
      next;
    }
    if (0 < $max_len && $max_len < $len) {
      next;
    }
    print STDOUT "$tag\t$sent\n";
  } else {
    print STDERR "Unexpected format: $_";
  }
}

