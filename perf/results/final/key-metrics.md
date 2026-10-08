# Kluczowe metryki: old / new

Mediany; w komórkach UI: **old / new**. Konfiguracja: sieć none, CPU ×1. „—” = brak udanego pomiaru (np. old przy N = 10 000: lista nie wyrenderowała się w limicie czasu). p95 i liczba przebiegów: key-metrics.csv, pełne statystyki: summary.csv / api-summary.csv.

| metryka | N = 100 | N = 1000 | N = 3000 | N = 5000 | N = 10 000 |
|---|---:|---:|---:|---:|---:|
| Wejście: pierwszy wiersz [s] | 0,49 / 0,57 | 2,41 / 0,58 | 6,82 / 0,57 | 11,14 / 0,57 | — / 0,57 |
| Wejście: lista gotowa [s] | 0,49 / 0,57 | 2,41 / 0,58 | 8,14 / 0,57 | 13,56 / 0,57 | — / 0,57 |
| Wejście: Total Blocking Time [ms] | 18 / 17 | 147 / 19 | 1431 / 15 | 2717 / 15 | — / 16 |
| Wejście: sterta JS [MB] | 17,1 / 11,5 | 50,0 / 11,6 | 229,5 / 11,5 | 498,6 / 11,5 | — / 11,6 |
| Wejście: węzły DOM [szt.] | 4859 / 786 | 45 652 / 801 | 137 204 / 791 | 229 087 / 796 | — / 796 |
| Wejście: transfer API [kB] | 77,5 / 15,4 | 754,9 / 15,3 | 4541,5 / 15,4 | 7591,0 / 15,3 | — / 15,3 |
| Zmiana filtra [ms] | 18 / 80 | 69 / 80 | 223 / 77 | 352 / 74 | — / 72 |
| Zmiana sortowania [ms] | 31 / 80 | 391 / 81 | 1770 / 83 | 4849 / 85 | — / 87 |
| Przewinięcie do 60. wiersza [s] | 0,79 / 0,92 | 0,77 / 0,91 | 0,77 / 0,90 | 0,82 / 0,93 | — / 0,99 |
| Przewinięcie do końca listy [s] | 0,3 / 0,8 | 3,4 / 8,9 | 10,1 / 27,0 | 17,6 / 44,2 | — / 91,1 |
| Do końca listy: transfer API [MB] | 0,00 / 0,06 | 0,00 / 0,68 | 0,00 / 2,09 | 0,00 / 3,51 | — / 7,02 |
| Do końca listy: żądania API [szt.] | 0 / 4 | 0 / 45 | 0 / 137 | 0 / 230 | — / 459 |
| API: cała lista (old) [ms] | 220 | 1944 | 5795 | 9718 | 18 963 |
| API: 1. strona (new) [ms] | 48 | 48 | 45 | 46 | 44 |
| API: ostatnia pełna strona (new) [ms] | 46 | 46 | 43 | 47 | 44 |
| API: wszystkie strony (new) [ms] | 231 | 2158 | 6395 | 10 441 | 20 829 |
| API: rozmiar całej listy (old) [kB] | 77 | 754 | 2267 | 3790 | 7569 |
| API: rozmiar strony (new) [kB] | 15,1 | 15,0 | 15,1 | 15,0 | 15,0 |
