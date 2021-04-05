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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.fallback = exports.protobuf = exports.createApiCall = exports.lro = exports.GrpcClient = exports.version = exports.routingHeader = void 0;
// Not all browsers support `TextEncoder`. The following `require` will
// provide a fast UTF8-only replacement for those browsers that don't support
// text encoding natively.
const isbrowser_1 = require("./isbrowser");
let needTextEncoderPolyfill = false;
if (isbrowser_1.isBrowser() &&
    // eslint-disable-next-line node/no-unsupported-features/node-builtins
    (typeof TextEncoder === 'undefined' || typeof TextDecoder === 'undefined')) {
    needTextEncoderPolyfill = true;
}
if (typeof process !== 'undefined' && ((_a = process === null || process === void 0 ? void 0 : process.versions) === null || _a === void 0 ? void 0 : _a.node) && ((_b = process === null || process === void 0 ? void 0 : process.versions) === null || _b === void 0 ? void 0 : _b.node.match(/^10\./))) {
    // Node.js 10 does not have global TextDecoder
    // TODO(@alexander-fenster): remove this logic after Node.js 10 is EOL.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const util = require('util');
    Object.assign(global, {
        TextDecoder: util.TextDecoder,
        TextEncoder: util.TextEncoder,
    });
}
if (needTextEncoderPolyfill) {
    require('fast-text-encoding');
}
const protobuf = require("protobufjs");
exports.protobuf = protobuf;
const gax = require("./gax");
const nodeFetch = require("node-fetch");
const routingHeader = require("./routingHeader");
exports.routingHeader = routingHeader;
const abort_controller_1 = require("abort-controller");
const status_1 = require("./status");
const google_auth_library_1 = require("google-auth-library");
const operationsClient_1 = require("./operationsClient");
const createApiCall_1 = require("./createApiCall");
const fallbackError_1 = require("./fallbackError");
const transcoding_1 = require("./transcoding");
var pathTemplate_1 = require("./pathTemplate");
Object.defineProperty(exports, "PathTemplate", { enumerable: true, get: function () { return pathTemplate_1.PathTemplate; } });
var gax_1 = require("./gax");
Object.defineProperty(exports, "CallSettings", { enumerable: true, get: function () { return gax_1.CallSettings; } });
Object.defineProperty(exports, "constructSettings", { enumerable: true, get: function () { return gax_1.constructSettings; } });
Object.defineProperty(exports, "RetryOptions", { enumerable: true, get: function () { return gax_1.RetryOptions; } });
exports.version = require('../../package.json').version + '-fallback';
var descriptor_1 = require("./descriptor");
Object.defineProperty(exports, "BundleDescriptor", { enumerable: true, get: function () { return descriptor_1.BundleDescriptor; } });
Object.defineProperty(exports, "LongrunningDescriptor", { enumerable: true, get: function () { return descriptor_1.LongrunningDescriptor; } });
Object.defineProperty(exports, "PageDescriptor", { enumerable: true, get: function () { return descriptor_1.PageDescriptor; } });
Object.defineProperty(exports, "StreamDescriptor", { enumerable: true, get: function () { return descriptor_1.StreamDescriptor; } });
var streaming_1 = require("./streamingCalls/streaming");
Object.defineProperty(exports, "StreamType", { enumerable: true, get: function () { return streaming_1.StreamType; } });
const CLIENT_VERSION_HEADER = 'x-goog-api-client';
class GrpcClient {
    /**
     * gRPC-fallback version of GrpcClient
     * Implements GrpcClient API for a browser using grpc-fallback protocol (sends serialized protobuf to HTTP/1 $rpc endpoint).
     *
     * @param {Object=} options.auth - An instance of OAuth2Client to use in browser, or an instance of GoogleAuth from google-auth-library
     *  to use in Node.js. Required for browser, optional for Node.js.
     * @constructor
     */
    constructor(options = {}) {
        if (isbrowser_1.isBrowser()) {
            if (!options.auth) {
                throw new Error(JSON.stringify(options) +
                    'You need to pass auth instance to use gRPC-fallback client in browser. Use OAuth2Client from google-auth-library.');
            }
            this.auth = options.auth;
        }
        else {
            this.auth =
                options.auth ||
                    new google_auth_library_1.GoogleAuth(options);
        }
        this.fallback = options.fallback !== 'rest' ? 'proto' : 'rest';
        this.grpcVersion = 'fallback'; // won't be used anywhere but we need it to exist in the class
    }
    /**
     * gRPC-fallback version of loadProto
     * Loads the protobuf root object from a JSON object created from a proto file
     * @param {Object} jsonObject - A JSON version of a protofile created usin protobuf.js
     * @returns {Object} Root namespace of proto JSON
     */
    loadProto(jsonObject) {
        const rootObject = protobuf.Root.fromJSON(jsonObject);
        return rootObject;
    }
    getServiceMethods(service) {
        const methods = Object.keys(service.methods);
        const methodsLowerCamelCase = methods.map(method => {
            return method[0].toLowerCase() + method.substring(1);
        });
        return methodsLowerCamelCase;
    }
    /**
     * gRPC-fallback version of constructSettings
     * A wrapper of {@link constructSettings} function under the gRPC context.
     *
     * Most of parameters are common among constructSettings, please take a look.
     * @param {string} serviceName - The fullly-qualified name of the service.
     * @param {Object} clientConfig - A dictionary of the client config.
     * @param {Object} configOverrides - A dictionary of overriding configs.
     * @param {Object} headers - A dictionary of additional HTTP header name to
     *   its value.
     * @return {Object} A mapping of method names to CallSettings.
     */
    constructSettings(serviceName, clientConfig, configOverrides, headers) {
        function buildMetadata(abTests, moreHeaders) {
            const metadata = {};
            if (!headers) {
                headers = {};
            }
            // Since gRPC expects each header to be an array,
            // we are doing the same for fallback here.
            for (const key in headers) {
                metadata[key] = Array.isArray(headers[key])
                    ? headers[key]
                    : [headers[key]];
            }
            // gRPC-fallback request must have 'grpc-web/' in 'x-goog-api-client'
            const clientVersions = [];
            if (metadata[CLIENT_VERSION_HEADER] &&
                metadata[CLIENT_VERSION_HEADER][0]) {
                clientVersions.push(...metadata[CLIENT_VERSION_HEADER][0].split(' '));
            }
            clientVersions.push(`grpc-web/${exports.version}`);
            metadata[CLIENT_VERSION_HEADER] = [clientVersions.join(' ')];
            if (!moreHeaders) {
                return metadata;
            }
            for (const key in moreHeaders) {
                if (key.toLowerCase() !== CLIENT_VERSION_HEADER) {
                    const value = moreHeaders[key];
                    if (Array.isArray(value)) {
                        if (metadata[key] === undefined) {
                            metadata[key] = value;
                        }
                        else {
                            if (Array.isArray(metadata[key])) {
                                metadata[key].push(...value);
                            }
                            else {
                                throw new Error(`Can not add value ${value} to the call metadata.`);
                            }
                        }
                    }
                    else {
                        metadata[key] = [value];
                    }
                }
            }
            return metadata;
        }
        return gax.constructSettings(serviceName, clientConfig, configOverrides, status_1.Status, { metadataBuilder: buildMetadata });
    }
    /**
     * gRPC-fallback version of createStub
     * Creates a gRPC-fallback stub with authentication headers built from supplied OAuth2Client instance
     *
     * @param {function} CreateStub - The constructor function of the stub.
     * @param {Object} service - A protobufjs Service object (as returned by lookupService)
     * @param {Object} opts - Connection options, as described below.
     * @param {string} opts.servicePath - The hostname of the API endpoint service.
     * @param {number} opts.port - The port of the service.
     * @return {Promise} A promise which resolves to a gRPC-fallback service stub, which is a protobuf.js service stub instance modified to match the gRPC stub API
     */
    async createStub(service, opts) {
        // an RPC function to be passed to protobufjs RPC API
        function serviceClientImpl(method, requestData, callback) {
            return [method, requestData, callback];
        }
        // decoder for google.rpc.Status messages
        const statusDecoder = new fallbackError_1.FallbackErrorDecoder();
        if (!this.authClient) {
            if (this.auth && 'getClient' in this.auth) {
                this.authClient = await this.auth.getClient();
            }
            else if (this.auth && 'getRequestHeaders' in this.auth) {
                this.authClient = this.auth;
            }
        }
        if (!this.authClient) {
            throw new Error('No authentication was provided');
        }
        const authHeader = await this.authClient.getRequestHeaders();
        const serviceStub = service.create(serviceClientImpl, false, false);
        const methods = this.getServiceMethods(service);
        const newServiceStub = service.create(serviceClientImpl, false, false);
        for (const methodName of methods) {
            newServiceStub[methodName] = (req, options, metadata, callback) => {
                const [method, requestData, serviceCallback] = serviceStub[methodName].apply(serviceStub, [req, callback]);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let cancelController, cancelSignal;
                if (isbrowser_1.isBrowser && typeof AbortController !== 'undefined') {
                    // eslint-disable-next-line no-undef
                    cancelController = new AbortController();
                }
                else {
                    cancelController = new abort_controller_1.AbortController();
                }
                if (cancelController) {
                    cancelSignal = cancelController.signal;
                }
                let cancelRequested = false;
                const headers = Object.assign({}, authHeader);
                for (const key of Object.keys(options)) {
                    headers[key] = options[key][0];
                }
                const grpcFallbackProtocol = opts.protocol || 'https';
                let servicePath = opts.servicePath;
                if (!servicePath &&
                    service.options &&
                    service.options['(google.api.default_host)']) {
                    servicePath = service.options['(google.api.default_host)'];
                }
                if (!servicePath) {
                    serviceCallback(new Error('Service path is undefined'));
                    return;
                }
                let servicePort;
                const match = servicePath.match(/^(.*):(\d+)$/);
                if (match) {
                    servicePath = match[1];
                    servicePort = match[2];
                }
                if (opts.port) {
                    servicePort = opts.port;
                }
                else if (!servicePort) {
                    servicePort = 443;
                }
                const protoNamespaces = [];
                let currNamespace = method.parent;
                while (currNamespace.name !== '') {
                    protoNamespaces.unshift(currNamespace.name);
                    currNamespace = currNamespace.parent;
                }
                const protoServiceName = protoNamespaces.join('.');
                const rpcName = method.name;
                let url;
                let data;
                let httpMethod;
                // TODO(@alexander-fenster): refactor this into separate function that prepares
                // request object for `fetch`.
                if (this.fallback === 'rest') {
                    // REGAPIC: JSON over HTTP/1 with gRPC trancoding
                    headers['Content-Type'] = 'application/json';
                    const decodedRequest = method.resolvedRequestType.decode(requestData);
                    const requestJSON = method.resolvedRequestType.toObject(
                    // TODO: use toJSON instead of toObject
                    decodedRequest);
                    const transcoded = transcoding_1.transcode(requestJSON, method.parsedOptions);
                    if (!transcoded) {
                        throw new Error(`Cannot build HTTP request for ${JSON.stringify(requestJSON)}, method: ${method.name}`);
                    }
                    httpMethod = transcoded.httpMethod;
                    data = JSON.stringify(transcoded.data);
                    url = `${grpcFallbackProtocol}://${servicePath}:${servicePort}/${transcoded.url.replace(/^\//, '')}?${transcoded.queryString}`;
                }
                else {
                    // gRPC-fallback: proto over HTTP/1
                    headers['Content-Type'] = 'application/x-protobuf';
                    httpMethod = 'post';
                    data = requestData;
                    url = `${grpcFallbackProtocol}://${servicePath}:${servicePort}/$rpc/${protoServiceName}/${rpcName}`;
                }
                const fetch = isbrowser_1.isBrowser()
                    ? // eslint-disable-next-line no-undef
                        window.fetch
                    : nodeFetch;
                const fetchRequest = {
                    headers,
                    body: data,
                    method: httpMethod,
                    signal: cancelSignal,
                };
                if (httpMethod === 'get' ||
                    httpMethod === 'delete' ||
                    httpMethod === 'head') {
                    delete fetchRequest['body'];
                }
                fetch(url, fetchRequest)
                    .then((response) => {
                    return Promise.all([
                        Promise.resolve(response.ok),
                        response.arrayBuffer(),
                    ]);
                })
                    .then(([ok, buffer]) => {
                    // TODO(@alexander-fenster): response processing to be moved
                    // to a separate function.
                    if (this.fallback === 'rest') {
                        // REGAPIC: JSON over HTTP/1
                        // eslint-disable-next-line node/no-unsupported-features/node-builtins
                        const decodedString = new TextDecoder().decode(buffer);
                        const response = JSON.parse(decodedString);
                        if (!ok) {
                            const error = Object.assign(new Error(response['error']['message']), response.error);
                            throw error;
                        }
                        const message = method.resolvedResponseType.fromObject(response);
                        const encoded = method.resolvedResponseType
                            .encode(message)
                            .finish();
                        serviceCallback(null, encoded);
                    }
                    else {
                        // gRPC-fallback: proto over HTTP/1
                        if (!ok) {
                            const error = statusDecoder.decodeErrorFromBuffer(buffer);
                            throw error;
                        }
                        serviceCallback(null, new Uint8Array(buffer));
                    }
                })
                    .catch((err) => {
                    if (!cancelRequested || err.name !== 'AbortError') {
                        serviceCallback(err);
                    }
                });
                return {
                    cancel: () => {
                        if (!cancelController) {
                            console.warn('AbortController not found: Cancellation is not supported in this environment');
                            return;
                        }
                        cancelRequested = true;
                        cancelController.abort();
                    },
                };
            };
        }
        return newServiceStub;
    }
}
exports.GrpcClient = GrpcClient;
/**
 * gRPC-fallback version of lro
 *
 * @param {Object=} options.auth - An instance of google-auth-library.
 * @return {Object} A OperationsClientBuilder that will return a OperationsClient
 */
