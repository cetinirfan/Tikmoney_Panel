"use strict";
/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const query_partition_1 = require("./query-partition");
const util_1 = require("./util");
const logger_1 = require("./logger");
const reference_1 = require("./reference");
const path_1 = require("./path");
const validate_1 = require("./validate");
const types_1 = require("./types");
/**
 * A `CollectionGroup` refers to all documents that are contained in a
 * collection or subcollection with a specific collection ID.
 *
 * @class CollectionGroup
 */
class CollectionGroup extends reference_1.Query {
    /** @hideconstructor */
    constructor(firestore, collectionId, converter) {
        super(firestore, reference_1.QueryOptions.forCollectionGroupQuery(collectionId, converter));
    }
    /**
     * Partitions a query by returning partition cursors that can be used to run
     * the query in parallel. The returned cursors are split points that can be
     * used as starting and end points for individual query invocations.
     *
     * @example
     * const query = firestore.collectionGroup('collectionId');
     * for await (const partition of query.getPartitions(42)) {
     *   const partitionedQuery = partition.toQuery();
     *   const querySnapshot = await partitionedQuery.get();
     *   console.log(`Partition contained ${querySnapshot.length} documents`);
     * }
     *
     * @param {number} desiredPartitionCount The desired maximum number of
     * partition points. The number must be strictly positive. The actual number
     * of partitions returned may be fewer.
     * @return {AsyncIterable<QueryPartition>} An AsyncIterable of
     * `QueryPartition`s.
     */
    async *getPartitions(desiredPartitionCount) {
        var _a;
        validate_1.validateInteger('desiredPartitionCount', desiredPartitionCount, {
            minValue: 1,
        });
        const tag = util_1.requestTag();
        await this.firestore.initializeIfNeeded(tag);
        let lastValues = undefined;
        let partitionCount = 0;
        if (desiredPartitionCount > 1) {
            // Partition queries require explicit ordering by __name__.
            const queryWithDefaultOrder = this.orderBy(path_1.FieldPath.documentId());
            const request = queryWithDefaultOrder.toProto();
            // Since we are always returning an extra partition (with an empty endBefore
            // cursor), we reduce the desired partition count by one.
            request.partitionCount = desiredPartitionCount - 1;
            const stream = await this.firestore.requestStream('partitionQueryStream', request, tag);
            stream.resume();
            for await (const currentCursor of stream) {
                ++partitionCount;
                const currentValues = (_a = currentCursor.values) !== null && _a !== void 0 ? _a : [];
                yield new query_partition_1.QueryPartition(this._firestore, this._queryOptions.collectionId, this._queryOptions.converter, lastValues, currentValues);
                lastValues = currentValues;
            }
        }
        logger_1.logger('Firestore.getPartitions', tag, 'Received %d partitions', partitionCount);
        // Return the extra partition with the empty cursor.
        yield new query_partition_1.QueryPartition(this._firestore, this._queryOptions.collectionId, this._queryOptions.converter, lastValues, undefined);
    }
    withConverter(converter) {
        return new CollectionGroup(this.firestore, this._queryOptions.collectionId, converter !== null && converter !== void 0 ? converter : types_1.defaultConverter());
    }
}
exports.CollectionGroup = CollectionGroup;
//# sourceMappingURL=collection-group.js.map