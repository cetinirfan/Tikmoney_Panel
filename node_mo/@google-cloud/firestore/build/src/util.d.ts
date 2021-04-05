/*!
 * Copyright 2018 Google Inc. All Rights Reserved.
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
import { DocumentData } from '@google-cloud/firestore';
import { GoogleError } from 'google-gax';
import { BackoffSettings } from 'google-gax/build/src/gax';
/**
 * A Promise implementation that supports deferred resolution.
 * @private
 */
export declare class Deferred<R> {
    promise: Promise<R>;
    resolve: (value?: R | Promise<R>) => void;
    reject: (reason?: Error) => void;
    constructor();
}
/**
 * Generate a unique client-side identifier.
 *
 * Used for the creation of new documents.
 *
 * @private
 * @returns {string} A unique 20-character wide identifier.
 */
export declare function autoId(): string;
/**
 * Generate a short and semi-random client-side identifier.
 *
 * Used for the creation of request tags.
 *
 * @private
 * @returns {string} A random 5-character wide identifier.
 */
export declare function requestTag(): string;
/**
 * Determines whether `value` is a JavaScript object.
 *
 * @private
 */
export declare function isObject(value: unknown): value is {
    [k: string]: unknown;
};
/**
 * Verifies that 'obj' is a plain JavaScript object that can be encoded as a
 * 'Map' in Firestore.
 *
 * @private
 * @param input The argument to verify.
 * @returns 'true' if the input can be a treated as a plain object.
 */
export declare function isPlainObject(input: unknown): input is DocumentData;
/**
 * Returns whether `value` has no custom properties.
 *
 * @private
 */
export declare function isEmpty(value: {}): boolean;
/**
 * Determines whether `value` is a JavaScript function.
 *
 * @private
 */
export declare function isFunction(value: unknown): boolean;
/**
 * Determines whether the provided error is considered permanent for the given
 * RPC.
 *
 * @private
 */
export declare function isPermanentRpcError(err: GoogleError, methodName: string): boolean;
/**
 * Returns the list of retryable error codes specified in the service
 * configuration.
 * @private
 */
export declare function getRetryCodes(methodName: string): number[];
/**
 * Returns the backoff setting from the service configuration.
 * @private
 */
export declare function getRetryParams(methodName: string): BackoffSettings;
/**
 * Returns a promise with a void return type. The returned promise swallows all
 * errors and never throws.
 *
 * This is primarily used to wait for a promise to complete when the result of
 * the promise will be discarded.
 *
 * @private
 */
export declare function silencePromise(promise: Promise<unknown>): Promise<void>;
/**
 * Wraps the provided error in a new error that includes the provided stack.
 *
 * Used to preserve stack traces across async calls.
 * @private
 */
export declare function wrapError(err: Error, stack: string): Error;