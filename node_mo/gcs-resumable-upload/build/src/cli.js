#!/usr/bin/env node
"use strict";
/*!
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const args = process.argv.slice(2);
const opts = {
    bucket: args[0],
    file: args[1],
};
process.stdin
    .pipe(_1.upload(opts))
    .on('error', console.error)
    .on('response', (resp, metadata) => {
    if (!metadata || !metadata.mediaLink)
        return;
    console.log('uploaded!');
    console.log(metadata.mediaLink);
});
//# sourceMappingURL=cli.js.map