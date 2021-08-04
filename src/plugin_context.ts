import { Phase, Plugin } from './base_types';
import { PackageManager, Project } from './gottabe_api';

class PluginContext {
	getPackageManager(): PackageManager {
		return (<any>this).__internal__.packageManager;
	}
	getCurrentProject(): Project {
		return (<any>this).__internal__.project;
	}
};

const _pc = new PluginContext();
const __internal__ = { packageManager: null, project: null, pluginsLoaded: [] as any[] };

type Constructor<T> = {
	// tslint:disable-next-line:no-any
	new(...args: any[]): T
};

interface ClassDescriptor {
	kind: 'class';
	elements: ClassElement[];
	finisher?: <T>(clazz: Constructor<T>) => undefined | Constructor<T>;
}

interface ClassElement {
	kind: 'field' | 'method';
	key: PropertyKey;
	placement: 'static' | 'prototype' | 'own';
	initializer?: Function;
	extras?: ClassElement[];
	finisher?: <T>(clazz: Constructor<T>) => undefined | Constructor<T>;
	descriptor?: PropertyDescriptor;
}

const _gottaBePluginFunc = (phases: Phase[], ctor: Constructor<Plugin>) => {
	__internal__.pluginsLoaded.push({ phases, ctor });
	return ctor as any;
};

const _gottaBePluginDeco = (phases: Phase[], descriptor: ClassDescriptor) => {
	const { kind, elements } = descriptor;
	return {
		kind,
		elements,
		finisher(ctor: Constructor<Plugin>) {
			__internal__.pluginsLoaded.push({ phases, ctor });
		}
	};
};

export const gottaBePlugin = (phases: Phase[]) =>
	(classOrDescriptor: Constructor<Plugin> | ClassDescriptor) =>
		(typeof classOrDescriptor === 'function') ?
			_gottaBePluginFunc(phases, classOrDescriptor) :
			_gottaBePluginDeco(phases, classOrDescriptor);

Object.defineProperty(_pc, '__internal__', { configurable: false, enumerable: false, get: () => __internal__ });

export const pluginContext: PluginContext = _pc;
