import {Plugin,PhaseParams, PluginContext, Phase} from 'gottabe-plugin-dev';

export class PluginClass implements Plugin {

	async process(phaseParams: PhaseParams, pluginContext: PluginContext): Promise<void> {
		console.log('Hello!');
		if (Phase.COMPILE == phaseParams.phase)
			console.log('We are compiling.');
	}

}