function lro(options) {
    options = Object.assign({ scopes: [] }, options);
    const gaxGrpc = new GrpcClient(options);
    return new operationsClient_1.OperationsClientBuilder(gaxGrpc);
}
exports.lro = lro;
/**
 * gRPC-fallback version of createApiCall
 *
 * Converts an rpc call into an API call governed by the settings.
 *
 * In typical usage, `func` will be a promise to a callable used to make an rpc
 * request. This will mostly likely be a bound method from a request stub used
 * to make an rpc call. It is not a direct function but a Promise instance,
 * because of its asynchronism (typically, obtaining the auth information).
 *
 * The result is a function which manages the API call with the given settings
 * and the options on the invocation.
 *
 * Throws exception on unsupported streaming calls
 *
 * @param {Promise<GRPCCall>|GRPCCall} func - is either a promise to be used to make
 *   a bare RPC call, or just a bare RPC call.
 * @param {CallSettings} settings - provides the settings for this call
 * @param {Descriptor} descriptor - optionally specify the descriptor for
 *   the method call.
 * @return {GaxCall} func - a bound method on a request stub used
 *   to make an rpc call.
 */
function createApiCall(func, settings, descriptor) {
    if (descriptor && 'streaming' in descriptor) {
        return () => {
            throw new Error('The gRPC-fallback client library (e.g. browser version of the library) currently does not support streaming calls.');
        };
    }
    return createApiCall_1.createApiCall(func, settings, descriptor);
}
exports.createApiCall = createApiCall;
exports.protobufMinimal = require("protobufjs/minimal");
// Different environments or bundlers may or may not respect "browser" field
// in package.json (e.g. Electron does not respect it, but if you run the code
// through webpack first, it will follow the "browser" field).
// To make it safer and more compatible, let's make sure that if you do
// const gax = require("google-gax");
// you can always ask for gax.fallback, regardless of "browser" field being
// understood or not.
const fallback = module.exports;
exports.fallback = fallback;
//# sourceMappingURL=fallback.js.map