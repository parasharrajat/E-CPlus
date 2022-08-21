#! /bin/env node
const {writeFileSync} = require('fs');
const path = require('path');
const json = require('./update_manifest.json');

function addEntryToUpdateManifest() {
    const version = process.argv[2];
    if (!version) {
        throw new Error('No version was passed');
    }
    json.addons['{2a855be6-939a-45da-9606-49b77fbb0fba}'].updates.push({
        version,
        update_link: `https://github.com/parasharrajat/Expensify-CPlus/releases/download/${version}/expensify-contributor-plus.${version}.firefox.xpi.zip`,
    });

    writeFileSync(path.resolve('./update_manifest.json'), JSON.stringify(json, null, 4), {encoding: 'utf-8'});
}

addEntryToUpdateManifest();
