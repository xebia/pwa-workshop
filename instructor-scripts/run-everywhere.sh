#!/usr/bin/env bash
clear

function resolve_dir {
    (cd "$1" && pwd)
}

function run_in_dir {
    echo running
    local dir="$1"
    shift
    (cd "$dir" && "$@")

}

scriptdir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

projectdir=$(resolve_dir "$scriptdir"/..)

solutiondirs=("$projectdir"/solutions/*)

for dir in "$projectdir" "${solutiondirs[@]}"
do
    run_in_dir "$dir" "$@"
done
