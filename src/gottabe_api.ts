import { BuildConfig, PackageInfo, TargetConfig } from './base_types';

/**
 * Retrieve project informations
 */
export interface Project {
	/**
	 * Return the parsed build descriptor
	 */
	getBuildConfig(): BuildConfig;
	/**
	 * Return the name of the project in the build descriptor
	 */
	getName(): string;
	/**
	 * Return the version of the project from the build descriptor
	 */
	getVersion(): string;
	/**
	 * Return the current target from build configuration
	 */
	getCurrentTarget(): TargetConfig;
	/**
	 * Return the base directory of the project, in other words, the current directory
	 */
	getBaseDir(): string;
	/**
	 * Return the build directory
	 */
	getBuildDir(): string;
	/**
	 * Return the dependency directory in the build
	 */
	getDependencyDir(): string;
}

/**
 * Provide methods to manage packages
 */
export interface PackageManager {
	/**
	 * Checks if the package is in cache. If architecture, platform and toolchain it checks only the platform specific files.
	 * @param packageInfo the package info
	 * @param arch the architecture
	 * @param platform the platform
	 * @param toolchain the toolchain
	 * @returns true, if the package is in cache
	 */
	isInCache(packageInfo: PackageInfo, arch:string, platform:string, toolchain:string): Promise<boolean>;

	/**
	 * Load a package into the build directory. If the package is not in cache, it throws an error.
	 * @param packageInfo 
	 * @param arch 
	 * @param platform 
	 * @param toolchain 
	 * @returns an array with all dependency packages
	 */
	loadPackage(packageInfo: PackageInfo, arch:string, platform:string, toolchain:string): Promise<PackageInfo[]>;

	/**
	 * Download a package from a list of servers. The method searches among the servers and downloads the package from the first it finds. Can be platform specific if it is specified.
	 * @param packageInfo 
	 * @param servers 
	 * @param arch 
	 * @param platform 
	 * @param toolchain 
	 * @returns a promise to the package info
	 */
	downloadPackage(packageInfo: PackageInfo, servers: string[], arch?:string, platform?:string, toolchain?:string): Promise<PackageInfo>;

	/**
	 * Check in the servers if the checksum of the files is the same, otherwise update the files.
	 * @param packageInfo 
	 * @param servers 
	 * @param arch 
	 * @param platform 
	 * @param toolchain 
	 * @returns a promise to the package info
	 */
	updatePackage(packageInfo: PackageInfo, servers: string[]): Promise<PackageInfo>;

	/**
	 * Publish the package in the local repository
	 * @param project 
	 * @returns a promise to the package info
	 */
	publishLocal(project: Project): Promise<PackageInfo>;

	/**
	 * Publish the package in the specified server
	 * @param project 
	 * @param server 
	 * @param username 
	 * @param password 
	 * @returns a promise to the package info
	 */
	publish(project: Project, server: string, username: string, password: string): Promise<PackageInfo>;

	/**
	 * Create a package for the project using a build previously made
	 * @param project 
	 * @returns a promise to the package info
	 */
	packageProject(project: Project): Promise<PackageInfo>;

}
