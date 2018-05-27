#!/usr/bin/env bash

if [ $# = 0 ]
then
    echo 'Usage ./instructor-scripts/copy-file.sh file1 file2 ...'
    echo 'For example: ./instructor-scripts/copy-file.sh main.js index.html'
fi

projectdir=$(git rev-parse --show-toplevel)
solutiondirs=("$projectdir"/solutions/*)

for file in "$@"
do
    for dir in "${solutiondirs[@]}"
    do
        cp "$file" "$dir"
        echo Ran: cp "$file" "$dir"
    done
done