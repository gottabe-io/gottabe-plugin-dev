/*
Copyright 2022 gottabe-io

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import {Phase} from './base_types';

/**
 * The base descriptor
 */
export interface BaseDescriptor {
	groupId: string;
	artifactId: string;
	version: string;
	description?: string;
	author?: string;
	sourceUrl?: string;
	issueUrl?: string;
	documentationUrl?: string;
	license?: string;
}

/**
 * Package information extracted from the build configuration of a package.
 */
export interface PackageInfo extends BaseDescriptor {
	/**
	 * Include directory
	 */
	includeDir?: string;
	/**
	 * The original build configuration
	 */
	build?: BuildDescriptor;
	/**
	 * The checksum of the files of the package for the current target
	 */
	checksum: string;
	/**
	 * Directories for the files
	 */
	dirs: any;
	/**
	 * The dependencies of this package
	 */
	dependencies: PackageInfo[];
	/**
	 * The current scope of this package
	 */
	scope: string[];
}

/**
 * The command line options parsed
 */
export interface CommandLineOptions {
	/**
	 * The state of the clean task
	 */
	clean: boolean;
	/**
	 * The state of the build task
	 */
	build: boolean;
	/**
	 * The state of the package task
	 */
	package: boolean;
	/**
	 * The state of the install task
	 */
	install: boolean;
	/**
	 * The state of the publish task
	 */
	publish: boolean;
	/**
	 * The state of the test task
	 */
	test: boolean;
	/**
	 * The architecture
	 */
	arch?: string;
	/**
	 * The platform
	 */
	platform?: string;
	/**
	 * The target
	 */
	target?: string;
	/**
	 * Clean all
	 */
	all?: boolean;
	/**
	 * Settings file
	 */
	settingsFile?: string;
	/**
	 * Skip tests. Incompatible with command test
	 */
	noTests?: boolean;
}

/**
 * The plugin descriptor
 */
export interface PluginDescriptor extends BaseDescriptor {
	main: string;
	/**
	 * An array with the phases when the plugin must be called. Default is the same of all phases
	 */
	phases?: string[];
}

/**
 * Interace for plugin implementation
 */
export interface Plugin {
	/**
	 * The plugin stuff must be implemented in this method. The method doesn't require a result, but can be asynchronous.
	 * @param phaseParams the phase parameters
	 * @param pluginContext the plugin context
	 */
	process(phaseParams: PhaseParams, pluginContext: PluginContext): Promise<void>;
}

/**
 * Interface for a plugin configuration on the build
 */
export interface PluginConfig {
	/**
	 * The package description following the pattern <groupId>/<artifactId>[@<version>][:<scope>]
	 */
	package: string;
	/**
	 * Phases used in the current configuration. If the plugin doesn't use any of the phases specified, it will be ignored.
	 */
	phases?: string[];
	/**
	 * Additional configurations
	 */
	config?: any;
}

/**
 * Interface for a target configuration on the build
 */
export interface TargetConfig {
	name: string;
	arch: string;
	platform: string;
	toolchain: string;
	plugins?: PluginConfig[];
	includeDirs?: (string)[] | null;
	sources?: (string)[] | null;
	options?: Options;
	defines?: any;
	libraryPaths?: (string)[] | null;
	libraries?: (string)[] | null;
	linkOptions?: LinkOptions;
}

/**
 * Interface to the compiler options on a target
 */
export interface Options {
	optimization?: number;
	debug?: number;
	warnings?: string;
	other?: string;
}

/**
 * Interface to the linker options on a target
 */
 export interface LinkOptions {
	debugInformation?: boolean | null;
	other?: any;
}

/**
 * Interface for the packaging configuration
 */
export interface PackageConfig {
	name?: string;
	includes?: (string)[] | null;
	other?: (string)[] | null;
}

/**
 * Interface for the build descriptor
 */
export interface BuildDescriptor extends BaseDescriptor {
	dependencies?: string[];
	includeDirs?: string[];
	modules?: BuildDescriptor[];
	package?: PackageConfig;
	plugins?: PluginConfig[];
	sources?: string[];
	targets?: TargetConfig[];
	testSources?: string[];
	type: string;

}

/**
 * Interface for the phase parameters used in plugins
 */
export interface PhaseParams {
	buildConfig: BuildDescriptor;
	currentTarget: TargetConfig;
	commandOptions: CommandLineOptions;
	project: Project,
	inputFiles: string[];
	destDir?: string;
	phase: Phase;
	previousPhaseParams?: PhaseParams;
	solvedDependencies?:PackageInfo[];
	defaultPrevented: boolean;
	preventDefault(): void;
}

/**
 * Retrieve project informations
 */
 export interface Project {
	/**
	 * Return the parsed build descriptor
	 */
	getBuildConfig(): BuildDescriptor;
	/**
	 * Return the group id of the project in the build descriptor
	 */
	getGroupId(): string;
	/**
	 * Return the artifact id of the project in the build descriptor
	 */
	getArtifactId(): string;
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
	publish(project: Project, server: string): Promise<PackageInfo>;

	/**
	 * Create a package for the project using a build previously made
	 * @param project
	 * @returns a promise to the package info
	 */
	packageProject(project: Project): Promise<PackageInfo>;

}

/**
 * Interface for the plugin context
 */
export interface PluginContext {
	/**
	 * Retrieve a instance of the package manager
	 */
	getPackageManager(): PackageManager;
	/**
	 * Return the current project
	 */
	getCurrentProject(): Project;
	/**
	 * Return the configuration of the current plugin
	 */
	getPluginConfig(): any;
};
