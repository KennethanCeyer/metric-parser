export class StringHelper {
    public static formatString(value: string, mapping: string[]): string {
        let targetValue = value;
        if (mapping)
            mapping
                .forEach((match, index) => targetValue = StringHelper.replaceArg(index, targetValue, match));
        return targetValue;
    }

    private static replaceArg(match: number, target: string, value: string): string {
        return target.replace(new RegExp(`\\\{${match}\\\}`, 'g'), value);
    }
}