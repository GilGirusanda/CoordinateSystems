# Practice #2

### _Analysis and Processing of Digital Signals_

## Objective

To familiarize with the fundamental methods of analyzing and processing
digital signals, focusing on generating signals and noise, and their processing using
low-pass filters (LPF).

## Conclusion

## Results Summary for windows size of MA Filter from 1 till 20:

- MSE for window size 0: 0.9710911521165326
- MSE for window size 1: 0
- MSE for window size 2: 0.5021125740242247
- MSE for window size 3: 0.44906185516608393
- MSE for window size 4: 0.43015297366893646
- MSE for window size 5: 0.41960930676044095
- MSE for window size 6: 0.42656666068133475
- MSE for window size 7: 0.4256823428134236
- MSE for window size 8: 0.44307395434091806
- MSE for window size 9: 0.44790472919075236
- MSE for window size 10: 0.4715144199593756
- MSE for window size 11: 0.47899984361489023
- MSE for window size 12: 0.5111809659720096
- MSE for window size 13: 0.5212236958918558
- MSE for window size 14: 0.560333133846591
- MSE for window size 15: 0.5720110020297591
- MSE for window size 16: 0.6142808957994075
- MSE for window size 17: 0.6267014618054143
- MSE for window size 18: 0.6718895172725348
- MSE for window size 19: 0.6855775119027617

<br/><br/>

Reducing the window size of MA Filter causes to reducing of attenuation of the noise. Hence, efficiency of the filter is far less, stop-band attenuation becomes huge.
<br/>
High value of MA Filter leads to higher noise reduction, but we also begin to cut our signal frequencies.
filter becomes more efficient with high values,but we need to find the optimal value for the window size, so that not to distort the signal, becaus due to LPF filter we can loss high frequencies of the signal while attenuating the noise.
<br/>
As we can see the least value of our evaluation is 0.4196, which has been obtained by setting win size to 5. From this value evaluation starts to increase, so the other values aren't optimal.
