#!/usr/local/bin/perl

# Usage: ./split_into_sentences_02.pl [-e characters_at_EoS] [-s characters_at_SoS] < input.txt > output.txt
# 


use strict;
use warnings;
use utf8;
binmode STDIN,  ":utf8";
binmode STDOUT, ":utf8";
binmode STDERR, ":utf8";

# the default set of characters that indicate the end of a sentence.
my $chars_at_EoS = '.;:?!"»';
# the default set of characters that explicitly indicate the start of 
# a sentence.  Note that sentences may start with other ordinary characters.
my $chars_at_SoS = '—"«';

# check options
my $err_msg = "Usage: ./split_into_sentences_02.pl [-e characters_at_EoS] [-s characters_at_SoS] < input.txt > output.txt\n";
my $a=0;
while ($a < $#ARGV) {
  if ($ARGV[$a] eq '-e') {
    $chars_at_EoS = $ARGV[++$a];
    $a++;
    next;
  }
  if ($ARGV[$a] eq '-s') {
    $chars_at_SoS = $ARGV[++$a];
    $a++;
    next;
  }
  die $err_msg;
}

while(<STDIN>) {
  chomp;
  my @words = split(/\s+/, $_);
  # a flag set to be 1 if the next word should be the head of 
  # the next sentence.
  my $head_of_sentence = 1;
  my $i=0;
  while ($i<=$#words) {
    if ($words[$i] =~ /^[$chars_at_SoS]/) {
      if (!$head_of_sentence) {
        print STDOUT "\n";
        $head_of_sentence = 1;
      }
    }
    if (!$head_of_sentence) {
      print STDOUT " ";
    }
    print STDOUT $words[$i];
    $head_of_sentence = 0;
    if ($words[$i] =~ /^.+[$chars_at_EoS]$/) {
      print STDOUT "\n";
      $head_of_sentence = 1;
    }
    $i++;
  }
}

