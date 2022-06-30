const path = require('path');
const fs = require('fs/promises');
const { convertFromDirectory } = require('joi-to-typescript');

module.exports = async function generateInterfaces (inputDir, outputDir) {
    await fs.rm(outputDir, {
        recursive: true,
        force: true
    });
    await fs.mkdir(outputDir);

    const areInterfacesGenerated = await convertFromDirectory({
        schemaDirectory: inputDir,
        typeOutputDirectory: outputDir,
        debug: true,
        flattenTree: true,
        fileHeader: '',
        indentationChacters: '    ',
        ignoreFiles: [ '_constraints.js' ],
        inputFileFilter: new RegExp('\\.js$')
    });

    if (!areInterfacesGenerated) {
        throw new Error('Cannot generate interfaces.');
    }

    await fs.rm(path.join(outputDir, 'index.ts'), { force: true });
    await fs.rm(path.join(outputDir, 'index.js.ts'), { force: true });
};
