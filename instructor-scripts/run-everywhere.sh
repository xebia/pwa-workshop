#!/usr/bin/env bash
function run_in_dir {
    echo running
    local dir="$1"
    shift
    (cd "$dir" && "$@")

}

projectdir=$(git rev-parse --show-toplevel)

solutiondirs=("$projectdir"/solutions/*)

for dir in "$projectdir" "${solutiondirs[@]}"
do
    run_in_dir "$dir" "$@"
done
