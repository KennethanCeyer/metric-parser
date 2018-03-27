import { ConvertData } from './types';
import { Builder } from './builder';

const _PLUGIN_VERSION_ = '1.0.0';

export function convert(formula: ConvertData) {
    const builder = new Builder(formula);
    return builder.build();
}

export function getVersion() {
    return _PLUGIN_VERSION_;
}
