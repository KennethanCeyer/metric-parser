export class StringHelper {
    public static format(value: string, ...args: string[]): string {
        let targetValue = value;
        if (args)
            args.forEach((match, index) => targetValue = StringHelper.replaceArg(index, targetValue, match));
        return targetValue;
    }

    private static replaceArg(match: number, target: string, value: string): string {
        return target.replace(new RegExp(`\\\{${match}\\\}`, 'g'), value);
    }
}
