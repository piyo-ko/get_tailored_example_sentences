#!/usr/local/bin/perl

use strict;
use warnings;
use utf8;

# Convert $word_str into lowercase and strip punctuation signs, in order to
# compare the word represented by $word_str with the normal form of a word.
sub to_lowercase {
  my ($word_str) = @_;

  my $uppercase_alphabet = 
    'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
  my $lowercase_alphabet = 
    'абвгдежзийклмнопрстуфхцчшщъыьэюя';

  eval "\$word_str =~ tr/$uppercase_alphabet/$lowercase_alphabet/";

  if ($word_str =~ /^["'«—…]*([$lowercase_alphabet]*)[.;:?!'",»—…]*$/) {
    $word_str = $1;
  }
  return($word_str);
}
1;
