export default class NameUtils {
    ownRealName: string;
    ownNameAlias: string;

    constructor(ownRealName: string, ownNameAlias = 'Me') {
        this.ownRealName = ownRealName;
        this.ownNameAlias = ownNameAlias;
    }

    // TODO: add a test
    isOwnName(fullName): boolean {
        return fullName == this.ownRealName;
    }

    format(fullName): string {
        if (this.isOwnName(fullName)) {
            return this.ownNameAlias;
        } else {
            const names = fullName.split(' ');
            if (names[0] == fullName) {
                return fullName;
            }

            return `${names[0]} ${names
                .slice(1)
                .map((name) => name.substring(0, 1))
                .join(' ')}`;
        }
    }
}
