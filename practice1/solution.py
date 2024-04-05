import numpy as np
import time

def cartesian_to_polar(cartesian_points):
    """
        Convert Cartesian coordinates to polar coordinates.

        Parameters:
        - cartesian_points (numpy.ndarray): 2D array.

        Returns:
        - numpy.ndarray: 2D array representing Polar coordinates (r, theta).
    """
    x, y = cartesian_points[:, 0], cartesian_points[:, 1]
    r = np.sqrt(x**2 + y**2)
    theta = np.arctan2(y, x)
    return np.column_stack((r, theta))

def polar_to_cartesian(polar_points):
    """
        Convert polar coordinates to Cartesian coordinates.

        Parameters:
        - polar_points (numpy.ndarray): 2D array (r, theta).

        Returns:
        - numpy.ndarray: 2D array representing Cartesian coordinates (x, y).
    """
    r, theta = polar_points[:, 0], polar_points[:, 1]
    x = r * np.cos(theta)
    y = r * np.sin(theta)
    return np.column_stack((x, y))

def cartesian_to_spherical(cartesian_points):
    """
        Convert Cartesian coordinates to spherical coordinates.

        Parameters:
        - cartesian_points (numpy.ndarray): 3D array (x, y, z).

        Returns:
        - numpy.ndarray: 3D array representing spherical coordinates (r, theta, phi).
    """
    x, y, z = cartesian_points[:, 0], cartesian_points[:, 1], cartesian_points[:, 2]
    r = np.sqrt(x**2 + y**2 + z**2)
    theta = np.arctan2(y, x)
    phi = np.arccos(z / r)
    return np.column_stack((r, theta, phi))

def spherical_to_cartesian(spherical_points):
    """
        Convert spherical coordinates to Cartesian coordinates.

        Parameters:
        - spherical_points (numpy.ndarray): 3D array (r, theta, phi).

        Returns:
        - numpy.ndarray: 3D array representing Cartesian coordinates (x, y, z).
    """
    r, theta, phi = spherical_points[:, 0], spherical_points[:, 1], spherical_points[:, 2]
    x = r * np.sin(phi) * np.cos(theta)
    y = r * np.sin(phi) * np.sin(theta)
    z = r * np.cos(phi)
    return np.column_stack((x, y, z))

def distance_cartesian(p1, p2):
    """
        Calculate the distance between points in Cartesian coordinates.

        Parameters:
        - p1 (numpy.ndarray): represents Cartesian coordinates of point 1 (x1, y1).
        - p2 (numpy.ndarray): represents Cartesian coordinates of point 2 (x2, y2).

        Returns:
        - numpy.ndarray: Array of distances between each pair of points.
    """
    return np.sqrt(np.sum((p1 - p2) ** 2, axis=1))

def distance_polar(p1, p2):
    """
        Calculate distance between points in polar coordinates.

        Parameters:
        - p1 (numpy.ndarray): represents polar coordinates of point 1 (r1, theta1).
        - p2 (numpy.ndarray): represents polar coordinates of point 2 (r2, theta2).

        Returns:
        - numpy.ndarray: Array of distances between each pair of points.
    """
    # Theta difference
    angle_difference = np.clip(np.cos(p1[:, 1] - p2[:, 1]), -1, 1)
    distance = np.sqrt(np.maximum(p1[:, 0] ** 2 + p2[:, 0] ** 2 - 2 * p1[:, 0] * p2[:, 0] * angle_difference, 0))
    return distance

def distance_spherical(p1, p2):
    """
        Calculate distance between points in spherical coordinates.

        Parameters:
        - p1 (numpy.ndarray): represents spherical coordinates of point 1 (r1, theta1, phi1).
        - p2 (numpy.ndarray): represents spherical coordinates of point 2 (r2, theta2, phi2).

        Returns:
        - numpy.ndarray: Array of distances between each pair of points.
    """
    # Phi difference
    angle_difference = np.clip(np.cos(p1[:, 2] - p2[:, 2]), -1, 1)
    distance = np.sqrt(np.maximum(p1[:, 0] ** 2 + p2[:, 0] ** 2 - 2 * p1[:, 0] * p2[:, 0] * (
        np.sin(p1[:, 1]) * np.sin(p2[:, 1]) * angle_difference + np.cos(p1[:, 1]) * np.cos(p2[:, 1])), 0))
    return distance

def shfl(arr):
    np.random.shuffle(arr)
    return arr

def bench(num_points):
    """
        Benchmark various coordinate transformations and distance calculations and
        display the time taken to compute.

        Parameters:
        - num_points (int): number of random points to generate for the benchmark.
    """
    # Generate random points in 2D Cartesian coordinate system
    cartesian_points = np.random.rand(num_points, 2)

    # Timer for 2D Cartesian to Polar conversion
    start_time = time.perf_counter()
    polar_points = cartesian_to_polar(cartesian_points)
    conversion_time = time.perf_counter() - start_time

    print(f"Time taken for 2D Cartesian to Polar conversion: {conversion_time:.6f} seconds")

    # Timer for 2D Polar to Cartesian conversion
    start_time = time.perf_counter()
    converted_cartesian_points = polar_to_cartesian(polar_points)
    conversion_time = time.perf_counter() - start_time

    print(f"Time taken for 2D Polar to Cartesian conversion: {conversion_time:.6f} seconds")

    # Generate random points in 3D Cartesian coordinate system
    cartesian_points_3d = np.random.rand(num_points, 3)

    # Timer for 3D Cartesian to Spherical conversion
    start_time = time.perf_counter()
    spherical_points = cartesian_to_spherical(cartesian_points_3d)
    conversion_time = time.perf_counter() - start_time

    print(f"\nTime taken for 3D Cartesian to Spherical conversion: {conversion_time:.6f} seconds")

    # Timer for 3D Spherical to Cartesian conversion
    start_time = time.perf_counter()
    converted_cartesian_points_3d = spherical_to_cartesian(spherical_points)
    conversion_time = time.perf_counter() - start_time

    print(f"Time taken for 3D Spherical to Cartesian conversion: {conversion_time:.6f} seconds")

    # Timer for distance calculations in Cartesian Coordinate System
    start_time = time.perf_counter()
    dist_cartesian = distance_cartesian(cartesian_points, shfl(cartesian_points.copy()))
    calculation_time_cartesian = time.perf_counter() - start_time

    print(
        f"\nTime taken for distance calculations in Cartesian Coordinate System: {calculation_time_cartesian:.6f} seconds")

    # Timer for distance calculations in Polar Coordinate System
    start_time = time.perf_counter()
    dist_polar = distance_polar(polar_points, shfl(polar_points.copy()))
    calculation_time_polar = time.perf_counter() - start_time

    print(f"Time taken for distance calculations in Polar Coordinate System: {calculation_time_polar:.6f} seconds")

    # Timer for distance calculations in Spherical Coordinate System
    start_time = time.perf_counter()
    dist_spherical = distance_spherical(spherical_points, shfl(spherical_points.copy()))
    calculation_time_spherical = time.perf_counter() - start_time

    print(
        f"Time taken for distance calculations in Spherical Coordinate System: {calculation_time_spherical:.6f} seconds")

def print_bench(var):
    print(f"-------------------\nNum of points: {var}")
    bench(var)

for i in range(1, 7):
    print_bench(10 ** i)
