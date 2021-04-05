"use strict";
/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = void 0;
// The following is a copy of the Status enum defined in @grpc/grpc-js,
// src/constants.ts. We need to use some of these statuses here and there,
// but we don't want to include the whole @grpc/grpc-js into the browser
// bundle just to have this small enum.
var Status;
(function (Status) {
    Status[Status["OK"] = 0] = "OK";
    Status[Status["CANCELLED"] = 1] = "CANCELLED";
    Status[Status["UNKNOWN"] = 2] = "UNKNOWN";
    Status[Status["INVALID_ARGUMENT"] = 3] = "INVALID_ARGUMENT";
    Status[Status["DEADLINE_EXCEEDED"] = 4] = "DEADLINE_EXCEEDED";
    Status[Status["NOT_FOUND"] = 5] = "NOT_FOUND";
    Status[Status["ALREADY_EXISTS"] = 6] = "ALREADY_EXISTS";
    Status[Status["PERMISSION_DENIED"] = 7] = "PERMISSION_DENIED";
    Status[Status["RESOURCE_EXHAUSTED"] = 8] = "RESOURCE_EXHAUSTED";
    Status[Status["FAILED_PRECONDITION"] = 9] = "FAILED_PRECONDITION";
    Status[Status["ABORTED"] = 10] = "ABORTED";
    Status[Status["OUT_OF_RANGE"] = 11] = "OUT_OF_RANGE";
    Status[Status["UNIMPLEMENTED"] = 12] = "UNIMPLEMENTED";
    Status[Status["INTERNAL"] = 13] = "INTERNAL";
    Status[Status["UNAVAILABLE"] = 14] = "UNAVAILABLE";
    Status[Status["DATA_LOSS"] = 15] = "DATA_LOSS";
    Status[Status["UNAUTHENTICATED"] = 16] = "UNAUTHENTICATED";
})(Status = exports.Status || (exports.Status = {}));
//# sourceMappingURL=status.js.map