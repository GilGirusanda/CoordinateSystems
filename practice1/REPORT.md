# Practice #1

### _Comparison of Computational Complexity in Calculating Distances Between Points Across Different Coordinate Systems_

## Objective
The objective of this assignment is to study and compare the computational complexity of algorithms used for calculating distances between points in Cartesian, polar, and spherical coordinate systems.

## Conclusion

## Results Summary for num of points: 1,000,000

- 2D Cartesian to Polar Conversion
  - Average Time: 0.091792 seconds
<br/><br/> 

- 2D Polar to Cartesian Conversion
    - Average Time: 0.047388 seconds
    - Speedup Factor: 1.937 times faster
<br/><br/> 

- 3D Cartesian to Spherical Conversion
  - Average Time: 0.105618 seconds
<br/><br/> 

- 3D Spherical to Cartesian Conversion
  - Average Time: 0.113878 seconds
<br/><br/>

### Conversion Summary
- 2D Cartesian to Polar
  - Time taken for 2D Cartesian to Polar conversion is relatively fast and decreases with an increasing number of points.
- 2D Polar to Cartesian
  - 2D Polar to Cartesian conversion is also fast and improves with more points.
- 3D Cartesian to Spherical
  - 3D Cartesian to Spherical conversion is consistently fast and doesn't show a significant change with an increasing number of points.
- 3D Spherical to Cartesian
  - Similar to 3D Cartesian to Spherical conversion, 3D Spherical to Cartesian conversion maintains fast execution times and is stable across different numbers of points.
<br/><br/>

### Distance Calculations

##### Cartesian Coordinate System
- Average Time: 0.042372 seconds

##### Polar Coordinate System
- Average Time: 0.048337 seconds

##### Spherical Coordinate System
- Average Time: 0.133649 seconds

### Distance Calculations Summary
- Distance calculations in the Cartesian coordinate system are fast and increase slightly with more points.
- In the Polar coordinate system, the execution time for distance calculations increases, especially with a larger number of points.
- Distance calculations in the Spherical coordinate system are slower and exhibit a significant increase in execution time with more points.

### Overall Remark
- The execution times for Cartesian to Polar and Polar to Cartesian conversions are fast, but increases with more points.
- Distance calculations are generally faster in the Cartesian coordinate system compared to Polar and Spherical coordinate systems.
- As the number of points increases, the performance degradation is more noticeable in Polar and Spherical coordinate systems.
- Spherical is the slowest one.

![Result of the program computaitions](.\result.png)