
import fs from "fs/promises";
import path from "path";

const PLUGINS_DIR = "D:/DJ/Scripts/djzeneyer/plugins";

async function walk(dir) {
    let files = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files = files.concat(await walk(fullPath));
        } else if (entry.name.endsWith(".php")) {
            files.push(fullPath);
        }
    }
    return files;
}

async function analyze() {
    const files = await walk(PLUGINS_DIR);
    const patterns = {
        "Superglobals (Input)": /\$_(GET|POST|REQUEST)/g,
        "Direct Output": /(echo|print|printf)\s+/g,
        "REST Routes": /register_rest_route/g,
        "SQL DB Calls": /\$wpdb->/g,
        "Array Index 0": /\[0\]/g
    };

    for (const file of files) {
        const content = await fs.readFile(file, "utf8");
        const lines = content.split("\n");
        let foundSomething = false;
        
        for (let i = 0; i < lines.length; i++) {
            for (const [name, regex] of Object.entries(patterns)) {
                if (lines[i].match(regex)) {
                    if (!foundSomething) {
                        console.log(`\n=== ${file.replace(PLUGINS_DIR, "")} ===`);
                        foundSomething = true;
                    }
                    console.log(`Line ${i + 1} [${name}]: ${lines[i].trim()}`);
                }
            }
        }
    }
}
analyze().catch(console.error);

