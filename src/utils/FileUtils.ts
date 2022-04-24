import FsProvider from '../providers/generic/file/FsProvider';
import path from 'path';

export default class FileUtils {

    public static async ensureDirectory(dir: string) {
        const fs = FsProvider.instance;
        await fs.mkdirs(dir);
    }

    public static async emptyDirectory(dir: string) {
        const fs = FsProvider.instance;
        const files = await fs.readdir(dir);
        for (const filename of files) {
            const file = path.join(dir, filename);
            if ((await fs.lstat(file)).isDirectory()) {
                await this.emptyDirectory(file);
                await fs.rmdir(file);
            } else {
                await fs.unlink(file);
            }
        }
        return Promise.resolve();
    }

}
