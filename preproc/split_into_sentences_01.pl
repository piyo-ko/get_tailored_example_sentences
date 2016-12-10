#!/usr/local/bin/perl

#
# This script is intended to be used for Chinese or Japanese text.
#
# Usage: ./split_into_sentences_01.pl [-e characters_at_EoS] [-s characters_at_SoS] [-i characters_to_be_ignored] < input.txt > output.txt
# 

use strict;
use warnings;
use utf8;
binmode STDIN,  ":utf8";
binmode STDOUT, ":utf8";
binmode STDERR, ":utf8";

# the default set of characters that indicate the end of a sentence.
my $chars_at_EoS = '。．？！；：」』”';
# the default set of characters that explicitly indicate the start of 
# a sentence.  Note that sentences may start with other ordinary characters.
my $chars_at_SoS = '「『“';
# the default set of character(s) that should be ignored and omitted.
my $chars_to_be_ignored = '　';

# check options
my $err_msg = "Usage: ./split_into_sentences_01.pl [-e characters_at_EoS] [-s characters_at_SoS] [-i characters_to_be_ignored] < input.txt > output.txt\n";
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
  if ($ARGV[$a] eq '-i') {
    $chars_to_be_ignored = $ARGV[++$a];
    $a++;
    next;
  }
  die $err_msg;
}

while(<STDIN>) {
  chomp;
  my @chars = split(//, $_);
  my $sentence = '';
  my $ready_to_output = 0;
  my $i=0;
  while ($i<=$#chars) {
    # If $chars[$i] belongs to $chars_to_be_ignored, ignore this $chars[$i].
    if ($chars_to_be_ignored =~ /$chars[$i]/) {
      $i++;
      next;
    }
    # When encountering the special characters that can appear, in most cases, 
    # only at the start of sentences, 
    elsif ($chars_at_SoS =~ /$chars[$i]/) {
      # output the previous sentence (if it exists) 
      if ($sentence ne '') {
        print STDOUT "$sentence\n";
      }
      # and then initialize the variables again for the next sentence.
      $sentence = $chars[$i];
      $ready_to_output = 0;
      $i++;
      next;
    }
    # When encountering the special characters that indicates the end of 
    # the current sentence,
    elsif ($chars_at_EoS =~ /$chars[$i]/) {
      # append this $chars[$i] to $sentence and 
      $sentence .= $chars[$i];
      # set the flag $ready_to_output ON.
      $ready_to_output = 1;
      $i++;
      next;
      # Note that a sentence may end with a series of two or more such special
      # characters indicating the end of sentence.  For example, a sentence 
      # may end with '？」'.  Thus, $sentence is not output now but it will 
      # be output later.
    } 
    # When encountering an ordinary character, which may appear at the start
    # of a sentence or may appear in the middle of a sentence, 
    else {
      # first check whether there is a sentence to be output right now, and
      # if so, output it and re-initialize the variables,
      if ($ready_to_output == 1) {
        print STDOUT "$sentence\n";
        $sentence = '';
        $ready_to_output = 0;
      }
      # and in any case, append the current $chars[$i] to $sentence.
      $sentence .= $chars[$i];
      $i++;
      next;
    }
  }
  # If there remains a sentence that is not output yet, output it.
  if ($sentence ne '') {
    print STDOUT "$sentence\n";
  }
}
