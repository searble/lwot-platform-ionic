'use strict';

module.exports = (()=> {
    let spawn = require("child_process").spawn;
    // if windows
    if (process.platform == 'win32')
        spawn = require('cross-spawn');

    const fs = require('fs');
    const path = require('path');
    const open = require("open");

    const PLUGIN_ROOT = path.resolve(__dirname);
    const RES_ROOT = path.resolve(__dirname, 'resource');
    const RUN_PATH = path.resolve(PLUGIN_ROOT, 'app');
    const CONFIG_PATH = path.resolve(PLUGIN_ROOT, 'app', 'controller', 'config.json');

    let config = {};
    try {
        config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    } catch (e) {
    }

    let terminal = (cmd, args, opts)=> new Promise((callback)=> {
        const term = spawn(cmd, args, opts);
        term.stdout.pipe(process.stdout);
        term.stderr.pipe(process.stderr);
        process.stdin.pipe(term.stdin);
        term.on('close', () => {
            process.stdin.end();
            callback();
        });
    });

    let plugin = {};

    plugin.run = (args)=> new Promise((callback)=> {
        if (!args[0]) {
            terminal('ionic', ['serve', '--lab'], {cwd: RUN_PATH}).then(()=> {
                callback();
            });
            return;
        }
        terminal('ionic', ['run', args[0]], {cwd: RUN_PATH}).then(()=> {
            callback();
        });
    });

    plugin.deploy = (args)=> new Promise((callback)=> {
        if (!args[0]) return callback();
        let appXml = fs.readFileSync(path.resolve(RES_ROOT, 'config.xml'), 'utf-8');
        let replaceConfig = (key, def)=> {
            appXml = appXml.replace('{$' + key + '}', config[key] ? config[key] : def ? def : 'lwot');
        };
        replaceConfig('version', '1.0');
        replaceConfig('name', 'lwot');
        replaceConfig('description', 'lwot example');
        replaceConfig('authors', 'Searble');
        replaceConfig('authors_email', 'lwot@lwot.com');
        replaceConfig('authors_homepage', 'lwot.com/info');
        fs.writeFileSync(path.resolve(RUN_PATH, 'config.xml'), appXml);

        terminal('ionic', ['platform', 'rm', args[0]], {cwd: RUN_PATH})
            .then(()=> terminal('ionic', ['platform', 'add', args[0]], {cwd: RUN_PATH}))
            .then(()=> {
                callback();
            });
    });

    return plugin;
})();