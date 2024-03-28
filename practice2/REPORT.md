# Practice #2

### _Analysis and Processing of Digital Signals_

## Objective

To familiarize with the fundamental methods of analyzing and processing
digital signals, focusing on generating signals and noise, and their processing using
low-pass filters (LPF).

## Conclusion

## Results Summary for windows size of MA Filter from 1 till 20:

- MSE for window size 0: 0.624999999999999
- MSE for window size 1: 0.33789037759785295
- MSE for window size 2: 0.17330933149251282
- MSE for window size 3: 0.117790186449086
- MSE for window size 4: 0.09764618757552151
- MSE for window size 5: 0.08415473879595722
- MSE for window size 6: 0.08839308412518941
- MSE for window size 7: 0.0865931243621953
- MSE for window size 8: 0.1027388338920552
- MSE for window size 9: 0.10639120996408322
- MSE for window size 10: 0.13101671392175884
- MSE for window size 11: 0.13814252917305841
- MSE for window size 12: 0.1693228540403724
- MSE for window size 13: 0.1788383524256743
- MSE for window size 14: 0.21544497672475568
- MSE for window size 15: 0.2268118967732596
- MSE for window size 16: 0.2678169233358978
- MSE for window size 17: 0.2804687873830105
- MSE for window size 18: 0.3248707646558711
- MSE for window size 19: 0.3384113849710775

<br/><br/>

Reducing the window size of MA Filter causes to reducing of attenuation of the noise. Hence, efficiency of the filter is far less, stop-band attenuation becomes huge.
<br/><br/>
High value of MA Filter leads to higher noise reduction, but we also begin to cut our signal frequencies.
filter becomes more efficient with high values,but we need to find the optimal value for the window size, so that not to distort the signal, becaus due to LPF filter we can loss high frequencies of the signal while attenuating the noise.
<br/>
As we can see the least value of our evaluation is 0.0841, which has been obtained by setting win size to 5. From this value evaluation starts to increase, so the other values aren't optimal.
