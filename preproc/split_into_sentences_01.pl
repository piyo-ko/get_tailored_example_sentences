#!/usr/local/bin/perl

#
# This script is intended to be used for Chinese or Japanese text.
#
# Usage: ./split_into_sentences_01.pl [-e characters_at_EoS] [-i characters_to_be_ignored] < input.txt > output.txt
# 

use strict;
use warnings;
use utf8;
use Encode 'decode', 'encode';

# default settings for 
#  * characters to be located at the end of a sentence; and
#  * characters to be ignored
my $specified_chars_at_EoS = '。．？！；：';
my $specified_chars_to_be_ignored = '　「」“”『』';

# check options
my $err_msg = "Usage: ./split_into_sentences_01.pl [-e characters_at_EoS] [-i characters_to_be_ignored] < input.txt > output.txt\n";
if ($#ARGV == -1) {
  # use default settings
} elsif ($#ARGV == 1) {
  if ($ARGV[0] eq '-e') {
    $specified_chars_at_EoS = $ARGV[1];
  } elsif ($ARGV[0] eq '-i') {
    $specified_chars_to_be_ignored = $ARGV[1];
  } else {
    die $err_msg;
  }
} elsif ($#ARGV == 3) {
  if ($ARGV[0] eq '-e' && $ARGV[2] eq '-i') {
    $specified_chars_at_EoS = $ARGV[1];
    $specified_chars_to_be_ignored = $ARGV[3];
  } elsif ($ARGV[0] eq '-i' && $ARGV[2] eq '-e') {
    $specified_chars_to_be_ignored = $ARGV[1];
    $specified_chars_at_EoS = $ARGV[3];
  } else {
    die $err_msg;
  }
} else {
  die $err_msg;
}

# set characters to be located at the end of a sentence
#my @chars_at_EoS = split(//, $specified_chars_at_EoS);
# set characters to be ignored
#my @chars_to_be_ignored = split(//, $specified_chars_to_be_ignored);
# set the next sentence ID number
my $sentenceNo=1;

=pod
while(<STDIN>) {
  chomp;
  my @sentences = split(/[$specified_chars_at_EoS]/, decode('utf-8', $_));
  foreach my $s (@sentences) {
    $s =~ s/^[$specified_chars_to_be_ignored]*(.+)[$specified_chars_to_be_ignored]*$/$1/;
    my $id = sprintf("%06d", $sentenceNo++);
    print STDOUT encode('utf-8', "$id\t$s\n");
  }
}
=cut

while(<STDIN>) {
  chomp;
  my @chars = split(//, decode('utf-8', $_));
  my $sentence = '';
  my $i=0;
  while ($i<=$#chars) {
    if ($specified_chars_to_be_ignored =~ /$chars[$i]/) {
      $i++;
      next;
    } elsif ($specified_chars_at_EoS =~ /$chars[$i]/) {
      my $id = sprintf("%06d", $sentenceNo++);
      print STDOUT encode('utf-8', "$id\t$sentence$chars[$i]\n");
      $sentence = '';  # re-initialization
      $i++;
      next;
    } else {
      $sentence .= $chars[$i];
      $i++;
      next;
    }
  }
}

#「出力から除く=無視する」かどうか、ではなくて、「(他の文の中に引用されて埋め込まれた文の文頭も含めて)文頭になり得る」かどうか、と、「文末になり得るかどうか」をチェックすべきかも。文末符号の連続はあり得るから（句点と鉤括弧）、次の文頭で前の文を出力すべき。
#あと、文への分割スクリプトとナンバリングスクリプトは分けるべき(分ければ、間に手作業による修正を挟みたい場合に挟むことが可能となるから)。
