import FsProvider from '../../../../src/providers/generic/file/FsProvider';
import InMemoryFsProvider from '../stubs/providers/InMemory.FsProvider';
import * as path from 'path';

describe("InMemoryFsProvider", () => {

    beforeEach(() => {
        FsProvider.provide(() => new InMemoryFsProvider());
        InMemoryFsProvider.clear();
    });

    test("Exists and Mkdirs", async () => {
        const existsBefore = await FsProvider.instance.exists("Test");
        await FsProvider.instance.mkdirs("Test");
        const existsAfter = await FsProvider.instance.exists("Test");
        expect(existsBefore).toBeFalsy();
        expect(existsAfter).toBeTruthy();
    })

    test("WriteFile and ReadFile", async () => {
        await FsProvider.instance.mkdirs("Test");
        const existsBefore = await FsProvider.instance.exists(path.join("Test", "TestWriteFile"));
        await FsProvider.instance.writeFile(path.join("Test", "TestWriteFile"), "test_content");
        const existsAfter = await FsProvider.instance.exists(path.join("Test", "TestWriteFile"));
        const content = await FsProvider.instance.readFile(path.join("Test", "TestWriteFile"));
        expect(existsBefore).toBeFalsy();
        expect(existsAfter).toBeTruthy();
        expect(content.toString()).toBe("test_content");
    });

    test("CopyFile", async () => {
        await FsProvider.instance.mkdirs("Test_Pre");
        await FsProvider.instance.mkdirs("Test_Post");
        await FsProvider.instance.writeFile(path.join("Test_Pre", "TestWriteFile"), "test_content");
        await FsProvider.instance.copyFile(path.join("Test_Pre", "TestWriteFile"), path.join("Test_Post", "TestWriteFileCopied"));
        const content = await FsProvider.instance.readFile(path.join("Test_Post", "TestWriteFileCopied"));
        expect(content.toString()).toBe("test_content");
    });

    test("CopyFolder", async () => {
        await FsProvider.instance.mkdirs(path.join("Test", "Pre"));
        await FsProvider.instance.writeFile(path.join("Test", "Pre", "TestWriteFile"), "test_content");
        await FsProvider.instance.copyFolder(path.join("Test", "Pre"), path.join("Test", "Post"));
        const content = await FsProvider.instance.readFile(path.join("Test", "Post", "TestWriteFile"));
        expect(content.toString()).toBe("test_content");
    });

    test("SetModifiedTime", async () => {
        const testFilePath = path.join("Test", "TestFile");
        await FsProvider.instance.mkdirs(path.dirname(testFilePath));
        await FsProvider.instance.writeFile(testFilePath, "test_content");
        const statOriginal = await FsProvider.instance.stat(testFilePath);
        const dateWritten = statOriginal.mtime;
        console.log("Original time:", statOriginal.mtime.getTime());
        const fakeDate = new Date();
        fakeDate.setFullYear(2021);
        console.log("Fake time:", fakeDate.getTime());
        await FsProvider.instance.setModifiedTime(testFilePath, fakeDate);
        const statNew = await FsProvider.instance.stat(testFilePath);
        const modifiedDate = statNew.mtime;
        console.log("New time:", statNew.mtime.getTime());
        expect(dateWritten.getTime()).toBeGreaterThan(modifiedDate.getTime());
    });

    test("File size", async () => {
        const testFilePath = path.join("Test", "TestFile");
        await FsProvider.instance.mkdirs(path.dirname(testFilePath));
        await FsProvider.instance.writeFile(testFilePath, "test_content");
        const stat = await FsProvider.instance.stat(testFilePath);
        expect(stat.size).toBe("test_content".length);
    });

});
