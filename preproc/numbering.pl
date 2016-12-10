#!/usr/local/bin/perl

# Usage: ./numbering.pl [-p prefix] [-s starting_number] < input.txt > output.txt
#
# input.txt should consist of lines each representing one sentence (or clause).

use strict;
use warnings;
use utf8;
binmode STDIN,  ":utf8";
binmode STDOUT, ":utf8";
binmode STDERR, ":utf8";

# default setting for the prefix
my $prefix='';
# default setting for the starting number
my $num=1;

# check options
my $a=0;
while ($a < $#ARGV) {
  if ($ARGV[$a] eq '-p') {
    $prefix = $ARGV[++$a];
    $a++;
    next;
  }
  if ($ARGV[$a] eq '-s') {
    $num = $ARGV[++$a];
    $a++;
    next;
  }
  die "Usage: ./numbering.pl [-p prefix] [-s starting_number] < input.txt > output.txt\n";
}

while(<STDIN>) {
  print STDOUT ("$prefix" . sprintf("%06d", $num++) . "\t" . $_);
}
