#!/bin/bash

set -e

host="$1"
shift
cmd="$@"

until nc -z "$host" 1433; do
  >&2 echo "Baza danych nie jest jeszcze dostępna - czekam"
  sleep 1
done

>&2 echo "Baza danych jest gotowa - uruchamiam aplikację"
exec $cmd
