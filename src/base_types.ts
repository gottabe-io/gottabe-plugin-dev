/* Copyright (C) 2018 Alan N. Lohse

   This file is part of GottaBe.

    GottaBe is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    GottaBe is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
	along with GottaBe.  If not, see <http://www.gnu.org/licenses/> */

export enum Phase {
	CLEAN,
	RESOLVE_DEPENDENCIES,
	COMPILE,
	LINK,
	TEST,
	PACKAGE,
	INSTALL
};

export const ArtifactTypes = {
	EXECUTABLE: 'executable',
	SHARED_LIBRARY: 'shared_library',
	STATIC_LIBRARY: 'static library',
	DRIVER: 'driver',
	NONE: 'none'
};

export const DependencyScopes = {
	COMPILE: 'compile',
	TEST: 'test',
	RUNTIME: 'runtime',
	SHALLOW: 'shallow'
};

export interface PackageInfo {
	groupId: string;
	artifactId: string;
	version: string;
	includeDir?: string;
	build?: BuildConfig;
	checksum: string;
	dirs: any;
	dependencies: PackageInfo[];
	scope: string[];
}

export interface CommandLineOptions {
	clean: boolean;
	build: boolean;
	package: boolean;
	install: boolean;
	test: boolean;
	arch?: string;
	platform?: string;
}

export interface Plugin {
	process(phaseParams: PhaseParams): Promise<void>;
}

export interface PluginConfig {
	packageName: string;
	config?: any;
}

export interface TargetConfig {
	name: string;
	arch: string;
	platform: string;
	toolchain: string;
	plugins?: Plugin[];
	includeDirs?: (string)[] | null;
	sources?: (string)[] | null;
	options?: Options;
	defines?: any;
	libraryPaths?: (string)[] | null;
	libraries?: (string)[] | null;
	linkoptions?: Linkoptions;
}

export interface Options {
	optimization?: number;
	debug?: number;
	warnings?: string;
	other?: string;
}

export interface Linkoptions {
	debugInformation?: boolean | null;
}

export interface PackageConfig {
	name?: string;
	includes?: (string)[] | null;
	other?: (string)[] | null;
}

export interface BuildConfig {
	groupId: string;
	artifactId: string;
	version: string;
	type: string;
	description: string;
	author?: string;
	source?: string;
	modules?: BuildConfig[];
	plugins?: Plugin[];
	dependencies?: (string)[] | null;
	includeDirs?: (string)[] | null;
	sources?: (string)[];
	testSources?: (string)[] | null;
	targets?: (TargetConfig)[];
	package?: PackageConfig;
	servers?: string[];
}

export interface PhaseParams {
	buildConfig: BuildConfig;
	currentTarget: TargetConfig;
	commandOptions: CommandLineOptions;
	inputFiles: string[];
	phase: Phase;
	previousPhase?: PhaseParams;
	solvedDependencies?:PackageInfo[];
}
