const path = require('path');
const generateInterfaces = require('./generate-interfaces');
const generateDefinition = require('./generate-definition');

const SCHEMAS_DIR = path.join(process.cwd(), '/lib/domain');
const GEN_INTERFACES_DIR = path.join(process.cwd(), '/generated/interfaces');
const DEF_OUTPUT_PATH = path.join(process.cwd(), 'generated/node-barion.d.ts');

async function main () {
    console.log('Generating interfaces from schema definitions ...');
    await generateInterfaces(SCHEMAS_DIR, GEN_INTERFACES_DIR);
    console.log('Generated interfaces successfully.');
    console.log('Generating type definition ...');
    await generateDefinition(GEN_INTERFACES_DIR, DEF_OUTPUT_PATH);
    console.log(`Generated type definition successfully, path: ${DEF_OUTPUT_PATH}`);
}

main().catch(err => console.error(err));
