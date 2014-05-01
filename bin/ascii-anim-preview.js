#!/usr/bin/env node

var optimist = require('optimist'),
    fs = require('fs'),
    path = require('path'),
    blessed = require('blessed');

function run () {
    var args = parseArguments(),
        dir = args._[0],
        frames = getFrames(dir),
        screen = blessed.screen(),
        fps = args.f;

    playAnimation(screen, frames, fps);
}

function parseArguments () {
    return optimist
    .usage('Usage: ascii-anim-preview directory')
    .alias('f', 'fps')
    .demand(1)
    .default('f', 30)
    .argv;
}

function getFrames (dir) {
    var files = fs.readdirSync(dir),
        out = [];

    files.forEach(function (file, i) {
        if (file.substr(0, 1) === '.') {
            return files.splice(i, 1);
        }

        out.push(fs.readFileSync(path.resolve(dir, file), 'utf8'));
    });

    return out;
}

function getSize (frames) {
    var size = { width: 0, height: 0 };

    frames.forEach(function (f) {
        var lines = f.split('\n');

        lines.forEach(function (line) {
            size.width = Math.max(size.width, line.length);
        });

        size.height = Math.max(size.height, lines.length);
    });

    return size;
}

function playAnimation (screen, frames, fps) {
    var size = getSize(frames),
        box = blessed.box({
            top: 'center',
            left: 'center',
            width: size.width,
            height: size.height
        }),
        cur = 0;

        screen.append(box);

        setInterval(function () {
            if (cur > frames.length - 1) {
                cur = 0;
            }

            box.setContent(frames[cur]);
            screen.render();

            cur += 1;
        }, 1000 / fps);
}

run();