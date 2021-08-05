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

