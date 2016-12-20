#!/usr/local/bin/perl

# Usage: ./make_links_to_dict.pl.pl < ../data/Russian_text_with_tag-separated_IDs.txt > ../data/Russian_text_with_links_to_Wiktionary.html

use strict;
use warnings;
use utf8;
use URI::Escape;
require 'ru_to_lowercase.pl';

binmode STDIN,  ":utf8";
binmode STDOUT, ":utf8";
binmode STDERR, ":utf8";

print STDOUT <<'HTML_OUT';
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="../browser_ver/filter_page.css" type="text/css">
<base href="https://en.wiktionary.org/wiki/" target="_wict">
<title>Russian text with links to Wiktionary</title>
</head>
<body>
<ul>
HTML_OUT

while(<STDIN>) {
  chomp;
  my ($tag, $sentence);
  if (/^(.+)\t(.+)$/) {
    $tag = $1;
    $sentence = $2;
  } else {
    next;
  }
  print STDOUT "<li><span class=\"tag\">$tag</span>\t";
  my @words = split(/\s+/, $sentence);
  my ($j, $L, $dict_form);
  $L = $#words;
  for ($j = 0; $j <= $L; $j++) {
    $dict_form = to_lowercase($words[$j]);
    if ($dict_form eq '') {
        print STDOUT " $words[$j]";
    } else {
      print STDOUT " <a href=\"";
      print STDOUT uri_escape_utf8($dict_form);
      print STDOUT "#Russian\" class=\"dict\">$words[$j]</a>";
    }
  }
  print STDOUT "</li>\n";
}

print STDOUT "</ul>\n</body>\n</html>\n";
