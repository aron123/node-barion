const path = require('path');
const fs = require('fs/promises');
const mustache = require('mustache');
const { version } = require('../../package.json');

module.exports = async function generateDefinition (interfacesPath, definitionOutputPath) {
    const filePaths = await fs.readdir(interfacesPath);

    let interfacesCode = '';
    for (const filePath of filePaths) {
        let interfaceDefinition = await fs.readFile(path.join(interfacesPath, filePath), { encoding: 'utf-8' });
        interfaceDefinition = interfaceDefinition.replaceAll('export interface', 'interface');
        const defWithoutSurplus = interfaceDefinition.split('\n')
            .filter(part => !part.startsWith('import {') && !part.startsWith('export type default'))
            .join('\n')
            .trim();
        interfacesCode += `\n\n${defWithoutSurplus}`;
    }
    interfacesCode = interfacesCode.trim();

    const definitionTemplatePath = path.join(__dirname, './node-barion.template.d.ts');
    const definitionTemplate = await fs.readFile(definitionTemplatePath, { encoding: 'utf-8' });
    const majorMinorVersion = version.split('.').slice(0, 2).join('.'); // 3.1.0 -> 3.1
    const definition = mustache.render(definitionTemplate,
        {
            schemaDefinitions: interfacesCode,
            version: majorMinorVersion
        },
        null,
        { escape: val => val }
    );

    await fs.writeFile(definitionOutputPath, definition, { encoding: 'utf-8' });
};
